import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { db } from '../db/connection.js';

// Card color map by institution/brand
function resolveCardColors(institutionName: string, brand: string): { color: string; secondaryColor: string } {
  const inst = (institutionName || '').toLowerCase();
  const br = (brand || '').toLowerCase();
  if (inst.includes('itaú') || inst.includes('itau')) return { color: '#EC7000', secondaryColor: '#FDB913' };
  if (inst.includes('nubank') || inst.includes('nu ')) return { color: '#820AD1', secondaryColor: '#A83FF0' };
  if (inst.includes('bradesco')) return { color: '#CC092F', secondaryColor: '#E0234E' };
  if (inst.includes('santander')) return { color: '#EC0000', secondaryColor: '#FF3333' };
  if (inst.includes('btg')) return { color: '#1A1A2E', secondaryColor: '#16213E' };
  if (inst.includes('inter')) return { color: '#FF7A00', secondaryColor: '#FF9933' };
  if (inst.includes('c6')) return { color: '#2A2A2A', secondaryColor: '#4A4A4A' };
  if (inst.includes('caixa')) return { color: '#005CA9', secondaryColor: '#0070CC' };
  if (inst.includes('banco do brasil') || inst.includes(' bb')) return { color: '#FFEF00', secondaryColor: '#005CA9' };
  if (br === 'mastercard') return { color: '#EB001B', secondaryColor: '#FF5F00' };
  if (br === 'visa') return { color: '#1A1F71', secondaryColor: '#2E3192' };
  return { color: '#1A1A2E', secondaryColor: '#2A3040' };
}

export async function cardsRoutes(fastify: FastifyInstance) {
  fastify.get('/', {
    preHandler: [fastify.authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = (request.user as any).userId;
      const result = await db.query(
        `SELECT DISTINCT ON (pc.last4)
          pc.id, pc.pluggy_card_id, pc.brand, pc.last4,
          pc."limit" AS limit_amount, pc.available_limit,
          pc.balance, pc.item_id, pc.updated_at,
          i.name AS institution_name, i.logo_url AS institution_logo
        FROM pluggy_credit_cards pc
        LEFT JOIN connections c
          ON c.external_consent_id = pc.item_id AND c.user_id = pc.user_id
        LEFT JOIN institutions i ON c.institution_id = i.id
        WHERE pc.user_id = $1
        ORDER BY pc.last4, pc.updated_at DESC`,
        [userId]
      );

      const cards = result.rows.map((row: any) => {
        const limitVal = row.limit_amount ? parseFloat(row.limit_amount) : 0;
        const balanceVal = row.balance ? parseFloat(row.balance) : 0;
        const availableVal = row.available_limit ? parseFloat(row.available_limit) : 0;
        const instName = row.institution_name || '';
        const brandName = row.brand || '';
        const last4 = row.last4 || '';
        const colors = resolveCardColors(instName, brandName);
        const cleanName = instName || brandName || 'Cartão';

        return {
          // === Original fields (keep for backwards compat) ===
          id: row.id,
          display_name: `${cleanName} •••• ${last4}`,
          brand: brandName,
          last4: last4,
          limit_amount: limitVal,
          limit_cents: Math.round(limitVal * 100),
          available_limit: availableVal,
          balance: balanceVal,
          balance_cents: Math.round(balanceVal * 100),
          currency: 'BRL',
          institution_name: instName,
          institution_logo: row.institution_logo,
          updated_at: row.updated_at,

          // === Fields the frontend CreditCard type expects ===
          name: cleanName,
          lastFour: last4,
          last_four: last4,
          limit: limitVal,
          credit_limit: limitVal,
          used: balanceVal,
          currentInvoice: balanceVal,
          current_invoice: balanceVal,
          nextInvoice: 0,
          next_invoice: 0,
          dueDate: '',
          due_date: '',
          closingDate: '',
          closing_date: '',
          color: colors.color,
          secondaryColor: colors.secondaryColor,
          secondary_color: colors.secondaryColor,
        };
      });

      return reply.send({ cards });
    } catch (error: any) {
      fastify.log.error('Error fetching credit cards:', error);
      return reply.send({ cards: [] });
    }
  });

  fastify.get('/:cardId/invoices', {
    preHandler: [fastify.authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = (request.user as any).userId;
      const { cardId } = request.params as any;
      const cardResult = await db.query(
        'SELECT pluggy_card_id FROM pluggy_credit_cards WHERE id = $1 AND user_id = $2',
        [cardId, userId]
      );
      if (cardResult.rows.length === 0) return reply.send({ invoices: [] });
      const result = await db.query(
        `SELECT id, due_date, amount, status FROM pluggy_card_invoices
         WHERE user_id = $1 AND pluggy_card_id = $2 ORDER BY due_date DESC`,
        [userId, cardResult.rows[0].pluggy_card_id]
      );
      const invoices = result.rows.map((row: any) => ({
        id: row.id, due_date: row.due_date,
        total_cents: row.amount ? Math.round(parseFloat(row.amount) * 100) : 0,
        total_amount: row.amount ? parseFloat(row.amount) : 0,
        status: row.status,
      }));
      return reply.send({ invoices });
    } catch (error: any) {
      fastify.log.error('Error fetching card invoices:', error);
      return reply.send({ invoices: [] });
    }
  });

  fastify.post('/', {
    preHandler: [fastify.authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = (request.user as any).userId;
      const { displayName, brand, last4, limitCents, currency = 'BRL' } = request.body as any;
      if (!displayName || !brand || !last4) return reply.code(400).send({ error: 'displayName, brand, and last4 required' });
      if (!/^\d{4}$/.test(last4)) return reply.code(400).send({ error: 'last4 must be 4 digits' });
      const result = await db.query(
        `INSERT INTO pluggy_credit_cards (user_id, item_id, pluggy_card_id, brand, last4, "limit", balance, updated_at)
         VALUES ($1, 'manual', $2, $3, $4, $5, 0, NOW()) RETURNING id, brand, last4, "limit", balance`,
        [userId, `manual-${Date.now()}`, brand, last4, limitCents ? limitCents / 100 : null]
      );
      const card = result.rows[0];
      return reply.code(201).send({ card: { id: card.id, display_name: `${displayName} •••• ${last4}`, brand: card.brand, last4: card.last4, limit_amount: card.limit ? parseFloat(card.limit) : null, balance: 0, currency } });
    } catch (error: any) {
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });

  fastify.delete('/:id', {
    preHandler: [fastify.authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = (request.user as any).userId;
      const { id } = request.params as any;
      const card = await db.query('SELECT pluggy_card_id FROM pluggy_credit_cards WHERE id = $1 AND user_id = $2', [id, userId]);
      if (card.rows.length === 0) return reply.code(404).send({ error: 'Not found' });
      await db.query('DELETE FROM pluggy_card_invoices WHERE pluggy_card_id = $1 AND user_id = $2', [card.rows[0].pluggy_card_id, userId]);
      await db.query('DELETE FROM pluggy_credit_cards WHERE id = $1 AND user_id = $2', [id, userId]);
      return reply.send({ success: true });
    } catch (error: any) {
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });
}
