import { supabase } from './supabase';
import { NotificationItem } from '@/types';

const db = supabase as any;

export async function getUserNotifications(
  userId: string
): Promise<NotificationItem[]> {
  const { data, error } = await db
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', {
      ascending: false,
    });

  if (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }

  return ((data || []) as any[]).map((notif) => ({
    id: String(notif.id),
    title: String(notif.title || ''),
    message: String(notif.message || ''),
    read: Boolean(notif.read),
    type: notif.type || 'system',
    orderId: notif.order_id || undefined,
    link: notif.link || undefined,
    actionLabel: notif.action_label || undefined,
    createdAt:
      typeof notif.created_at === 'number'
        ? notif.created_at
        : Date.parse(notif.created_at) || Date.now(),
  }));
}

export async function markNotificationRead(
  notificationId: string
): Promise<void> {
  const { error } = await db
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId);

  if (error) {
    console.error('Error marking notification as read:', error);
  }
}

export async function markAllNotificationsRead(
  userId: string
): Promise<void> {
  const { error } = await db
    .from('notifications')
    .update({ read: true })
    .eq('user_id', userId)
    .eq('read', false);

  if (error) {
    console.error('Error marking all notifications as read:', error);
  }
}

export async function deleteNotification(
  notificationId: string
): Promise<void> {
  const { error } = await db
    .from('notifications')
    .delete()
    .eq('id', notificationId);

  if (error) {
    console.error('Error deleting notification:', error);
  }
}

export function subscribeToNotifications(
  userId: string,
  onUpdate: (notifications: NotificationItem[]) => void
): () => void {
  const subscription = supabase
    .channel(`notifications:${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
      },
      async () => {
        const notifications = await getUserNotifications(userId);
        onUpdate(notifications);
      }
    )
    .subscribe();

  void getUserNotifications(userId).then(onUpdate);

  return () => {
    void subscription.unsubscribe();
  };
}

export async function createNotification(
  notification: Omit<NotificationItem, 'id' | 'read' | 'createdAt'>
): Promise<void> {
  const { error } = await db
    .from('notifications')
    .insert({
      id:
        typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      user_id: notification.userId || null,
      title: notification.title,
      message: notification.message,
      read: false,
      type: notification.type || 'system',
      order_id: notification.orderId || null,
      link: notification.link || null,
      action_label: notification.actionLabel || null,
      created_at: Date.now(),
    });

  if (error) {
    console.error('Error creating notification:', error);
  }
}
