import cron from 'node-cron';
import { db } from '../db/connection.js';
import { sendPushToAll, sendPushToTokens } from './push-service.js';

const BRAPI_TOKEN = process.env.BRAPI_TOKEN || '';

// ── Data fetchers ────────────────────────────────────────────────────────────

async function getCurrentSelic(): Promise<string> {
  try {
    const res = await fetch(`https://brapi.dev/api/v2/prime-rate?country=brazil&sortBy=date&sortOrder=desc&token=${BRAPI_TOKEN}`);
    const data = await res.json() as any;
    const rates = data?.['prime-rate'] ?? data?.prime_rate ?? []; return rates?.[0]?.value ?? '14.75';
  } catch { return 'N/A'; }
}

async function getCurrentUSD(): Promise<string> {
  try {
    const res = await fetch('https://economia.awesomeapi.com.br/last/USD-BRL');
    const data = await res.json() as any;
    return parseFloat(data?.USDBRL?.bid || '0').toFixed(2);
  } catch { return 'N/A'; }
}

// ── Preference-aware send ────────────────────────────────────────────────────

async function sendWithPreference(prefKey: string, title: string, body: string, data?: Record<string, any>): Promise<number> {
  // Check push_preferences table first, fallback to users.push_preferences JSON
  const result = await db.query(`
    SELECT u.push_token FROM users u
    LEFT JOIN push_preferences pp ON pp.user_id = u.id
    WHERE u.push_token IS NOT NULL AND u.is_active = true
    AND (pp.${prefKey} IS NULL OR pp.${prefKey} = true)
  `);
  const tokens = result.rows.map((r: any) => r.push_token).filter(Boolean);
  return sendPushToTokens(tokens, title, body, data);
}

// ── Event Alerts — Daily 8:00 ────────────────────────────────────────────────

async function sendEventAlerts(): Promise<void> {
  console.log('[EventCron] Checking economic calendar...');
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const events = await db.query(
    `SELECT * FROM economic_calendar
     WHERE event_date IN ($1, $2) AND importance = 'high' AND notified = false
     ORDER BY event_date, event_time`,
    [today, tomorrow]
  );

  if (events.rows.length === 0) {
    console.log('[EventCron] No upcoming high-importance events');
    return;
  }

  for (const event of events.rows) {
    const isToday = event.event_date.toISOString().split('T')[0] === today;
    const when = isToday ? 'HOJE' : 'AMANHA';

    let title: string;
    let body: string;

    if (event.category === 'interest_rate' && event.country === 'BR') {
      const selic = await getCurrentSelic();
      title = `\uD83C\uDFDB\uFE0F ${when}: ${event.event_name}`;
      body = `Selic atual: ${selic}% a.a.${event.forecast_value ? ' | Projecao: ' + event.forecast_value : ''}`;
    } else if (event.category === 'interest_rate' && event.country === 'US') {
      title = `\uD83C\uDDFA\uD83C\uDDF8 ${when}: ${event.event_name}`;
      body = event.previous_value
        ? `Atual: ${event.previous_value}${event.forecast_value ? ' | Projecao: ' + event.forecast_value : ''}`
        : event.description || 'Decisao de juros nos EUA';
    } else {
      title = `\uD83D\uDCCA ${when}: ${event.event_name}`;
      body = event.description || `Evento de alta importancia`;
    }

    const sent = await sendWithPreference('event_alerts', title, body, {
      type: 'event_alert', eventId: event.id, screen: '/alerts',
    });
    console.log(`[EventCron] Event "${event.event_name}" sent to ${sent} users`);

    await db.query('UPDATE economic_calendar SET notified = true WHERE id = $1', [event.id]);
  }
}

// ── Patrimony Weekly — Friday 18:00 ─────────────────────────────────────────

async function sendPatrimonyWeekly(): Promise<void> {
  console.log('[PatrimonyCron] Sending weekly summaries...');

  const users = await db.query(`
    SELECT u.id, u.push_token, u.full_name FROM users u
    LEFT JOIN push_preferences pp ON pp.user_id = u.id
    WHERE u.push_token IS NOT NULL AND u.is_active = true
    AND (pp.patrimony_weekly IS NULL OR pp.patrimony_weekly = true)
  `);

  let sent = 0;
  for (const user of users.rows) {
    try {
      const result = await db.query(`
        SELECT COALESCE(SUM(CAST(current_balance AS DECIMAL)), 0) as total
        FROM pluggy_accounts WHERE user_id = $1 AND type != 'CREDIT'
      `, [user.id]);

      const total = parseFloat(result.rows[0]?.total || '0');
      if (total <= 0) continue;

      const formatted = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      const name = (user.full_name || '').split(' ')[0] || '';
      const title = '\uD83D\uDCCA Resumo semanal';
      const body = name
        ? `${name}, seu patrimonio consolidado: ${formatted}`
        : `Patrimonio consolidado: ${formatted}`;

      await sendPushToTokens([user.push_token], title, body, { type: 'patrimony_weekly', screen: '/(tabs)' });
      sent++;
    } catch (err: any) {
      console.error(`[PatrimonyCron] Error for user ${user.id}:`, err.message);
    }
  }
  console.log(`[PatrimonyCron] Sent to ${sent} users`);
}

