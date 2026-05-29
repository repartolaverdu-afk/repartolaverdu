# Frutería — Sistema de Pedidos: Contexto para nueva sesión

## Rol que debe adoptar Claude
Actuá como Arquitecto de Software Lead y Programador Full-Stack Senior. El proyecto está en **Fase 2: Desarrollo**. La arquitectura ya fue aprobada y cerrada. No rediscutir decisiones de diseño, ir directo al código.

---

## Qué es el sistema
Sistema web de pedidos para una frutería y verdulería mayorista, orientado a clientes gastronómicos (restaurantes, verdulerías). Reemplaza el flujo actual de WhatsApp + Excel.

Características clave:
- Buscador instantáneo de productos
- Opción "Repetir último pedido"
- Panel admin con picking list (lista sumada de todos los pedidos para el reparto)
- Generación de PDF: comprobante por pedido y picking list
- Mobile-first

---

## Stack tecnológico (cerrado, no cambiar)
- **Framework:** Next.js 14 con App Router
- **Base de datos + Auth:** Supabase (PostgreSQL)
- **Estilos:** Tailwind CSS
- **PDF:** @react-pdf/renderer (para comprobante cliente Y picking list — ambos descargables e imprimibles)
- **Estado del carrito:** Zustand
- **Iconos:** lucide-react
- **Hosting:** Vercel

---

## Modelo de datos (6 tablas en Supabase)

### `usuarios` (extiende auth.users de Supabase)
- id (uuid, FK a auth.users)
- nombre, telefono, direccion, zona_entrega, dia_entrega
- rol: 'admin' | 'cliente'
- activo (baja lógica)

### `productos`
- id, nombre, categoria, imagen_url, activo

### `producto_unidades`
- id, producto_id (FK), unidad ('kg'|'cajon'|'bolsa'|'atado'|'unidad'), precio_base, activo

### `precios_cliente`
- id, cliente_id (FK), producto_unidad_id (FK), precio_especial, activo
- Si no existe registro → usar precio_base automáticamente

### `pedidos`
- id, numero_pedido (serial), cliente_id (FK)
- estado: BORRADOR → ENVIADO → CONFIRMADO → EN_PREPARACION → ENTREGADO
  - También: CON_FALTANTES, CANCELADO
- fecha_pedido, fecha_entrega, zona_entrega, notas_cliente, notas_admin, total_estimado

### `detalle_pedido`
- id, pedido_id (FK), producto_unidad_id (FK)
- cantidad_solicitada, cantidad_confirmada
- **precio_unitario: SE CONGELA al momento del envío** (regla crítica)
- subtotal, faltante (bool), notas_item

---

## Reglas de negocio críticas
1. El `precio_unitario` en `detalle_pedido` se congela al enviar el pedido
2. Si existe `precios_cliente` para ese cliente + unidad → usar ese precio; si no → usar `precio_base`
3. "Repetir pedido" crea nuevo BORRADOR copiando ítems, recalculando precios vigentes
4. Picking list suma `cantidad_confirmada` (no solicitada) de pedidos en CONFIRMADO o EN_PREPARACION
5. Nunca borrar físicamente — usar `activo = false`

---

## Estructura de archivos del proyecto

```
fruteria-pedidos/
├── app/
│   ├── (auth)/login/
│   ├── (cliente)/inicio/, catalogo/, carrito/, pedidos/, pedidos/[id]/
│   ├── (admin)/dashboard/, pedidos/, pedidos/[id]/, picking/, productos/, clientes/
│   └── api/pedidos/, productos/, clientes/
├── components/
│   ├── ui/          ← componentes genéricos reutilizables
│   ├── cliente/     ← componentes de la vista cliente
│   └── admin/       ← componentes del panel admin
├── lib/
│   ├── supabase/client.ts   ← createBrowserClient (Client Components)
│   ├── supabase/server.ts   ← createServerClient (Server Components + API Routes)
│   └── supabase/admin.ts    ← service role key, bypasea RLS (solo servidor)
├── types/index.ts           ← todos los tipos TypeScript
├── middleware.ts            ← protección de rutas por sesión y rol
└── .env.local               ← keys de Supabase (no commitear)
```

---

