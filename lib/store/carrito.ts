import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ItemCarrito } from '@/types'

interface CarritoStore {
  items: ItemCarrito[]
  addItem: (item: ItemCarrito) => void
  updateCantidad: (producto_unidad_id: string, cantidad: number) => void
  removeItem: (producto_unidad_id: string) => void
  clear: () => void
}

export const useCarrito = create<CarritoStore>()(
  persist(
    (set) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find(
            (i) => i.producto_unidad_id === item.producto_unidad_id
          )
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.producto_unidad_id === item.producto_unidad_id
                  ? { ...i, cantidad: i.cantidad + item.cantidad }
                  : i
              ),
            }
          }
          return { items: [...state.items, item] }
        }),

      updateCantidad: (id, cantidad) =>
        set((state) => ({
          items:
            cantidad > 0
              ? state.items.map((i) =>
                  i.producto_unidad_id === id ? { ...i, cantidad } : i
                )
              : state.items.filter((i) => i.producto_unidad_id !== id),
        })),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.producto_unidad_id !== id),
        })),

      clear: () => set({ items: [] }),
    }),
    { name: 'carrito-fruteria' }
  )
)
