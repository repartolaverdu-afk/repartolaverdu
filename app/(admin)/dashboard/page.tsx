import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold text-gray-800">Panel Admin</h1>
      <p className="text-gray-500 mt-2">En construcción...</p>
    </main>
  )
}
