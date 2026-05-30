import { type NextRequest } from 'next/server'
import { pdf } from '@react-pdf/renderer'
import { createElement } from 'react'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { PickingListPDF, type PickingPorProducto, type PickingPorCliente } from '@/components/pdf/PickingListPDF'
import { buildPickingData } from '@/lib/picking'

export async function GET(_request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new Response('Unauthorized', { status: 401 })

  const admin = createAdminClient()
  const { porProducto, porCliente } = await buildPickingData(admin)

  const fecha = new Date().toLocaleDateString('es-AR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdfDoc = pdf(createElement(PickingListPDF, { porProducto, porCliente, fecha }) as any) as any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buffer: any = await pdfDoc.toBuffer()

  return new Response(buffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="picking-${Date.now()}.pdf"`,
    },
  })
}
