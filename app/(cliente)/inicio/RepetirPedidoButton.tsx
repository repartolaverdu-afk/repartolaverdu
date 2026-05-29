'use client'

import { useTransition } from 'react'
import { RotateCcw } from 'lucide-react'
import { repetirPedidoAction } from './actions'

export default function RepetirPedidoButton({ pedidoId }: { pedidoId: string }) {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      onClick={() => startTransition(() => repetirPedidoAction(pedidoId))}
      disabled={isPending}
      className="w-full flex items-center justify-center gap-2 border-2 border-green-600 text-green-700 font-semibold rounded-xl py-4 text-base hover:bg-green-50 disabled:opacity-50 transition-colors"
    >
      <RotateCcw className={`w-5 h-5 ${isPending ? 'animate-spin' : ''}`} />
      {isPending ? 'Preparando pedido...' : 'Repetir este pedido'}
    </button>
  )
}
