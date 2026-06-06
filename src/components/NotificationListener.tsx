import { useEffect } from 'react'
import { supabase } from '../supabaseClient'

export default function NotificationListener({ userId }: { userId: string }) {
  useEffect(() => {
    const channel = supabase
      .channel('notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`
      }, payload => {
        alert(payload.new.message) // replace with a toast later
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [userId])

  return null
}
