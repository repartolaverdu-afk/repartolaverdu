'use client'

import { useState } from 'react'
import { FileDown } from 'lucide-react'

export default function BotonDescargaPDF({ pedidoId }: { pedidoId: string }) {
  const [cargando, setCargando] = useState(false)

  const handleDescargar = async () => {
    setCargando(true)
    try {
      const res = await fetch(`/api/pedidos/${pedidoId}/pdf`)
      if (!res.ok) throw new Error()
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `pedido-${pedidoId}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setCargando(false)
    }
  }

  return (
    <button
      onClick={handleDescargar}
      disabled={cargando}
      className="flex items-center justify-center gap-2 w-full border-2 border-green-600 text-green-700 font-semibold rounded-xl py-3 hover:bg-green-50 disabled:opacity-50 transition-colors"
    >
      <FileDown className="w-5 h-5" />
      {cargando ? 'Generando PDF...' : 'Descargar comprobante'}
    </button>
  )
}
