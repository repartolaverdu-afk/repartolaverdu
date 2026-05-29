import { Suspense } from 'react'
import CarritoContenido from './CarritoContenido'

export default function CarritoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400 text-sm">Cargando carrito...</p>
      </div>
    }>
      <CarritoContenido />
    </Suspense>
  )
}
