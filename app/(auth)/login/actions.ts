'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export type LoginState = { error: string } | undefined

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Completá todos los campos' }
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error || !data.user) {
    return { error: 'Email o contraseña incorrectos' }
  }

  const { data: usuario } = await supabase
    .from('usuarios')
    .select('rol')
    .eq('id', data.user.id)
    .single()

  redirect(usuario?.rol === 'admin' ? '/admin/dashboard' : '/inicio')
}
