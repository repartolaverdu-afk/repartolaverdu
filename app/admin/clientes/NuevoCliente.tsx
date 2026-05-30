'use client'

import { useState, useTransition } from 'react'
import { Plus, X } from 'lucide-react'
import { crearClienteAction } from './actions'

const campo = (label: string, props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <div>
    <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
    <input
      {...props}
      className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
    />
  </div>
)

export default function NuevoCliente() {
  const [abierto, setAbierto] = useState(false)
  const [form, setForm] = useState({
    nombre: '', email: '', password: '', telefono: '',
    direccion: '', zona_entrega: '', dia_entrega: '',
  })
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }))

  const handleCrear = () => {
    if (!form.nombre.trim() || !form.email.trim() || !form.password.trim()) {
      setError('Nombre, email y contraseña son obligatorios')
      return
    }
    setError('')
    startTransition(async () => {
      const result = await crearClienteAction(form)
      if (result.error) {
        setError(result.error)
      } else {
        setAbierto(false)
        setForm({ nombre: '', email: '', password: '', telefono: '', direccion: '', zona_entrega: '', dia_entrega: '' })
      }
    })
  }

  if (!abierto) {
    return (
      <button onClick={() => setAbierto(true)}
        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
        <Plus className="w-4 h-4" /> Nuevo
      </button>
    )
  }

  return (
    <div className="bg-white rounded-2xl border p-5 space-y-3 mx-4 mb-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-gray-800">Nuevo cliente</h2>
        <button onClick={() => setAbierto(false)} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
      </div>

      {campo('Nombre *', { placeholder: 'Nombre completo', value: form.nombre, onChange: set('nombre') })}
      {campo('Email *', { type: 'email', placeholder: 'correo@ejemplo.com', value: form.email, onChange: set('email') })}
      {campo('Contraseña *', { type: 'password', placeholder: 'Mínimo 6 caracteres', value: form.password, onChange: set('password') })}
      {campo('Teléfono', { placeholder: '11 1234-5678', value: form.telefono, onChange: set('telefono') })}
      {campo('Dirección', { placeholder: 'Dirección de entrega', value: form.direccion, onChange: set('direccion') })}
      {campo('Zona de entrega', { placeholder: 'Ej: Norte, Sur, Centro', value: form.zona_entrega, onChange: set('zona_entrega') })}
      {campo('Día de entrega', { placeholder: 'Ej: Lunes, Martes...', value: form.dia_entrega, onChange: set('dia_entrega') })}

      {error && <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

      <div className="flex gap-2 pt-1">
        <button onClick={handleCrear} disabled={isPending}
          className="flex-1 bg-green-600 text-white rounded-xl py-2.5 text-sm font-semibold disabled:bg-green-400 transition-colors">
          {isPending ? 'Creando...' : 'Crear cliente'}
        </button>
        <button onClick={() => setAbierto(false)} className="px-4 border rounded-xl text-sm text-gray-600 hover:bg-gray-50">
          Cancelar
        </button>
      </div>
    </div>
  )
}
