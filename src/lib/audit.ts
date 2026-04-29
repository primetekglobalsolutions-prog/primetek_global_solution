import { supabaseAdmin } from './supabase-admin';
import { getSession } from './auth';

/**
 * Logs a system action to the audit_logs table.
 * Uses supabaseAdmin to bypass RLS since this is a server-side trusted operation.
 */
export async function logAuditAction(
  action: string,
  entityType: string,
  entityId?: string,
  oldData?: any,
  newData?: any
) {
  try {
    const session = await getSession();
    if (!session || !session.id) return;

    const { error } = await supabaseAdmin.rpc('log_action', {
      p_user_id: session.id,
      p_user_role: session.role,
      p_action: action,
      p_entity_type: entityType,
      p_entity_id: entityId,
      p_old_data: oldData,
      p_new_data: newData
    });

    if (error) {
      console.error('Audit Log Error:', error);
    }
  } catch (err) {
    console.error('Failed to create audit log:', err);
  }
}
