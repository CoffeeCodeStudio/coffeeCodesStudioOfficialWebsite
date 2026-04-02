import { NotificationSettings } from '@/components/portal/NotificationSettings';
import type { User } from '@supabase/supabase-js';

interface AdminNotificationSettingsProps {
  user: User;
}

export function AdminNotificationSettings({ user }: AdminNotificationSettingsProps) {
  return (
    <div className="max-w-xl">
      <h2 className="text-2xl font-serif gradient-text mb-6">Notifieringsinställningar</h2>
      <div className="glass-card p-6 rounded-2xl">
        <NotificationSettings user={user} isAdmin />
      </div>
    </div>
  );
}