## Variables de entorno (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...   ← para el cliente (con RLS)
SUPABASE_SERVICE_ROLE_KEY=eyJ...       ← solo servidor, bypasea RLS
```

---

## Pantallas a construir

### Cliente
| ID | Pantalla | Estado |
|---|---|---|
| C-01 | Login | ⬜ Pendiente |
| C-02 | Inicio (Repetir / Nuevo pedido) | ⬜ Pendiente |
| C-03 | Catálogo con buscador | ⬜ Pendiente |
| C-04 | Carrito | ⬜ Pendiente |
| C-05 | Confirmación de pedido | ⬜ Pendiente |
| C-06 | Mis pedidos (historial) | ⬜ Pendiente |
| C-07 | Detalle pedido + PDF | ⬜ Pendiente |

### Admin
| ID | Pantalla | Estado |
|---|---|---|
| A-01 | Dashboard | ⬜ Pendiente |
| A-02 | Pedidos del día (lista filtrable) | ⬜ Pendiente |
| A-03 | Detalle pedido (confirmar ítems, faltantes) | ⬜ Pendiente |
| A-04 | Picking List (2 tabs: por producto / por cliente) + PDF | ⬜ Pendiente |
| A-05 | ABM Productos | ⬜ Pendiente |
| A-06 | ABM Clientes + precios especiales | ⬜ Pendiente |

---

## Estado actual del proyecto

### ✅ Completado
- Arquitectura y modelo de datos (Fase 1 cerrada)
- Proyecto Next.js 14 creado con TypeScript + Tailwind + App Router
- Dependencias instaladas: @supabase/supabase-js, @supabase/ssr, @react-pdf/renderer, zustand, lucide-react

### 🔄 En progreso (Hito 0 — Setup base)
El usuario está completando estos archivos:

**1. `.env.local`** — keys de Supabase (ver sección Variables de entorno)

**2. SQL en Supabase SQL Editor** — crear las 6 tablas + RLS + trigger

**3. `lib/supabase/client.ts`**
```typescript
import { createBrowserClient } from '@supabase/ssr'
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

**4. `lib/supabase/server.ts`**
```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )
}
```

**5. `lib/supabase/admin.ts`**
```typescript
import { createClient } from '@supabase/supabase-js'
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}
```

**6. `types/index.ts`**
```typescript
export type Rol = 'admin' | 'cliente'
export type Unidad = 'kg' | 'cajon' | 'bolsa' | 'atado' | 'unidad'
export type EstadoPedido =
  | 'BORRADOR' | 'ENVIADO' | 'CONFIRMADO'
  | 'CON_FALTANTES' | 'EN_PREPARACION' | 'ENTREGADO' | 'CANCELADO'

export interface Usuario {
  id: string
  nombre: string
  telefono: string | null
  direccion: string | null
  zona_entrega: string | null
  dia_entrega: string | null
  rol: Rol
  activo: boolean
  creado_en: string
}

export interface Producto {
  id: string
  nombre: string
  categoria: string | null
  imagen_url: string | null
  activo: boolean
  creado_en: string
}

export interface ProductoUnidad {
  id: string
  producto_id: string
  unidad: Unidad
  precio_base: number
  activo: boolean
  producto?: Producto
}

export interface PrecioCliente {
  id: string
  cliente_id: string
  producto_unidad_id: string
  precio_especial: number
  activo: boolean
}

export interface Pedido {
  id: string
  numero_pedido: number
  cliente_id: string
  estado: EstadoPedido
  fecha_pedido: string
  fecha_entrega: string | null
  zona_entrega: string | null
  notas_cliente: string | null
  notas_admin: string | null
  total_estimado: number | null
  cliente?: Usuario
  detalle?: DetallePedido[]
}

export interface DetallePedido {
  id: string
  pedido_id: string
  producto_unidad_id: string
  cantidad_solicitada: number
  cantidad_confirmada: number | null
  precio_unitario: number
  subtotal: number | null
  faltante: boolean
  notas_item: string | null
  producto_unidad?: ProductoUnidad
}

export interface ItemCarrito {
  producto_unidad_id: string
  producto_nombre: string
  unidad: Unidad
  cantidad: number
  precio_unitario: number
  notas_item: string
}
```

**7. `middleware.ts`** (en la raíz, al lado de package.json)
```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )
  const { data: { user } } = await supabase.auth.getUser()
  const path = request.nextUrl.pathname

  if (!user && path !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  if (user && path === '/login') {
    const { data: usuario } = await supabase
      .from('usuarios').select('rol').eq('id', user.id).single()
    const destino = usuario?.rol === 'admin' ? '/admin/dashboard' : '/inicio'
    return NextResponse.redirect(new URL(destino, request.url))
  }
  if (user && path.startsWith('/admin')) {
    const { data: usuario } = await supabase
      .from('usuarios').select('rol').eq('id', user.id).single()
    if (usuario?.rol !== 'admin') {
      return NextResponse.redirect(new URL('/inicio', request.url))
    }
  }
  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
```

---

## Cómo verificar que el Hito 0 está OK
```bash
npm run dev
```
Abrir `http://localhost:3000` — debe redirigir automáticamente a `/login` (aunque la página esté en blanco). Si eso pasa, el middleware funciona y el setup base está completo.

---

## Próximo paso: Hito 1 — Login
Una vez verificado el Hito 0, construir la pantalla C-01:
- Ruta: `app/(auth)/login/page.tsx`
- Email + password
- Supabase Auth `signInWithPassword`
- Redirección por rol al éxito: admin → `/admin/dashboard`, cliente → `/inicio`
- Manejo de error: "Email o contraseña incorrectos"
- Diseño mobile-first con Tailwind, sin librerías de UI externas
