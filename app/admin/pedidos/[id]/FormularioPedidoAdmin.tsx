'use client'

import { useState, useTransition } from 'react'
import { CheckCircle2, Truck, Package, AlertTriangle } from 'lucide-react'
import { confirmarPedidoAdminAction, cambiarEstadoAction, type ItemUpdate } from './actions'
import type { EstadoPedido } from '@/types'

type Item = {
  id: string
  cantidad_solicitada: number
  cantidad_confirmada: number | null
  precio_unitario: number
  notas_item: string | null
  faltante: boolean
  nombre: string
  unidad: string
}

type Props = {
  pedidoId: string
  estado: EstadoPedido
  notasAdminInicial: string | null
  items: Item[]
}

export default function FormularioPedidoAdmin({
  pedidoId, estado, notasAdminInicial, items: itemsIniciales,
}: Props) {
  const [items, setItems] = useState<ItemUpdate[]>(
    itemsIniciales.map((i) => ({
      id: i.id,
      cantidad_confirmada: i.cantidad_confirmada ?? i.cantidad_solicitada,
      faltante: i.faltante,
      notas_item: i.notas_item ?? '',
    }))
  )
  const [notasAdmin, setNotasAdmin] = useState(notasAdminInicial ?? '')
  const [isPending, startTransition] = useTransition()

  const readOnly = estado === 'ENTREGADO' || estado === 'CANCELADO'

  const updateItem = (id: string, campo: keyof ItemUpdate, valor: unknown) =>
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, [campo]: valor } : i))
    )

  const handleConfirmar = () =>
    startTransition(() => confirmarPedidoAdminAction(pedidoId, items, notasAdmin))

  const handleCambiarEstado = (nuevoEstado: EstadoPedido) =>
    startTransition(() => cambiarEstadoAction(pedidoId, nuevoEstado))

  return (
    <div className="space-y-4">
      {/* Items */}
      <div className="bg-white rounded-2xl border overflow-hidden">
        <div className="px-4 py-3 border-b bg-gray-50">
          <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
            Productos
          </p>
        </div>
        <div className="divide-y">
          {itemsIniciales.map((item, idx) => {
            const edit = items[idx]
            return (
              <div key={item.id} className={`px-4 py-4 space-y-3 ${edit.faltante ? 'bg-orange-50' : ''}`}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-gray-800">{item.nombre}</p>
                    <p className="text-sm text-gray-500 capitalize">
                      {item.unidad} · solicitado: <strong>{item.cantidad_solicitada}</strong>
                      {' · '}${item.precio_unitario.toLocaleString('es-AR')}
                    </p>
                  </div>
                  {!readOnly && (
                    <button
                      onClick={() => updateItem(item.id, 'faltante', !edit.faltante)}
                      className={`shrink-0 flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
                        edit.faltante
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-gray-100 text-gray-500 hover:bg-orange-50 hover:text-orange-600'
                      }`}
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {edit.faltante ? 'Sin stock' : 'Marcar faltante'}
                    </button>
                  )}
                </div>

                {!edit.faltante && (
                  <div className="flex items-center gap-3">
                    <label className="text-sm text-gray-500 shrink-0">Confirmar cantidad:</label>
                    {readOnly ? (
                      <span className="font-semibold text-gray-800">{edit.cantidad_confirmada}</span>
                    ) : (
                      <input
                        type="number"
                        min={0}
                        value={edit.cantidad_confirmada}
                        onChange={(e) =>
                          updateItem(item.id, 'cantidad_confirmada', Number(e.target.value))
                        }
                        className="w-20 border rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    )}
                  </div>
                )}

                {!readOnly && (
                  <input
                    type="text"
                    placeholder="Notas del ítem (opcional)"
                    value={edit.notas_item}
                    onChange={(e) => updateItem(item.id, 'notas_item', e.target.value)}
                    className="w-full text-sm bg-gray-50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-600 placeholder-gray-400"
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Notas admin */}
      {!readOnly && (
        <div className="bg-white rounded-2xl border p-4 space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            Notas internas <span className="text-gray-400 font-normal">(solo admin)</span>
          </label>
          <textarea
            value={notasAdmin}
            onChange={(e) => setNotasAdmin(e.target.value)}
            placeholder="Observaciones del pedido..."
            rows={2}
            className="w-full text-sm bg-gray-50 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700 placeholder-gray-400 resize-none"
          />
        </div>
      )}

      {/* Acciones según estado */}
      {!readOnly && (
        <div className="space-y-2">
          {estado === 'ENVIADO' && (
            <button
              onClick={handleConfirmar}
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold rounded-xl py-4 transition-colors"
            >
              <CheckCircle2 className="w-5 h-5" />
              {isPending ? 'Guardando...' : 'Confirmar pedido'}
            </button>
          )}
          {(estado === 'CONFIRMADO' || estado === 'CON_FALTANTES') && (
            <button
              onClick={() => handleCambiarEstado('EN_PREPARACION')}
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold rounded-xl py-4 transition-colors"
            >
              <Package className="w-5 h-5" />
              {isPending ? 'Actualizando...' : 'Iniciar preparación'}
            </button>
          )}
          {estado === 'EN_PREPARACION' && (
            <button
              onClick={() => handleCambiarEstado('ENTREGADO')}
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold rounded-xl py-4 transition-colors"
            >
              <Truck className="w-5 h-5" />
              {isPending ? 'Actualizando...' : 'Marcar entregado'}
            </button>
          )}
          <button
              onClick={() => handleCambiarEstado('CANCELADO')}
              disabled={isPending}
              className="w-full text-red-400 hover:text-red-600 text-sm font-medium py-2 transition-colors"
            >
              Cancelar pedido
            </button>
        </div>
      )}
    </div>
  )
}
