'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Trash2, Minus, Plus, ShoppingBasket } from 'lucide-react'
import { useCarrito } from '@/lib/store/carrito'
import { createClient } from '@/lib/supabase/client'

export default function CarritoPage() {
  const [mounted, setMounted] = useState(false)
  const [cargando, setCargando] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()
  const { items, updateCantidad, setNotas, removeItem, clear, addItem } = useCarrito()

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const borradorId = searchParams.get('borrador')
    if (!borradorId) return

    async function cargarBorrador() {
      setCargando(true)
      try {
        const supabase = createClient()
        const { data } = await supabase
          .from('detalle_pedido')
          .select(`
            producto_unidad_id, cantidad_solicitada, precio_unitario, notas_item,
            producto_unidad:producto_unidad_id(unidad, producto:producto_id(nombre))
          `)
          .eq('pedido_id', borradorId)

        if (data?.length) {
          clear()
          for (const item of data) {
            const pu = item.producto_unidad as unknown as { unidad: string; producto: { nombre: string } } | null
            addItem({
              producto_unidad_id: item.producto_unidad_id,
              producto_nombre: pu?.producto?.nombre ?? '',
              unidad: (pu?.unidad ?? 'kg') as import('@/types').Unidad,
              cantidad: item.cantidad_solicitada,
              precio_unitario: item.precio_unitario,
              notas_item: item.notas_item ?? '',
            })
          }
        }
      } finally {
        setCargando(false)
        router.replace('/carrito')
      }
    }

    cargarBorrador()
  }, [searchParams]) // eslint-disable-line react-hooks/exhaustive-deps

  const total = items.reduce((acc, i) => acc + i.cantidad * i.precio_unitario, 0)

  if (!mounted || cargando) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400 text-sm">Cargando carrito...</p>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-white border-b px-4 py-4 flex items-center gap-3">
          <Link href="/catalogo" className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-lg font-bold text-gray-800">Carrito</h1>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
          <ShoppingBasket className="w-16 h-16 text-gray-200" />
          <p className="text-gray-500">Tu carrito está vacío</p>
          <Link
            href="/catalogo"
            className="bg-green-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-700 transition-colors"
          >
            Ver catálogo
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b px-4 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Link href="/catalogo" className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-lg font-bold text-gray-800">Carrito</h1>
          <span className="text-sm text-gray-400">
            {items.length} {items.length === 1 ? 'producto' : 'productos'}
          </span>
        </div>
        <button
          onClick={clear}
          className="text-gray-300 hover:text-red-400 transition-colors"
          title="Vaciar carrito"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </header>

      <div className="flex-1 px-4 py-3 space-y-3 max-w-lg mx-auto w-full pb-36">
        {items.map((item) => (
          <div key={item.producto_unidad_id} className="bg-white rounded-2xl border p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-gray-800">{item.producto_nombre}</p>
                <p className="text-sm text-gray-500 capitalize">
                  {item.unidad} · ${item.precio_unitario.toLocaleString('es-AR')} c/u
                </p>
              </div>
              <button
                onClick={() => removeItem(item.producto_unidad_id)}
                className="text-gray-300 hover:text-red-400 transition-colors shrink-0 mt-0.5"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateCantidad(item.producto_unidad_id, item.cantidad - 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5 text-gray-600" />
                </button>
                <span className="w-8 text-center font-semibold text-gray-800">
                  {item.cantidad}
                </span>
                <button
                  onClick={() => updateCantidad(item.producto_unidad_id, item.cantidad + 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-green-600 hover:bg-green-700 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
              <span className="font-semibold text-gray-800">
                ${(item.cantidad * item.precio_unitario).toLocaleString('es-AR')}
              </span>
            </div>

            <input
              type="text"
              placeholder="Notas para este ítem (opcional)"
              defaultValue={item.notas_item}
              onBlur={(e) => setNotas(item.producto_unidad_id, e.target.value)}
              className="w-full text-sm bg-gray-50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-600 placeholder-gray-400"
            />
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-4 py-4 z-10">
        <div className="max-w-lg mx-auto space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-medium">Total estimado</span>
            <span className="text-xl font-bold text-gray-800">
              ${total.toLocaleString('es-AR')}
            </span>
          </div>
          <Link
            href="/carrito/confirmar"
            className="block w-full bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl py-4 text-center transition-colors"
          >
            Confirmar pedido
          </Link>
        </div>
      </div>
    </div>
  )
}
