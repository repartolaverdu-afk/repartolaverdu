'use client'

import { useState, useTransition } from 'react'
import { Plus, Pencil, Check, X, ChevronDown, ChevronUp } from 'lucide-react'
import {
  crearProductoAction, actualizarProductoAction, toggleProductoAction,
  actualizarUnidadAction, agregarUnidadAction, type UnidadInput,
} from './actions'
import type { Unidad } from '@/types'

const UNIDADES: Unidad[] = ['kg', 'cajon', 'bolsa', 'atado', 'unidad']

type UnidadDB = { id: string; unidad: Unidad; precio_base: number; activo: boolean }
type ProductoDB = {
  id: string; nombre: string; categoria: string | null; activo: boolean
  producto_unidades: UnidadDB[]
}

export default function GestionProductos({ productos }: { productos: ProductoDB[] }) {
  const [expandido, setExpandido] = useState<string | null>(null)
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [editNombre, setEditNombre] = useState('')
  const [editCategoria, setEditCategoria] = useState('')
  const [mostrarNuevo, setMostrarNuevo] = useState(false)
  const [nuevoNombre, setNuevoNombre] = useState('')
  const [nuevoCategoria, setNuevoCategoria] = useState('')
  const [nuevasUnidades, setNuevasUnidades] = useState<UnidadInput[]>([{ unidad: 'kg', precio_base: 0 }])
  const [isPending, startTransition] = useTransition()

  // Editar unidad inline
  const [editUnidad, setEditUnidad] = useState<{ id: string; precio: number } | null>(null)
  // Agregar unidad a producto existente
  const [agregarUnidadProd, setAgregarUnidadProd] = useState<string | null>(null)
  const [nuevaUnidadVal, setNuevaUnidadVal] = useState<Unidad>('kg')
  const [nuevaUnidadPrecio, setNuevaUnidadPrecio] = useState(0)

  const handleCrear = () => {
    if (!nuevoNombre.trim()) return
    startTransition(async () => {
      await crearProductoAction(nuevoNombre, nuevoCategoria, nuevasUnidades.filter(u => u.precio_base > 0))
      setMostrarNuevo(false)
      setNuevoNombre('')
      setNuevoCategoria('')
      setNuevasUnidades([{ unidad: 'kg', precio_base: 0 }])
    })
  }

  const handleGuardarEdicion = (id: string) => {
    startTransition(async () => {
      await actualizarProductoAction(id, editNombre, editCategoria)
      setEditandoId(null)
    })
  }

  const handleToggle = (id: string, activo: boolean) =>
    startTransition(() => toggleProductoAction(id, !activo))

  const handleGuardarUnidad = (id: string, activo: boolean) => {
    if (!editUnidad) return
    startTransition(async () => {
      await actualizarUnidadAction(id, editUnidad.precio, activo)
      setEditUnidad(null)
    })
  }

  const handleAgregarUnidad = (productoId: string) => {
    startTransition(async () => {
      await agregarUnidadAction(productoId, nuevaUnidadVal, nuevaUnidadPrecio)
      setAgregarUnidadProd(null)
      setNuevaUnidadPrecio(0)
    })
  }

  return (
    <div className="space-y-3">
      {/* Botón nuevo producto */}
      {!mostrarNuevo ? (
        <button
          onClick={() => setMostrarNuevo(true)}
          className="flex items-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl py-3 justify-center transition-colors"
        >
          <Plus className="w-4 h-4" /> Nuevo producto
        </button>
      ) : (
        <div className="bg-white rounded-2xl border p-4 space-y-3">
          <h3 className="font-semibold text-gray-800">Nuevo producto</h3>
          <input
            type="text" placeholder="Nombre *" value={nuevoNombre}
            onChange={e => setNuevoNombre(e.target.value)}
            className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="text" placeholder="Categoría (ej: Verduras)" value={nuevoCategoria}
            onChange={e => setNuevoCategoria(e.target.value)}
            className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-600">Unidades y precios</p>
            {nuevasUnidades.map((u, i) => (
              <div key={i} className="flex gap-2">
                <select
                  value={u.unidad}
                  onChange={e => setNuevasUnidades(prev => prev.map((x, j) => j === i ? { ...x, unidad: e.target.value as Unidad } : x))}
                  className="border rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {UNIDADES.map(un => <option key={un} value={un}>{un}</option>)}
                </select>
                <input
                  type="number" placeholder="Precio" value={u.precio_base || ''}
                  onChange={e => setNuevasUnidades(prev => prev.map((x, j) => j === i ? { ...x, precio_base: Number(e.target.value) } : x))}
                  className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {nuevasUnidades.length > 1 && (
                  <button onClick={() => setNuevasUnidades(prev => prev.filter((_, j) => j !== i))} className="text-gray-400 hover:text-red-400">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() => setNuevasUnidades(prev => [...prev, { unidad: 'kg', precio_base: 0 }])}
              className="text-xs text-green-600 hover:underline flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> Agregar unidad
            </button>
          </div>
          <div className="flex gap-2">
            <button onClick={handleCrear} disabled={isPending || !nuevoNombre.trim()}
              className="flex-1 bg-green-600 text-white rounded-xl py-2.5 text-sm font-semibold disabled:bg-green-400">
              {isPending ? 'Guardando...' : 'Crear producto'}
            </button>
            <button onClick={() => setMostrarNuevo(false)} className="px-4 border rounded-xl text-sm text-gray-600 hover:bg-gray-50">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Lista de productos */}
      {productos.map(prod => (
        <div key={prod.id} className={`bg-white rounded-2xl border overflow-hidden ${!prod.activo ? 'opacity-60' : ''}`}>
          <div className="px-4 py-3">
            {editandoId === prod.id ? (
              <div className="space-y-2">
                <input value={editNombre} onChange={e => setEditNombre(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                <input value={editCategoria} onChange={e => setEditCategoria(e.target.value)}
                  placeholder="Categoría" className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                <div className="flex gap-2">
                  <button onClick={() => handleGuardarEdicion(prod.id)} disabled={isPending}
                    className="flex items-center gap-1 bg-green-600 text-white rounded-lg px-3 py-1.5 text-xs font-medium">
                    <Check className="w-3 h-3" /> Guardar
                  </button>
                  <button onClick={() => setEditandoId(null)} className="text-gray-400 hover:text-gray-600 text-xs px-3 py-1.5 border rounded-lg">
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-2">
                <div>
                  <span className="font-semibold text-gray-800">{prod.nombre}</span>
                  {prod.categoria && (
                    <span className="ml-2 text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">{prod.categoria}</span>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => { setEditandoId(prod.id); setEditNombre(prod.nombre); setEditCategoria(prod.categoria ?? '') }}
                    className="text-gray-400 hover:text-gray-700">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleToggle(prod.id, prod.activo)} disabled={isPending}
                    className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${prod.activo ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                    {prod.activo ? 'Activo' : 'Inactivo'}
                  </button>
                  <button onClick={() => setExpandido(expandido === prod.id ? null : prod.id)}
                    className="text-gray-400 hover:text-gray-700">
                    {expandido === prod.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}
          </div>

          {expandido === prod.id && (
            <div className="border-t divide-y">
              {prod.producto_unidades.map(u => (
                <div key={u.id} className="px-4 py-3 flex items-center justify-between gap-2">
                  {editUnidad?.id === u.id ? (
                    <div className="flex items-center gap-2 w-full">
                      <span className="text-sm capitalize text-gray-600 w-16 shrink-0">{u.unidad}</span>
                      <input
                        type="number" value={editUnidad.precio}
                        onChange={e => setEditUnidad({ ...editUnidad, precio: Number(e.target.value) })}
                        className="flex-1 border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                      <button onClick={() => handleGuardarUnidad(u.id, u.activo)} disabled={isPending}
                        className="text-green-600 hover:text-green-800"><Check className="w-4 h-4" /></button>
                      <button onClick={() => setEditUnidad(null)} className="text-gray-400"><X className="w-4 h-4" /></button>
                    </div>
                  ) : (
                    <>
                      <div>
                        <span className="text-sm capitalize text-gray-700 font-medium">{u.unidad}</span>
                        <span className="text-sm text-gray-500 ml-2">${u.precio_base.toLocaleString('es-AR')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setEditUnidad({ id: u.id, precio: u.precio_base })}
                          className="text-gray-400 hover:text-gray-600"><Pencil className="w-3.5 h-3.5" /></button>
                        <button onClick={() => startTransition(() => actualizarUnidadAction(u.id, u.precio_base, !u.activo))} disabled={isPending}
                          className={`text-xs px-2 py-0.5 rounded-full ${u.activo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {u.activo ? 'Activa' : 'Inactiva'}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}

              {/* Agregar unidad */}
              {agregarUnidadProd === prod.id ? (
                <div className="px-4 py-3 flex items-center gap-2">
                  <select value={nuevaUnidadVal} onChange={e => setNuevaUnidadVal(e.target.value as Unidad)}
                    className="border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                    {UNIDADES.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                  <input type="number" placeholder="Precio" value={nuevaUnidadPrecio || ''}
                    onChange={e => setNuevaUnidadPrecio(Number(e.target.value))}
                    className="flex-1 border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                  <button onClick={() => handleAgregarUnidad(prod.id)} disabled={isPending || nuevaUnidadPrecio <= 0}
                    className="text-green-600 hover:text-green-800 disabled:opacity-40"><Check className="w-4 h-4" /></button>
                  <button onClick={() => setAgregarUnidadProd(null)} className="text-gray-400"><X className="w-4 h-4" /></button>
                </div>
              ) : (
                <button onClick={() => { setAgregarUnidadProd(prod.id); setNuevaUnidadVal('kg'); setNuevaUnidadPrecio(0) }}
                  className="w-full flex items-center justify-center gap-1 text-xs text-green-600 hover:text-green-800 py-3">
                  <Plus className="w-3.5 h-3.5" /> Agregar unidad
                </button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
