'use client'

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      style={{
        position: 'fixed', bottom: 24, right: 24,
        background: '#16a34a', color: 'white', border: 'none',
        borderRadius: 12, padding: '14px 24px', fontSize: 15,
        fontWeight: 600, cursor: 'pointer', zIndex: 100,
        boxShadow: '0 4px 14px rgba(22,163,74,.4)',
        display: 'flex', alignItems: 'center', gap: 8,
      }}
    >
      🖨️ Guardar como PDF
    </button>
  )
}
