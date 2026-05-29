import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function DetallePedidoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold text-gray-800">Detalle pedido</h1>
      <p className="text-gray-500 mt-2">En construcción... (ID: {id})</p>
    </main>
  )
}
