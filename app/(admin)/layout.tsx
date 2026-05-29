import Link from 'next/link'
import { LayoutDashboard, ClipboardList, ListOrdered, Package, Users } from 'lucide-react'

const nav = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Inicio' },
  { href: '/admin/pedidos',   icon: ClipboardList,    label: 'Pedidos' },
  { href: '/admin/picking',   icon: ListOrdered,      label: 'Picking' },
  { href: '/admin/productos', icon: Package,          label: 'Productos' },
  { href: '/admin/clientes',  icon: Users,            label: 'Clientes' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 pb-20">{children}</div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t z-20">
        <div className="flex max-w-lg mx-auto">
          {nav.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className="flex-1 flex flex-col items-center gap-1 py-2 text-gray-400 hover:text-green-600 transition-colors"
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  )
}
