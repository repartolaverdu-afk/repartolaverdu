import { type NextRequest } from 'next/server'
import { pdf } from '@react-pdf/renderer'
import { createElement } from 'react'
import { createClient } from '@/lib/supabase/server'
import { ComprobantePDF } from '@/components/pdf/ComprobantePDF'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new Response('Unauthorized', { status: 401 })

  const { data: pedido } = await supabase
    .from('pedidos')
    .select(`
      numero_pedido, fecha_pedido, estado, total_estimado, notas_cliente,
      cliente:cliente_id(nombre),
      detalle_pedido(
        cantidad_solicitada, precio_unitario, subtotal, notas_item,
        producto_unidad:producto_unidad_id(
          unidad, producto:producto_id(nombre)
        )
      )
    `)
    .eq('id', id)
    .eq('cliente_id', user.id)
    .single()

  if (!pedido) return new Response('Not Found', { status: 404 })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdfDoc = pdf(createElement(ComprobantePDF, { pedido: pedido as any }) as any) as any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buffer: any = await pdfDoc.toBuffer()

  return new Response(buffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="pedido-${pedido.numero_pedido}.pdf"`,
    },
  })
}
