import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const s = StyleSheet.create({
  page:       { padding: 36, fontSize: 10, fontFamily: 'Helvetica', color: '#1a1a1a' },
  title:      { fontSize: 16, fontFamily: 'Helvetica-Bold', marginBottom: 2 },
  subtitle:   { fontSize: 10, color: '#6b7280', marginBottom: 16 },
  divider:    { borderBottomWidth: 1, borderBottomColor: '#e5e7eb', marginVertical: 10 },
  sectionTitle: { fontSize: 11, fontFamily: 'Helvetica-Bold', marginBottom: 8, color: '#374151' },
  card:       { marginBottom: 10, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 4 },
  cardHeader: { backgroundColor: '#f9fafb', padding: '6 8', flexDirection: 'row', justifyContent: 'space-between' },
  cardBody:   { padding: '4 8 6 8' },
  row:        { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 2 },
  bold:       { fontFamily: 'Helvetica-Bold' },
  gray:       { color: '#6b7280' },
  totalBadge: { fontFamily: 'Helvetica-Bold', fontSize: 11, color: '#16a34a' },
  clientRow:  { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 1.5, paddingLeft: 8 },
  bullet:     { color: '#9ca3af', marginRight: 4 },
})

export type PickingPorProducto = {
  nombre: string
  categoria: string | null
  unidad: string
  totalConfirmado: number
  clientes: { nombre: string; numeroPedido: number; cantidad: number }[]
}

export type PickingPorCliente = {
  clienteNombre: string
  numeroPedido: number
  items: { nombre: string; unidad: string; cantidad: number }[]
}

type Props = {
  porProducto: PickingPorProducto[]
  porCliente: PickingPorCliente[]
  fecha: string
}

export function PickingListPDF({ porProducto, porCliente, fecha }: Props) {
  return (
    <Document>
      {/* Página 1: Por producto */}
      <Page size="A4" style={s.page}>
        <Text style={s.title}>Reparto La Verdu — Picking List</Text>
        <Text style={s.subtitle}>Por producto · {fecha}</Text>
        <View style={s.divider} />

        <Text style={s.sectionTitle}>Resumen por producto ({porProducto.length} ítems)</Text>

        {porProducto.map((item, i) => (
          <View key={i} style={s.card}>
            <View style={s.cardHeader}>
              <Text style={s.bold}>{item.nombre} — {item.unidad}</Text>
              <Text style={s.totalBadge}>{item.totalConfirmado} {item.unidad}</Text>
            </View>
            <View style={s.cardBody}>
              {item.clientes.map((c, j) => (
                <View key={j} style={s.clientRow}>
                  <Text><Text style={s.bullet}>· </Text>{c.nombre} (#{c.numeroPedido})</Text>
                  <Text style={s.gray}>{c.cantidad} {item.unidad}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </Page>

      {/* Página 2: Por cliente */}
      <Page size="A4" style={s.page}>
        <Text style={s.title}>Reparto La Verdu — Picking List</Text>
        <Text style={s.subtitle}>Por cliente · {fecha}</Text>
        <View style={s.divider} />

        <Text style={s.sectionTitle}>Detalle por cliente ({porCliente.length} pedidos)</Text>

        {porCliente.map((cliente, i) => (
          <View key={i} style={s.card}>
            <View style={s.cardHeader}>
              <Text style={s.bold}>{cliente.clienteNombre}</Text>
              <Text style={s.gray}>Pedido #{cliente.numeroPedido}</Text>
            </View>
            <View style={s.cardBody}>
              {cliente.items.map((item, j) => (
                <View key={j} style={s.row}>
                  <Text><Text style={s.bullet}>· </Text>{item.nombre}</Text>
                  <Text style={s.gray}>{item.cantidad} {item.unidad}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </Page>
    </Document>
  )
}
