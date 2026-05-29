'use client'

import { useState, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, Home, ClipboardList } from 'lucide-react'
import { useCarrito } from '@/lib/store/carrito'
import { confirmarPedidoAction } from './actions'

export default function ConfirmarPage() {
  const [mounted, setMounted] = useState(false)
  const [notas, setNotas] = useState('')
  const [pedidoConfirmado, setPedidoConfirmado] = useState<{
    id: string
    numero: number
  } | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const { items, clear } = useCarrito()

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (mounted && items.length === 0 && !pedidoConfirmado) {
      router.replace('/catalogo')
    }
  }, [mounted, items.length, pedidoConfirmado, router])

  const total = items.reduce((acc, i) => acc + i.cantidad * i.precio_unitario, 0)

  const handleEnviar = () => {
    startTransition(async () => {
      const result = await confirmarPedidoAction(items, notas)
      clear()
      setPedidoConfirmado({ id: result.pedidoId, numero: result.numeroPedido })
    })
  }

  if (!mounted) return null

  if (pedidoConfirmado) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 text-center">
        <div className="bg-white rounded-3xl shadow-sm border p-8 w-full max-w-sm space-y-5">
          <div className="flex justify-center">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">¡Pedido enviado!</h1>
            <p className="text-gray-500 mt-1">
              Pedido <span className="font-semibold text-gray-700">#{pedidoConfirmado.numero}</span>
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Te avisamos cuando sea confirmado.
            </p>
          </div>
          <div className="space-y-2 pt-2">
            <Link
              href="/inicio"
              className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl py-3 transition-colors"
            >
              <Home className="w-4 h-4" />
              Ir al inicio
            </Link>
            <Link
              href="/pedidos"
              className="flex items-center justify-center gap-2 w-full border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium rounded-xl py-3 transition-colors"
            >
              <ClipboardList className="w-4 h-4" />
              Ver mis pedidos
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b px-4 py-4 flex items-center gap-3 sticky top-0 z-10">
        <Link href="/carrito" className="text-gray-500 hover:text-gray-700">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-lg font-bold text-gray-800">Confirmar pedido</h1>
      </header>

      <div className="flex-1 px-4 py-4 space-y-4 max-w-lg mx-auto w-full pb-36">
        {/* Resumen de ítems */}
        <div className="bg-white rounded-2xl border overflow-hidden">
          <div className="px-4 py-3 border-b bg-gray-50">
            <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
              Resumen — {items.length} {items.length === 1 ? 'producto' : 'productos'}
            </p>
          </div>
          <div className="divide-y">
            {items.map((item) => (
              <div key={item.producto_unidad_id} className="flex items-center justify-between px-4 py-3 gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{item.producto_nombre}</p>
                  <p className="text-xs text-gray-400 capitalize">
                    {item.cantidad} {item.unidad} · ${item.precio_unitario.toLocaleString('es-AR')} c/u
                  </p>
                  {item.notas_item && (
                    <p className="text-xs text-gray-400 italic mt-0.5">{item.notas_item}</p>
                  )}
                </div>
                <span className="text-sm font-semibold text-gray-700 shrink-0">
                  ${(item.cantidad * item.precio_unitario).toLocaleString('es-AR')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Notas generales */}
        <div className="bg-white rounded-2xl border p-4 space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            Notas del pedido <span className="text-gray-400 font-normal">(opcional)</span>
          </label>
          <textarea
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            placeholder="Ej: entregar antes de las 10am, llamar antes de llegar..."
            rows={3}
            className="w-full text-sm bg-gray-50 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700 placeholder-gray-400 resize-none"
          />
        </div>
      </div>

      {/* Footer fijo */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-4 py-4 z-10">
        <div className="max-w-lg mx-auto space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-medium">Total estimado</span>
            <span className="text-xl font-bold text-gray-800">
              ${total.toLocaleString('es-AR')}
            </span>
          </div>
          <button
            onClick={handleEnviar}
            disabled={isPending}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold rounded-xl py-4 transition-colors"
          >
            {isPending ? 'Enviando pedido...' : 'Enviar pedido'}
          </button>
        </div>
      </div>
    </div>
  )
}
