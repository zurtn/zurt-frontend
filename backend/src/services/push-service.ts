import Expo, { ExpoPushMessage, ExpoPushTicket } from 'expo-server-sdk';
import { db } from '../db/connection.js';

const expo = new Expo();

export async function sendPushToUsers(userIds: string[], title: string, body: string, data?: Record<string, any>): Promise<number> {
  const result = await db.query(
    `SELECT push_token FROM users WHERE id = ANY($1) AND push_token IS NOT NULL`,
    [userIds]
  );
  const tokens = result.rows.map((r: any) => r.push_token).filter((t: string) => Expo.isExpoPushToken(t));
  return sendPushToTokens(tokens, title, body, data);
}

export async function sendPushToAll(title: string, body: string, data?: Record<string, any>, preferenceKey?: string): Promise<number> {
  const query = `SELECT push_token, push_preferences FROM users WHERE push_token IS NOT NULL AND is_active = true`;
  const result = await db.query(query);
  const tokens = result.rows
    .filter((r: any) => {
      if (!preferenceKey) return true;
      const prefs = r.push_preferences || {};
      return prefs[preferenceKey] !== false;
    })
    .map((r: any) => r.push_token)
    .filter((t: string) => Expo.isExpoPushToken(t));
  return sendPushToTokens(tokens, title, body, data);
}

export async function sendPushToTokens(tokens: string[], title: string, body: string, data?: Record<string, any>): Promise<number> {
  if (tokens.length === 0) return 0;
  let sent = 0;
  for (const token of tokens) {
    try {
      const tickets = await expo.sendPushNotificationsAsync([{
        to: token,
        sound: 'default' as const,
        title,
        body,
        data: data || {},
      }]);
      if (tickets[0]?.status === 'ok') {
        sent++;
      } else {
        const t = tickets[0] as any;
        console.log('[Push] Ticket error for', token, ':', t?.status, t?.message, t?.details?.error);
        if (t?.details?.error === 'DeviceNotRegistered') {
          await db.query(`UPDATE users SET push_token = NULL WHERE push_token = $1`, [token]);
          console.log('[Push] Removed invalid token:', token);
        }
      }
    } catch (err: any) {
      console.error('[Push] Error for', token, ':', err.message);
    }
  }
  console.log(`[Push] Sent ${sent}/${tokens.length} notifications`);
  return sent;
}
