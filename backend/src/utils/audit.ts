import { db } from '../db/connection.js';

export interface AuditLogEntry {
  adminId: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  oldValue?: any;
  newValue?: any;
  ipAddress?: string;
  userAgent?: string;
  metadata?: any;
}

export async function logAudit(entry: AuditLogEntry): Promise<void> {
  try {
    const meta: any = {};
    if (entry.metadata) Object.assign(meta, entry.metadata);
    if (entry.ipAddress) meta.ipAddress = entry.ipAddress;
    if (entry.userAgent) meta.userAgent = entry.userAgent;

    await db.query(
      `INSERT INTO audit_logs (
        admin_id, action, resource_type, resource_id, old_value, new_value, metadata
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        entry.adminId,
        entry.action,
        entry.resourceType,
        entry.resourceId || null,
        entry.oldValue ? JSON.stringify(entry.oldValue) : null,
        entry.newValue ? JSON.stringify(entry.newValue) : null,
        Object.keys(meta).length > 0 ? JSON.stringify(meta) : '{}',
      ]
    );
  } catch (error: any) {
    console.error('Failed to log audit:', error);
  }
}

export function getClientIp(request: any): string | undefined {
  return request.ip ||
         request.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
         request.headers['x-real-ip'] ||
         request.socket?.remoteAddress;
}