// ── Sync Reminder — Monday 9:00 ─────────────────────────────────────────────

async function sendSyncReminder(): Promise<void> {
  console.log('[SyncCron] Checking stale connections...');

  const users = await db.query(`
    SELECT DISTINCT u.id, u.push_token FROM users u
    JOIN connections c ON c.user_id = u.id
    LEFT JOIN push_preferences pp ON pp.user_id = u.id
    WHERE c.last_sync_at < NOW() - INTERVAL '7 days'
    AND c.status = 'connected'
    AND u.push_token IS NOT NULL AND u.is_active = true
    AND (pp.sync_reminder IS NULL OR pp.sync_reminder = true)
  `);

  if (users.rows.length === 0) {
    console.log('[SyncCron] No stale connections');
    return;
  }

  const tokens = users.rows.map((r: any) => r.push_token).filter(Boolean);
  const sent = await sendPushToTokens(tokens,
    '\uD83D\uDD04 Dados desatualizados',
    'Seus dados bancarios estao ha mais de 7 dias sem atualizar. Abra o app para sincronizar.',
    { type: 'sync_reminder', screen: '/connect-bank' }
  );
  console.log(`[SyncCron] Sync reminder sent to ${sent} users`);
}

// ── Scheduled Push Processor — Every 5 minutes ──────────────────────────────

async function processScheduledPush(): Promise<void> {
  const pending = await db.query(`
    SELECT * FROM scheduled_push
    WHERE status = 'pending' AND scheduled_at <= NOW()
    ORDER BY scheduled_at ASC LIMIT 10
  `);

  for (const push of pending.rows) {
    try {
      let count = 0;
      if (push.target_type === 'all') {
        count = await sendPushToAll(push.title, push.body, push.data || {});
      } else if (push.target_type === 'specific_user' && push.target_value) {
        const userResult = await db.query(
          'SELECT push_token FROM users WHERE id = $1 AND push_token IS NOT NULL',
          [push.target_value]
        );
        if (userResult.rows.length > 0) {
          count = await sendPushToTokens([userResult.rows[0].push_token], push.title, push.body, push.data || {});
        }
      } else if (push.target_type === 'plan' && push.target_value) {
        const planUsers = await db.query(`
          SELECT u.push_token FROM users u
          JOIN subscriptions s ON s.user_id = u.id
          WHERE s.plan_code = $1 AND s.status = 'active'
          AND u.push_token IS NOT NULL
        `, [push.target_value]);
        const tokens = planUsers.rows.map((r: any) => r.push_token).filter(Boolean);
        count = await sendPushToTokens(tokens, push.title, push.body, push.data || {});
      }

      await db.query(
        'UPDATE scheduled_push SET status = $1, sent_at = NOW(), recipients_count = $2 WHERE id = $3',
        ['sent', count, push.id]
      );
      console.log(`[ScheduledPush] Sent "${push.title}" to ${count} users`);
    } catch (err: any) {
      console.error(`[ScheduledPush] Error for ${push.id}:`, err.message);
      await db.query(
        'UPDATE scheduled_push SET status = $1 WHERE id = $2',
        ['failed', push.id]
      );
    }
  }
}

// ── Start all crons ─────────────────────────────────────────────────────────

export function startSmartPushCrons(): void {
  // Event alerts — daily 8:00 BRT
  cron.schedule('0 8 * * *', () => {
    sendEventAlerts().catch(err => console.error('[EventCron] Error:', err));
  }, { timezone: 'America/Sao_Paulo' });

  // Patrimony weekly — Friday 18:00 BRT
  cron.schedule('0 18 * * 5', () => {
    sendPatrimonyWeekly().catch(err => console.error('[PatrimonyCron] Error:', err));
  }, { timezone: 'America/Sao_Paulo' });

  // Sync reminder — Monday 9:00 BRT
  cron.schedule('0 9 * * 1', () => {
    sendSyncReminder().catch(err => console.error('[SyncCron] Error:', err));
  }, { timezone: 'America/Sao_Paulo' });

  // Scheduled push processor — every 5 minutes
  cron.schedule('*/5 * * * *', () => {
    processScheduledPush().catch(err => console.error('[ScheduledPush] Error:', err));
  });

  console.log('[SmartPush] Crons started: Events 8:00, Patrimony Fri 18:00, Sync Mon 9:00, Scheduled every 5min');
}
