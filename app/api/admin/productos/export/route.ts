import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import * as XLSX from 'xlsx'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new Response('Unauthorized', { status: 401 })

  const admin = createAdminClient()
  const { data: unidades } = await admin
    .from('producto_unidades')
    .select('unidad, precio_base, producto:producto_id(nombre, categoria)')
    .eq('activo', true)
    .order('producto_id')

  if (!unidades) return new Response('Error', { status: 500 })

  const filas = unidades.map((u) => {
    const prod = u.producto as unknown as { nombre: string; categoria: string }
    return {
      nombre:      prod?.nombre ?? '',
      categoria:   prod?.categoria ?? '',
      unidad:      u.unidad,
      precio_base: u.precio_base,
    }
  })

  const ws = XLSX.utils.json_to_sheet(filas)
  ws['!cols'] = [{ wch: 30 }, { wch: 15 }, { wch: 12 }, { wch: 14 }]
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Productos')
  const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })

  return new Response(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="productos.xlsx"',
    },
  })
}
