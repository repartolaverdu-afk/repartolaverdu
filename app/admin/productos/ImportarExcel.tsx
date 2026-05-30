'use client'

import { useState, useRef, useTransition } from 'react'
import { Upload, CheckCircle2, AlertCircle, Download } from 'lucide-react'
import * as XLSX from 'xlsx'
import { importarProductosAction, type FilaImport } from './actions'

const UNIDADES_VALIDAS = ['kg', 'cajon', 'bolsa', 'atado', 'unidad']

export default function ImportarExcel() {
  const [abierto, setAbierto] = useState(false)
  const [filas, setFilas] = useState<FilaImport[]>([])
  const [errores, setErrores] = useState<string[]>([])
  const [isPending, startTransition] = useTransition()
  const [importado, setImportado] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleArchivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setErrores([])
    setFilas([])
    setImportado(false)

    const reader = new FileReader()
    reader.onload = (ev) => {
      const data = new Uint8Array(ev.target!.result as ArrayBuffer)
      const wb = XLSX.read(data, { type: 'array' })
      const ws = wb.Sheets[wb.SheetNames[0]]
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws)

      const parsed: FilaImport[] = []
      const errs: string[] = []

      rows.forEach((row, i) => {
        const n = String(row['nombre'] ?? row['Nombre'] ?? '').trim()
        const c = String(row['categoria'] ?? row['Categoria'] ?? '').trim()
        const u = String(row['unidad'] ?? row['Unidad'] ?? '').trim().toLowerCase()
        const p = Number(row['precio_base'] ?? row['Precio'] ?? row['precio'] ?? 0)

        if (!n) { errs.push(`Fila ${i + 2}: falta "nombre"`); return }
        if (!u) { errs.push(`Fila ${i + 2}: falta "unidad"`); return }
        if (!UNIDADES_VALIDAS.includes(u)) {
          errs.push(`Fila ${i + 2}: unidad "${u}" inválida (usar: ${UNIDADES_VALIDAS.join(', ')})`)
          return
        }
        if (!p || p <= 0) { errs.push(`Fila ${i + 2}: precio inválido`); return }

        parsed.push({ nombre: n, categoria: c, unidad: u, precio_base: p })
      })

      setErrores(errs)
      setFilas(parsed)
    }
    reader.readAsArrayBuffer(file)
  }

  const handleImportar = () => {
    startTransition(async () => {
      await importarProductosAction(filas)
      setImportado(true)
      setFilas([])
      if (inputRef.current) inputRef.current.value = ''
    })
  }

  const descargarPlantilla = () => {
    const data = [
      { nombre: 'Tomate redondo', categoria: 'Verduras', unidad: 'kg', precio_base: 850 },
      { nombre: 'Tomate redondo', categoria: 'Verduras', unidad: 'cajon', precio_base: 13500 },
      { nombre: 'Papa', categoria: 'Verduras', unidad: 'bolsa', precio_base: 8500 },
    ]
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Productos')
    XLSX.writeFile(wb, 'plantilla-productos.xlsx')
  }

  if (!abierto) {
    return (
      <button
        onClick={() => setAbierto(true)}
        className="flex items-center gap-2 text-sm border border-gray-300 text-gray-600 rounded-xl px-3 py-2 hover:bg-gray-50 transition-colors"
      >
        <Upload className="w-4 h-4" />
        Importar Excel
      </button>
    )
  }

  return (
    <div className="bg-white rounded-2xl border p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-gray-800">Importar desde Excel</h2>
        <button onClick={() => { setAbierto(false); setFilas([]); setErrores([]) }} className="text-gray-400 hover:text-gray-600 text-sm">
          Cerrar
        </button>
      </div>

      <button
        onClick={descargarPlantilla}
        className="flex items-center gap-2 text-xs text-green-700 hover:underline"
      >
        <Download className="w-3.5 h-3.5" />
        Descargar plantilla de ejemplo
      </button>

      <div className="text-xs text-gray-500 bg-gray-50 rounded-xl p-3 space-y-1">
        <p className="font-medium text-gray-700">Columnas requeridas:</p>
        <p><code className="bg-white px-1 rounded">nombre</code>, <code className="bg-white px-1 rounded">categoria</code>, <code className="bg-white px-1 rounded">unidad</code>, <code className="bg-white px-1 rounded">precio_base</code></p>
        <p>Unidades válidas: <strong>kg, cajon, bolsa, atado, unidad</strong></p>
        <p>Un producto con varias unidades va en filas separadas.</p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={handleArchivo}
        className="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-green-50 file:text-green-700 file:font-medium hover:file:bg-green-100"
      />

      {errores.length > 0 && (
        <div className="space-y-1">
          {errores.map((e, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-red-600">
              <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              {e}
            </div>
          ))}
        </div>
      )}

      {filas.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700">
            Vista previa — {filas.length} filas válidas
          </p>
          <div className="max-h-48 overflow-y-auto border rounded-xl divide-y text-xs">
            <div className="grid grid-cols-4 gap-2 px-3 py-2 bg-gray-50 font-semibold text-gray-600">
              <span>Producto</span><span>Categoría</span><span>Unidad</span><span>Precio</span>
            </div>
            {filas.map((f, i) => (
              <div key={i} className="grid grid-cols-4 gap-2 px-3 py-2 text-gray-700">
                <span className="truncate">{f.nombre}</span>
                <span className="truncate">{f.categoria || '—'}</span>
                <span>{f.unidad}</span>
                <span>${f.precio_base.toLocaleString('es-AR')}</span>
              </div>
            ))}
          </div>

          <button
            onClick={handleImportar}
            disabled={isPending}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold rounded-xl py-3 text-sm transition-colors"
          >
            {isPending ? 'Importando...' : `Importar ${filas.length} productos`}
          </button>
        </div>
      )}

      {importado && (
        <div className="flex items-center gap-2 text-green-700 text-sm">
          <CheckCircle2 className="w-4 h-4" />
          Importación completada correctamente
        </div>
      )}
    </div>
  )
}
