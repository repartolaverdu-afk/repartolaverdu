import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const s = StyleSheet.create({
  page:        { padding: 40, fontSize: 10, fontFamily: 'Helvetica', color: '#1a1a1a' },
  header:      { marginBottom: 24 },
  title:       { fontSize: 18, fontFamily: 'Helvetica-Bold', marginBottom: 2 },
  subtitle:    { fontSize: 11, color: '#555' },
  divider:     { borderBottomWidth: 1, borderBottomColor: '#e5e7eb', marginVertical: 12 },
  row:         { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  label:       { color: '#6b7280' },
  value:       { fontFamily: 'Helvetica-Bold' },
  tableHeader: { flexDirection: 'row', backgroundColor: '#f3f4f6', padding: 6, borderRadius: 4, marginBottom: 4 },
  tableRow:    { flexDirection: 'row', padding: '5 6', borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  colNombre:   { flex: 3 },
  colUnidad:   { flex: 1, textAlign: 'center' },
  colCant:     { flex: 1, textAlign: 'center' },
  colPrecio:   { flex: 1.5, textAlign: 'right' },
  colSubtotal: { flex: 1.5, textAlign: 'right' },
  thText:      { fontFamily: 'Helvetica-Bold', fontSize: 9, color: '#374151' },
  totalRow:    { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 },
  totalLabel:  { fontFamily: 'Helvetica-Bold', fontSize: 12, marginRight: 12 },
  totalValue:  { fontFamily: 'Helvetica-Bold', fontSize: 12, color: '#16a34a' },
  notasBox:    { marginTop: 16, backgroundColor: '#f9fafb', padding: 10, borderRadius: 4 },
  notasLabel:  { fontFamily: 'Helvetica-Bold', marginBottom: 3, color: '#374151' },
  footer:      { marginTop: 32, textAlign: 'center', fontSize: 9, color: '#9ca3af' },
})

export type PedidoPDF = {
  numero_pedido: number
  fecha_pedido: string
  estado: string
  total_estimado: number | null
  notas_cliente: string | null
  cliente: { nombre: string } | null
  detalle_pedido: Array<{
    cantidad_solicitada: number
    precio_unitario: number
    subtotal: number | null
    notas_item: string | null
    producto_unidad: { unidad: string; producto: { nombre: string } } | null
  }>
}

const ESTADO_LABELS: Record<string, string> = {
  ENVIADO: 'Enviado', CONFIRMADO: 'Confirmado', CON_FALTANTES: 'Con faltantes',
  EN_PREPARACION: 'En preparación', ENTREGADO: 'Entregado', CANCELADO: 'Cancelado',
}

function fmt(n: number) {
  return '$' + n.toLocaleString('es-AR')
}

export function ComprobantePDF({ pedido }: { pedido: PedidoPDF }) {
  const fecha = new Date(pedido.fecha_pedido).toLocaleDateString('es-AR', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <Text style={s.title}>Reparto La Verdu</Text>
          <Text style={s.subtitle}>Comprobante de Pedido</Text>
        </View>

        <View style={s.divider} />

        <View style={{ marginBottom: 12 }}>
          <View style={s.row}>
            <Text style={s.label}>Pedido</Text>
            <Text style={s.value}>#{pedido.numero_pedido}</Text>
          </View>
          <View style={s.row}>
            <Text style={s.label}>Fecha</Text>
            <Text>{fecha}</Text>
          </View>
          <View style={s.row}>
            <Text style={s.label}>Estado</Text>
            <Text style={s.value}>{ESTADO_LABELS[pedido.estado] ?? pedido.estado}</Text>
          </View>
          {pedido.cliente && (
            <View style={s.row}>
              <Text style={s.label}>Cliente</Text>
              <Text>{pedido.cliente.nombre}</Text>
            </View>
          )}
        </View>

        <View style={s.divider} />

        {/* Tabla de ítems */}
        <View style={s.tableHeader}>
          <Text style={[s.thText, s.colNombre]}>Producto</Text>
          <Text style={[s.thText, s.colUnidad]}>Unidad</Text>
          <Text style={[s.thText, s.colCant]}>Cant.</Text>
          <Text style={[s.thText, s.colPrecio]}>Precio</Text>
          <Text style={[s.thText, s.colSubtotal]}>Subtotal</Text>
        </View>

        {pedido.detalle_pedido.map((item, i) => (
          <View key={i} style={s.tableRow}>
            <View style={s.colNombre}>
              <Text>{item.producto_unidad?.producto?.nombre ?? '—'}</Text>
              {item.notas_item ? (
                <Text style={{ color: '#9ca3af', fontSize: 8 }}>{item.notas_item}</Text>
              ) : null}
            </View>
            <Text style={s.colUnidad}>{item.producto_unidad?.unidad ?? '—'}</Text>
            <Text style={s.colCant}>{item.cantidad_solicitada}</Text>
            <Text style={s.colPrecio}>{fmt(item.precio_unitario)}</Text>
            <Text style={s.colSubtotal}>{fmt(item.subtotal ?? item.cantidad_solicitada * item.precio_unitario)}</Text>
          </View>
        ))}

        <View style={s.totalRow}>
          <Text style={s.totalLabel}>Total estimado</Text>
          <Text style={s.totalValue}>{fmt(pedido.total_estimado ?? 0)}</Text>
        </View>

        {pedido.notas_cliente && (
          <View style={s.notasBox}>
            <Text style={s.notasLabel}>Notas del pedido</Text>
            <Text>{pedido.notas_cliente}</Text>
          </View>
        )}

        <Text style={s.footer}>
          Generado el {new Date().toLocaleDateString('es-AR')} · Reparto La Verdu
        </Text>
      </Page>
    </Document>
  )
}
