'use client'

import { useState } from 'react'
import { FileDown, Printer } from 'lucide-react'

export default function BotonesComprobante({
  pedidoId,
  numeroPedido,
}: {
  pedidoId: string
  numeroPedido: number
}) {
  const [descargando, setDescargando] = useState(false)

  const handleDescargar = async () => {
    setDescargando(true)
    try {
      const res = await fetch(`/api/admin/pedidos/${pedidoId}/pdf`)
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `pedido-${numeroPedido}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setDescargando(false)
    }
  }

  const handleImprimir = () => {
    window.open(`/api/admin/pedidos/${pedidoId}/pdf`, '_blank')
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={handleDescargar}
        disabled={descargando}
        className="flex-1 flex items-center justify-center gap-2 border-2 border-green-600 text-green-700 font-semibold rounded-xl py-3 hover:bg-green-50 disabled:opacity-50 transition-colors text-sm"
      >
        <FileDown className="w-4 h-4" />
        {descargando ? 'Generando...' : 'Descargar PDF'}
      </button>
      <button
        onClick={handleImprimir}
        className="flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-600 font-semibold rounded-xl px-4 py-3 hover:bg-gray-50 transition-colors text-sm"
      >
        <Printer className="w-4 h-4" />
        Imprimir
      </button>
    </div>
  )
}
