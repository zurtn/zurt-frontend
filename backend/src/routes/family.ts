import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import crypto from 'crypto';
import { db } from '../db/connection.js';
import { sendFamilyInviteEmail } from '../utils/email.js';

const MAX_FAMILY_MEMBERS = 5;

function generateInviteCode(): string {
  return crypto.randomBytes(6).toString('hex').toUpperCase().slice(0, 12);
}

function getFirstName(fullName: string): string {
  return (fullName || '').split(' ')[0] || 'Membro';
}

export async function familyRoutes(fastify: FastifyInstance) {
  fastify.addHook('onRequest', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await (request as any).jwtVerify();
    } catch {
      return reply.code(401).send({ error: 'Unauthorized' });
    }
  });

  const getUserId = (request: FastifyRequest) => (request.user as any).userId;

  // GET /api/family/group
  fastify.get('/group', async (request, reply) => {
    try {
      const userId = getUserId(request);
      const result = await db.query(`
        SELECT fg.*, fm.role as my_role, COALESCE(u.full_name, fm.invited_email) as my_display_name,
               (SELECT count(*) FROM family_members fm2 WHERE fm2.group_id = fg.id) as member_count
        FROM family_groups fg
        JOIN family_members fm ON fm.group_id = fg.id AND fm.user_id = $1
        LEFT JOIN users u ON u.id = fm.user_id
        ORDER BY (SELECT count(*) FROM family_members fm2 WHERE fm2.group_id = fg.id) DESC
        LIMIT 1
      `, [userId]);

      if (result.rows.length === 0) {
        return reply.send({ group: null });
      }

      const group = result.rows[0];

      const members = await db.query(`
        SELECT fm.id, fm.user_id, COALESCE(u.full_name, fm.display_name, fm.invited_email) as display_name,
               fm.role, fm.accepted_at,
               u.email,
               fp.can_view_consolidated, fp.can_view_individual_patrimony,
               fp.can_view_transactions, fp.can_view_cards, fp.can_view_investments
        FROM family_members fm
        JOIN users u ON u.id = fm.user_id
        LEFT JOIN family_permissions fp ON fp.member_id = fm.id AND fp.group_id = fm.group_id
        WHERE fm.group_id = $1
        ORDER BY fm.role ASC, COALESCE(u.full_name, fm.invited_email) ASC
      `, [group.id]);

      const invites = await db.query(`
        SELECT id, email, invite_code, status, expires_at, created_at
        FROM family_invites
        WHERE group_id = $1 AND status = 'pending' AND expires_at > NOW()
        ORDER BY created_at DESC
      `, [group.id]);

      return reply.send({
        group: {
          id: group.id,
          owner_id: group.owner_id,
          name: group.name,
          createdAt: group.created_at,
          myRole: group.my_role,
          myDisplayName: group.my_display_name,
          memberCount: parseInt(group.member_count) || 0,
          members: members.rows.map((m: any) => ({
            id: m.id,
            userId: m.user_id,
            displayName: m.display_name,
            role: m.role,
            joinedAt: m.accepted_at,
            email: m.email,
            avatarUrl: null,
            permissions: {
              canViewConsolidated: m.can_view_consolidated ?? true,
              canViewIndividualPatrimony: m.can_view_individual_patrimony ?? false,
              canViewTransactions: m.can_view_transactions ?? false,
              canViewCards: m.can_view_cards ?? false,
              canViewInvestments: m.can_view_investments ?? false,
            }
          })),
          pendingInvites: invites.rows,
        }
      });
    } catch (error: any) {
      fastify.log.error('Error fetching family group: ' + (error instanceof Error ? error.message + ' -- ' + error.stack : JSON.stringify(error)));
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });

  // POST /api/family/group
  fastify.post('/group', async (request, reply) => {
    try {
      const userId = getUserId(request);
      const { name } = request.body as { name: string };

      if (!name || name.trim().length === 0) {
        return reply.code(400).send({ error: 'Nome do grupo é obrigatório' });
      }

      const existing = await db.query(
        'SELECT id FROM family_members WHERE user_id = $1', [userId]
      );
      if (existing.rows.length > 0) {
        return reply.code(400).send({ error: 'Você já faz parte de um grupo familiar' });
      }

      const userResult = await db.query('SELECT full_name FROM users WHERE id = $1', [userId]);
      const displayName = getFirstName(userResult.rows[0]?.full_name);

      const groupResult = await db.query(
        'INSERT INTO family_groups (name, owner_id) VALUES ($1, $2) RETURNING *',
        [name.trim(), userId]
      );
      const group = groupResult.rows[0];

      const memberResult = await db.query(
        'INSERT INTO family_members (group_id, user_id, display_name, role) VALUES ($1, $2, $3, $4) RETURNING *',
        [group.id, userId, displayName, 'admin']
      );

      await db.query(`
        INSERT INTO family_permissions (group_id, member_id, can_view_consolidated, can_view_individual_patrimony, can_view_transactions, can_view_cards, can_view_investments)
        VALUES ($1, $2, true, true, true, true, true)
      `, [group.id, memberResult.rows[0].id]);

      return reply.code(201).send({ group: { id: group.id, name: group.name } });
    } catch (error: any) {
      fastify.log.error('Error creating family group:', error);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });

  // POST /api/family/invite
  fastify.post('/invite', async (request, reply) => {
    try {
      const userId = getUserId(request);
      const { email } = request.body as { email?: string };

      const member = await db.query(
        'SELECT fm.group_id, fm.role FROM family_members fm WHERE fm.user_id = $1', [userId]
      );

      if (member.rows.length === 0) {
        return reply.code(404).send({ error: 'Você não faz parte de um grupo familiar' });
      }

      const { group_id, role } = member.rows[0];
      if (role === 'member') {
        return reply.code(403).send({ error: 'Apenas admin ou co-admin podem convidar' });
      }

      // FIX: Enforce member limit
      const countResult = await db.query(
        'SELECT count(*) FROM family_members WHERE group_id = $1', [group_id]
      );
      const pendingResult = await db.query(
        "SELECT count(*) FROM family_invites WHERE group_id = $1 AND status = 'pending' AND expires_at > NOW()", [group_id]
      );
      const totalCount = parseInt(countResult.rows[0].count) + parseInt(pendingResult.rows[0].count);
      if (totalCount >= MAX_FAMILY_MEMBERS) {
        return reply.code(400).send({ error: `Limite de ${MAX_FAMILY_MEMBERS} membros atingido (incluindo convites pendentes)` });
      }

      const inviteCode = generateInviteCode();
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      await db.query(`
        INSERT INTO family_invites (group_id, invited_by, email, invite_code, expires_at)
        VALUES ($1, $2, $3, $4, $5)
      `, [group_id, userId, email || null, inviteCode, expiresAt]);

      if (email) {
        const inviter = await db.query("SELECT full_name FROM users WHERE id = $1", [userId]);
        const group = await db.query("SELECT name FROM family_groups WHERE id = $1", [group_id]);
        const inviteUrl = `https://zurt.com.br/family/join/${inviteCode}`;
        sendFamilyInviteEmail(email, email, inviter.rows[0]?.full_name ?? "Administrador", group.rows[0]?.name ?? "Grupo Familiar", "Membro", inviteUrl, "7 dias").catch(e => console.error("[Email] family invite failed:", e));
      }
      return reply.code(201).send({
        code: inviteCode,
        link: `https://zurt.com.br/family/join/${inviteCode}`,
        expiresAt,
      });
    } catch (error: any) {
      fastify.log.error('Error creating family invite:', error);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });


  // DELETE /api/family/invites/:inviteId — cancel pending invite
  fastify.delete("/invites/:inviteId", async (request, reply) => {
    try {
      const userId = getUserId(request);
      const { inviteId } = request.params as { inviteId: string };
      const group = await db.query(
        "SELECT fg.id FROM family_groups fg JOIN family_members fm ON fm.group_id = fg.id AND fm.user_id = $1 WHERE fm.role IN ('admin', 'co-admin')",
        [userId]
      );
      if (group.rows.length === 0) return reply.code(403).send({ error: "Only admin/co-admin can cancel invites" });
      const result = await db.query(
        "DELETE FROM family_invites WHERE id = $1 AND group_id = $2 AND status = 'pending' RETURNING id",
        [inviteId, group.rows[0].id]
      );
      if (result.rows.length === 0) return reply.code(404).send({ error: "Invite not found or already used" });
      return reply.send({ success: true });
    } catch (error) {
      fastify.log.error("Error canceling invite: " + (error instanceof Error ? error.message : String(error)));
      return reply.code(500).send({ error: "Internal server error" });
    }
  });
  // POST /api/family/join/:code
  fastify.post('/join/:code', async (request, reply) => {
    try {
      const userId = getUserId(request);
      const { code } = request.params as { code: string };

      const existing = await db.query(
        'SELECT id FROM family_members WHERE user_id = $1', [userId]
      );
      if (existing.rows.length > 0) {
        return reply.code(400).send({ error: 'Você já faz parte de um grupo familiar' });
      }

      const invite = await db.query(`
        SELECT * FROM family_invites
        WHERE invite_code = $1 AND status = 'pending' AND expires_at > NOW()
      `, [code]);

      if (invite.rows.length === 0) {
        return reply.code(404).send({ error: 'Convite inválido ou expirado' });
      }

      const inv = invite.rows[0];

      // FIX: Check member limit before joining
      const countResult = await db.query(
        'SELECT count(*) FROM family_members WHERE group_id = $1', [inv.group_id]
      );
      if (parseInt(countResult.rows[0].count) >= MAX_FAMILY_MEMBERS) {
        return reply.code(400).send({ error: `Grupo já atingiu o limite de ${MAX_FAMILY_MEMBERS} membros` });
      }

      const userResult = await db.query('SELECT full_name FROM users WHERE id = $1', [userId]);
      const displayName = getFirstName(userResult.rows[0]?.full_name);

      const memberResult = await db.query(
        'INSERT INTO family_members (group_id, user_id, display_name, role) VALUES ($1, $2, $3, $4) RETURNING *',
        [inv.group_id, userId, displayName, 'member']
      );

      await db.query(`
        INSERT INTO family_permissions (group_id, member_id, can_view_consolidated, can_view_individual_patrimony, can_view_transactions, can_view_cards, can_view_investments)
        VALUES ($1, $2, true, false, false, false, false)
      `, [inv.group_id, memberResult.rows[0].id]);

      await db.query(
        'UPDATE family_invites SET status = $1, accepted_by = $2, accepted_at = NOW() WHERE id = $3',
        ['accepted', userId, inv.id]
      );

      return reply.send({ message: 'Você entrou no grupo familiar!', groupId: inv.group_id });
    } catch (error: any) {
      fastify.log.error('Error joining family group:', error);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });

  // PUT /api/family/members/:memberId/role
  fastify.put('/members/:memberId/role', async (request, reply) => {
    try {
      const userId = getUserId(request);
      const { memberId } = request.params as { memberId: string };
      const { role: newRole } = request.body as { role: string };

      if (!['co-admin', 'member'].includes(newRole)) {
        return reply.code(400).send({ error: 'Role inválido' });
      }

      const admin = await db.query(
        "SELECT fm.group_id FROM family_members fm WHERE fm.user_id = $1 AND fm.role = 'admin'", [userId]
      );

      if (admin.rows.length === 0) {
        return reply.code(403).send({ error: 'Apenas o admin pode alterar roles' });
      }

      await db.query(
        'UPDATE family_members SET role = $1 WHERE id = $2 AND group_id = $3',
        [newRole, memberId, admin.rows[0].group_id]
      );

      return reply.send({ message: 'Role atualizado' });
    } catch (error: any) {
      fastify.log.error('Error updating member role:', error);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });

  // PUT /api/family/members/:memberId/permissions
  fastify.put('/members/:memberId/permissions', async (request, reply) => {
    try {
      const userId = getUserId(request);
      const { memberId } = request.params as { memberId: string };
      const perms = request.body as any;

      const admin = await db.query(
        "SELECT fm.group_id FROM family_members fm WHERE fm.user_id = $1 AND fm.role IN ('admin', 'co-admin')", [userId]
      );

      if (admin.rows.length === 0) {
        return reply.code(403).send({ error: 'Sem permissão' });
      }

      const groupId = admin.rows[0].group_id;

      await db.query(`
        UPDATE family_permissions SET
          can_view_consolidated = COALESCE($1, can_view_consolidated),
          can_view_individual_patrimony = COALESCE($2, can_view_individual_patrimony),
          can_view_transactions = COALESCE($3, can_view_transactions),
          can_view_cards = COALESCE($4, can_view_cards),
          can_view_investments = COALESCE($5, can_view_investments),
          updated_at = NOW()
        WHERE member_id = $6 AND group_id = $7
      `, [
        perms.canViewConsolidated, perms.canViewIndividualPatrimony,
        perms.canViewTransactions, perms.canViewCards, perms.canViewInvestments,
        memberId, groupId
      ]);

      return reply.send({ message: 'Permissões atualizadas' });
    } catch (error: any) {
      fastify.log.error('Error updating permissions:', error);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });

  // DELETE /api/family/members/:memberId
  fastify.delete('/members/:memberId', async (request, reply) => {
    try {
      const userId = getUserId(request);
      const { memberId } = request.params as { memberId: string };

      const admin = await db.query(
        "SELECT fm.group_id FROM family_members fm WHERE fm.user_id = $1 AND fm.role IN ('admin', 'co-admin')", [userId]
      );

      if (admin.rows.length === 0) {
        return reply.code(403).send({ error: 'Sem permissão' });
      }

      const groupId = admin.rows[0].group_id;

      const target = await db.query(
        'SELECT role FROM family_members WHERE id = $1 AND group_id = $2', [memberId, groupId]
      );
      if (target.rows.length === 0) {
        return reply.code(404).send({ error: 'Membro não encontrado' });
      }
      if (target.rows[0]?.role === 'admin') {
        return reply.code(403).send({ error: 'Não é possível remover o admin' });
      }

      await db.query('DELETE FROM family_permissions WHERE member_id = $1 AND group_id = $2', [memberId, groupId]);
      await db.query('DELETE FROM family_members WHERE id = $1 AND group_id = $2', [memberId, groupId]);

      return reply.send({ message: 'Membro removido' });
    } catch (error: any) {
      fastify.log.error('Error removing member:', error);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });

  // GET /api/family/dashboard — FIX: single query instead of N+1
  fastify.get('/dashboard', async (request, reply) => {
    try {
      const userId = getUserId(request);

      const memberResult = await db.query(`
        SELECT fm.group_id, fm.role, fp.can_view_consolidated, fp.can_view_individual_patrimony
        FROM family_members fm
        LEFT JOIN family_permissions fp ON fp.member_id = fm.id AND fp.group_id = fm.group_id
        WHERE fm.user_id = $1
      `, [userId]);

      if (memberResult.rows.length === 0) {
        return reply.code(404).send({ error: 'Você não faz parte de um grupo' });
      }

      const { group_id, role, can_view_consolidated, can_view_individual_patrimony } = memberResult.rows[0];
      const isAdminOrCoAdmin = role === 'admin' || role === 'co-admin';

      // FIX: Single aggregated query instead of N+1
      const allMembers = await db.query(`
        SELECT
          fm.id, fm.user_id, COALESCE(u.full_name, fm.display_name, fm.invited_email) as display_name, fm.role,
          COALESCE((SELECT SUM(bal) FROM (SELECT DISTINCT ON (name) CAST(current_balance AS DECIMAL) as bal FROM pluggy_accounts WHERE user_id = fm.user_id AND type NOT IN ('CREDIT_CARD', 'CREDIT') ORDER BY name, updated_at DESC) t), 0) as bank_balance,
          COALESCE((SELECT SUM(val) FROM (SELECT DISTINCT ON (name) CAST(current_value AS DECIMAL) as val FROM pluggy_investments WHERE user_id = fm.user_id ORDER BY name, updated_at DESC) t), 0) as holdings_value
        FROM family_members fm
        LEFT JOIN users u ON u.id = fm.user_id
        WHERE fm.group_id = $1
      `, [group_id]);

      const memberBreakdown = allMembers.rows.map((m: any) => {
        const bankBalance = Number(m.bank_balance);
        const holdingsValue = Number(m.holdings_value);
        const totalPatrimony = bankBalance + holdingsValue;

        if (isAdminOrCoAdmin || can_view_individual_patrimony || m.user_id === userId) {
          return {
            memberId: m.id, displayName: m.display_name, role: m.role,
            netWorth: totalPatrimony, patrimony: totalPatrimony, bankBalance, holdingsValue, visible: true,
          };
        } else {
          return {
            memberId: m.id, displayName: m.display_name, role: m.role,
            netWorth: 0, patrimony: null, bankBalance: null, holdingsValue: null, visible: false,
          };
        }
      });

      const totalFamilyPatrimony = memberBreakdown.reduce((sum: number, m: any) => sum + (m.patrimony ?? 0), 0);

      return reply.send({
        totalNetWorth: (isAdminOrCoAdmin || can_view_consolidated) ? totalFamilyPatrimony : 0,
        totalPatrimony: (isAdminOrCoAdmin || can_view_consolidated) ? totalFamilyPatrimony : null,
        members: memberBreakdown,
      });
    } catch (error: any) {
      fastify.log.error('Error fetching family dashboard:', error);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });

  // GET /api/family/member/:userId/profile — FIX: respect permissions
  fastify.get("/member/:userId/profile", {
    preHandler: [fastify.authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const requesterId = (request.user as any).userId;
      const { userId: targetUserId } = request.params as { userId: string };

      // Verify requester and target are in the same group + get permissions
      const check = await db.query(`
        SELECT fm1.group_id, fm1.role as requester_role,
               fp.can_view_individual_patrimony, fp.can_view_transactions,
               fp.can_view_cards, fp.can_view_investments
        FROM family_members fm1
        JOIN family_members fm2 ON fm2.group_id = fm1.group_id AND fm2.user_id = $2
        LEFT JOIN family_permissions fp ON fp.member_id = fm1.id AND fp.group_id = fm1.group_id
        WHERE fm1.user_id = $1
        LIMIT 1
      `, [requesterId, targetUserId]);

      if (check.rows.length === 0) {
        return reply.code(403).send({ error: "Not in the same family group" });
      }

      const perm = check.rows[0];
      const isAdminOrCoAdmin = perm.requester_role === 'admin' || perm.requester_role === 'co-admin';
      const isSelf = requesterId === targetUserId;

      // Get user info (always visible)
      const userResult = await db.query(
        "SELECT id, full_name, email, role FROM users WHERE id = $1",
        [targetUserId]
      );
      if (userResult.rows.length === 0) {
        return reply.code(404).send({ error: "User not found" });
      }
      const user = userResult.rows[0];

      const response: any = {
        full_name: user.full_name,
        email: user.email,
        role: perm.requester_role,
      };

      // FIX: Only return financial data if permissions allow
      const canViewPatrimony = isSelf || isAdminOrCoAdmin || perm.can_view_individual_patrimony;
      const canViewTransactions = isSelf || isAdminOrCoAdmin || perm.can_view_transactions;
      const canViewCards = isSelf || isAdminOrCoAdmin || perm.can_view_cards;
      const canViewInvestments = isSelf || isAdminOrCoAdmin || perm.can_view_investments;

      if (canViewPatrimony) {
        const accountsResult = await db.query(
          "SELECT name, type, CAST(current_balance AS DECIMAL) as balance FROM (SELECT DISTINCT ON (name) * FROM pluggy_accounts WHERE user_id = $1 AND type NOT IN ('CREDIT_CARD', 'CREDIT') ORDER BY name, updated_at DESC) t ORDER BY balance DESC",
          [targetUserId]
        );
        response.accounts = accountsResult.rows.map((a: any) => ({ name: a.name, balance: Number(a.balance) }));
        response.netWorth = response.accounts.reduce((s: number, a: any) => s + a.balance, 0);
      } else {
        response.accounts = [];
        response.netWorth = null;
      }

      if (canViewInvestments) {
        const investResult = await db.query(
          "SELECT name, type, CAST(current_value AS DECIMAL) as current_value, quantity FROM (SELECT DISTINCT ON (name) * FROM pluggy_investments WHERE user_id = $1 ORDER BY name, updated_at DESC) t ORDER BY current_value DESC",
          [targetUserId]
        );
        response.investments = investResult.rows.map((i: any) => ({ name: i.name, type: i.type, currentValue: Number(i.current_value), quantity: Number(i.quantity) }));
        if (response.netWorth !== null) {
          response.netWorth += response.investments.reduce((s: number, i: any) => s + i.currentValue, 0);
        }
      } else {
        response.investments = [];
      }

      if (canViewCards) {
        const cardsResult = await db.query(
          "SELECT name, CAST(current_balance AS DECIMAL) as balance FROM (SELECT DISTINCT ON (name) * FROM pluggy_accounts WHERE user_id = $1 AND type IN ('CREDIT_CARD', 'CREDIT') ORDER BY name, updated_at DESC) t ORDER BY name",
          [targetUserId]
        );
        response.cards = cardsResult.rows.map((c: any) => ({ name: c.name, balance: Math.abs(Number(c.balance)) }));
      } else {
        response.cards = [];
      }

      return reply.send(response);
    } catch (error: any) {
      fastify.log.error('Error fetching member profile:', error);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });

  // DELETE /api/family/group
  fastify.delete('/group', async (request, reply) => {
    try {
      const userId = getUserId(request);

      const admin = await db.query(
        "SELECT fm.group_id FROM family_members fm WHERE fm.user_id = $1 AND fm.role = 'admin'", [userId]
      );

      if (admin.rows.length === 0) {
        return reply.code(403).send({ error: 'Apenas o admin pode excluir o grupo' });
      }

      const groupId = admin.rows[0].group_id;

      // Clean up in order (CASCADE on FK now handles members, but be explicit)
      await db.query('DELETE FROM family_invites WHERE group_id = $1', [groupId]);
      await db.query('DELETE FROM family_groups WHERE id = $1', [groupId]);

      return reply.send({ message: 'Grupo excluído' });
    } catch (error: any) {
      fastify.log.error('Error deleting family group:', error);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });
}
