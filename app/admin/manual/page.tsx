import PrintButton from './PrintButton'

export default function ManualPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', sans-serif; background: #f8fafc; color: #1e293b; }
        .manual { max-width: 800px; margin: 0 auto; padding: 40px 24px 80px; }
        .print-btn { position: fixed; bottom: 24px; right: 24px; background: #16a34a; color: white; border: none; border-radius: 12px; padding: 14px 24px; font-size: 15px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 14px rgba(22,163,74,.4); display: flex; align-items: center; gap: 8px; z-index: 100; }
        .print-btn:hover { background: #15803d; }
        /* Cover */
        .cover { background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); border-radius: 16px; padding: 48px 40px; color: white; margin-bottom: 40px; }
        .cover-badge { background: rgba(255,255,255,.2); display: inline-block; padding: 4px 12px; border-radius: 100px; font-size: 12px; font-weight: 600; margin-bottom: 16px; letter-spacing: .5px; text-transform: uppercase; }
        .cover h1 { font-size: 36px; font-weight: 700; line-height: 1.2; margin-bottom: 12px; }
        .cover p { font-size: 16px; opacity: .85; margin-bottom: 24px; }
        .cover-meta { display: flex; gap: 24px; font-size: 13px; opacity: .75; }
        /* TOC */
        .toc { background: white; border-radius: 12px; border: 1px solid #e2e8f0; padding: 24px 28px; margin-bottom: 40px; }
        .toc h2 { font-size: 14px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: .5px; margin-bottom: 16px; }
        .toc a { display: block; color: #1e293b; text-decoration: none; padding: 5px 0; font-size: 14px; border-bottom: 1px solid #f1f5f9; }
        .toc a:hover { color: #16a34a; }
        .toc a.sub { padding-left: 16px; color: #64748b; font-size: 13px; }
        /* Section */
        .section { background: white; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 24px; overflow: hidden; }
        .section-header { background: #f8fafc; padding: 20px 24px; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; gap: 12px; }
        .section-badge { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
        .badge-green { background: #dcfce7; }
        .badge-blue { background: #dbeafe; }
        .section-header h2 { font-size: 18px; font-weight: 700; color: #0f172a; }
        .section-body { padding: 24px; }
        /* Subsection */
        .subsection { margin-bottom: 28px; }
        .subsection:last-child { margin-bottom: 0; }
        .subsection h3 { font-size: 15px; font-weight: 600; color: #0f172a; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
        .subsection h3::before { content: ''; display: block; width: 3px; height: 16px; background: #16a34a; border-radius: 2px; }
        /* Screen mockup */
        .screen { background: #1e293b; border-radius: 10px; padding: 16px; margin: 12px 0; font-family: monospace; font-size: 12px; color: #e2e8f0; line-height: 1.6; overflow-x: auto; }
        .screen .border { color: #94a3b8; }
        /* Steps */
        ol.steps { padding-left: 0; list-style: none; counter-reset: steps; }
        ol.steps li { counter-increment: steps; padding: 8px 0 8px 36px; position: relative; font-size: 14px; line-height: 1.6; border-bottom: 1px solid #f1f5f9; color: #334155; }
        ol.steps li:last-child { border-bottom: none; }
        ol.steps li::before { content: counter(steps); position: absolute; left: 0; top: 8px; width: 24px; height: 24px; background: #dcfce7; color: #16a34a; border-radius: 50%; font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; }
        ul.bullets { padding-left: 0; list-style: none; }
        ul.bullets li { padding: 6px 0 6px 20px; position: relative; font-size: 14px; line-height: 1.6; color: #334155; }
        ul.bullets li::before { content: '·'; position: absolute; left: 6px; color: #16a34a; font-weight: 700; font-size: 18px; line-height: 1.2; }
        /* Table */
        table { width: 100%; border-collapse: collapse; font-size: 13px; margin: 12px 0; }
        th { background: #f1f5f9; text-align: left; padding: 10px 12px; font-weight: 600; color: #475569; font-size: 12px; text-transform: uppercase; letter-spacing: .4px; }
        td { padding: 10px 12px; border-bottom: 1px solid #f1f5f9; color: #334155; vertical-align: top; }
        tr:last-child td { border-bottom: none; }
        /* Note */
        .note { background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 12px 16px; font-size: 13px; color: #78350f; margin: 12px 0; display: flex; gap: 8px; }
        .note strong { color: #92400e; }
        .tip { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 12px 16px; font-size: 13px; color: #14532d; margin: 12px 0; display: flex; gap: 8px; }
        /* Status badges */
        .badge { display: inline-block; padding: 3px 10px; border-radius: 100px; font-size: 12px; font-weight: 600; }
        .badge-yellow { background: #fef9c3; color: #854d0e; }
        .badge-blue2 { background: #dbeafe; color: #1e40af; }
        .badge-orange { background: #ffedd5; color: #9a3412; }
        .badge-purple { background: #f3e8ff; color: #6b21a8; }
        .badge-green2 { background: #dcfce7; color: #14532d; }
        .badge-gray { background: #f1f5f9; color: #475569; }
        /* Flow */
        .flow { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin: 12px 0; font-size: 13px; }
        .flow-step { background: #f1f5f9; border-radius: 8px; padding: 6px 12px; font-weight: 500; }
        .flow-arrow { color: #94a3b8; font-size: 18px; }
        /* Divider */
        .divider { border: none; border-top: 1px solid #e2e8f0; margin: 24px 0; }
        /* Footer */
        .footer { text-align: center; padding: 24px; color: #94a3b8; font-size: 13px; }
        /* Print */
        @media print {
          body { background: white; }
          .print-btn { display: none; }
          .manual { padding: 0; max-width: 100%; }
          .cover { border-radius: 0; print-color-adjust: exact; -webkit-print-color-adjust: exact; }
          .section { break-inside: avoid; border: 1px solid #e2e8f0; }
          .section-header { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
          .screen { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
          .cover { page-break-after: always; }
          h2, h3 { page-break-after: avoid; }
        }
      `}</style>

      <div className="manual">
        {/* Cover */}
        <div className="cover">
          <div className="cover-badge">Manual de Usuario</div>
          <h1>Reparto La Verdu</h1>
          <p>Sistema de pedidos online para clientes gastronómicos.<br/>Guía completa de uso para clientes y administradores.</p>
          <div className="cover-meta">
            <span>📅 Mayo 2026</span>
            <span>📱 Mobile-first</span>
            <span>🌐 repartolaverdu.com.ar</span>
          </div>
        </div>

        {/* TOC */}
        <div className="toc">
          <h2>Índice</h2>
          <a href="#acceso">1. Acceso al sistema</a>
          <a href="#cliente">2. Vista del Cliente</a>
          <a href="#inicio" className="sub">2.1 Pantalla de inicio</a>
          <a href="#catalogo" className="sub">2.2 Catálogo de productos</a>
          <a href="#carrito" className="sub">2.3 Carrito</a>
          <a href="#confirmar" className="sub">2.4 Confirmar pedido</a>
          <a href="#mispedidos" className="sub">2.5 Mis pedidos</a>
          <a href="#detalle" className="sub">2.6 Detalle del pedido y PDF</a>
          <a href="#repetir" className="sub">2.7 Repetir pedido anterior</a>
          <a href="#admin">3. Vista del Administrador</a>
          <a href="#dashboard" className="sub">3.1 Dashboard</a>
          <a href="#pedidosadmin" className="sub">3.2 Pedidos del día</a>
          <a href="#confirmaradmin" className="sub">3.3 Confirmar un pedido</a>
          <a href="#picking" className="sub">3.4 Picking List</a>
          <a href="#productos" className="sub">3.5 Gestión de productos</a>
          <a href="#clientes" className="sub">3.6 Gestión de clientes</a>
          <a href="#faq">4. Preguntas frecuentes</a>
        </div>

        {/* Sección 1 */}
        <div className="section" id="acceso">
          <div className="section-header">
            <div className="section-badge badge-green">🔑</div>
            <h2>1. Acceso al sistema</h2>
          </div>
          <div className="section-body">
            <p style={{fontSize:14,color:'#334155',lineHeight:1.7,marginBottom:16}}>
              Ingresá a <strong>repartolaverdu.com.ar</strong> desde cualquier navegador. El sistema funciona en celular, tablet y computadora.
            </p>
            <div className="screen">
              {`┌────────────────────────────────┐
│        Reparto La Verdu        │
│                                │
│  Email                         │
│  ┌──────────────────────────┐  │
│  │  tu@email.com            │  │
│  └──────────────────────────┘  │
│  Contraseña                    │
│  ┌──────────────────────────┐  │
│  │  ••••••••                │  │
│  └──────────────────────────┘  │
│  ┌──────────────────────────┐  │
│  │        INGRESAR          │  │
│  └──────────────────────────┘  │
└────────────────────────────────┘`}
            </div>
            <ol className="steps">
              <li>Escribí tu <strong>email</strong> y <strong>contraseña</strong></li>
              <li>Tocá <strong>Ingresar</strong></li>
              <li>El sistema te redirige según tu perfil: <strong>Clientes</strong> → pantalla de Inicio · <strong>Admin</strong> → Panel Admin</li>
            </ol>
            <div className="note">
              <span>⚠️</span>
              <span>Si olvidaste tu contraseña, contactá al administrador para que la restablezca.</span>
            </div>
          </div>
        </div>

        {/* Sección 2 */}
        <div className="section" id="cliente">
          <div className="section-header">
            <div className="section-badge badge-green">🛒</div>
            <h2>2. Vista del Cliente</h2>
          </div>
          <div className="section-body">

            <div className="subsection" id="inicio">
              <h3>2.1 Pantalla de inicio</h3>
              <div className="screen">
                {`┌────────────────────────────────┐
│  Buen día,                     │
│  Juan                          │
├────────────────────────────────┤
│  ┌──────────────────────────┐  │
│  │  🛒  Nuevo pedido  →     │  │
│  └──────────────────────────┘  │
│                                │
│  Tu último pedido:             │
│  Pedido #42 · 8 prod. $45.200  │
│  ┌──────────────────────────┐  │
│  │  ↺ Repetir este pedido   │  │
│  └──────────────────────────┘  │
│  📋 Mis pedidos           →    │
└────────────────────────────────┘`}
              </div>
              <ul className="bullets">
                <li><strong>Nuevo pedido</strong> → abre el catálogo para armar un pedido desde cero</li>
                <li><strong>Repetir pedido</strong> → copia los productos del último pedido con precios actualizados</li>
                <li><strong>Mis pedidos</strong> → muestra el historial completo de pedidos</li>
              </ul>
            </div>

            <hr className="divider" />

            <div className="subsection" id="catalogo">
              <h3>2.2 Catálogo de productos</h3>
              <div className="screen">
                {`┌────────────────────────────────┐
│  Catálogo                      │
│  ┌──────────────────────────┐  │
│  │ 🔍 Buscar productos...   │  │
│  └──────────────────────────┘  │
├────────────────────────────────┤
│  Tomate redondo   [Verduras]   │
│  kg · $850      [+ Agregar]    │
│  cajón · $13.500  [+ Agregar]  │
├────────────────────────────────┤
│  Zanahoria        [Verduras]   │
│  kg · $320     [-][ 2 ][+]     │
├────────────────────────────────┤
│  🛒 Ver carrito (3)   $4.890   │
└────────────────────────────────┘`}
              </div>
              <ol className="steps">
                <li>Buscá el producto por nombre o categoría usando el buscador</li>
                <li>Tocá <strong>+ Agregar</strong> para añadir una unidad al carrito</li>
                <li>Usá <strong>−</strong> y <strong>+</strong> para ajustar la cantidad</li>
                <li>Tocá el botón verde <strong>"Ver carrito"</strong> cuando estés listo</li>
              </ol>
              <div className="tip">
                <span>💡</span>
                <span><strong>Tip:</strong> El buscador filtra en tiempo real por nombre y categoría. Escribí "verdura" o el nombre del producto para encontrarlo rápido.</span>
              </div>
            </div>

            <hr className="divider" />

            <div className="subsection" id="carrito">
              <h3>2.3 Carrito</h3>
              <div className="screen">
                {`┌────────────────────────────────┐
│  ←  Carrito (5 productos)  🗑  │
├────────────────────────────────┤
│  Tomate redondo                │
│  kg · $850 c/u                 │
│  [-][ 3 ][+]          $2.550   │
│  Notas para este ítem...       │
├────────────────────────────────┤
│  Total estimado      $12.340   │
│  ┌──────────────────────────┐  │
│  │     Confirmar pedido     │  │
│  └──────────────────────────┘  │
└────────────────────────────────┘`}
              </div>
              <ul className="bullets">
                <li><strong>− / +</strong> → ajustar cantidad (si llegás a 0 el producto se elimina)</li>
                <li><strong>🗑 por ítem</strong> → eliminar ese producto del carrito</li>
                <li><strong>Notas</strong> → aclaraciones por producto (ej: "sin hojas amarillas")</li>
                <li><strong>🗑 arriba a la derecha</strong> → vaciar todo el carrito</li>
              </ul>
              <div className="tip">
                <span>💡</span>
                <span>El carrito se guarda en tu dispositivo. Si cerrás la app, los productos siguen guardados cuando volvés.</span>
              </div>
            </div>

            <hr className="divider" />

            <div className="subsection" id="confirmar">
              <h3>2.4 Confirmar pedido</h3>
              <div className="screen">
                {`┌────────────────────────────────┐
│  ← Confirmar pedido            │
├────────────────────────────────┤
│  RESUMEN — 5 productos         │
│  Tomate redondo 3kg   $2.550   │
│  Zanahoria 2 atado      $440   │
│  ...                           │
├────────────────────────────────┤
│  Notas del pedido (opcional)   │
│  ┌──────────────────────────┐  │
│  │ Entregar antes 10am...   │  │
│  └──────────────────────────┘  │
├────────────────────────────────┤
│  Total estimado      $12.340   │
│  [ ✅  Enviar pedido ]         │
└────────────────────────────────┘`}
              </div>
              <ol className="steps">
                <li>Revisá el resumen de productos y precios</li>
                <li>Agregá <strong>notas generales</strong> si necesitás (horario, instrucciones)</li>
                <li>Tocá <strong>Enviar pedido</strong></li>
                <li>Aparece la confirmación con el número de pedido asignado</li>
              </ol>
              <div className="note">
                <span>⚠️</span>
                <span><strong>Importante:</strong> Los precios se congelan al momento de enviar. Cambios de precio posteriores no afectan este pedido.</span>
              </div>
            </div>

            <hr className="divider" />

            <div className="subsection" id="mispedidos">
              <h3>2.5 Mis pedidos</h3>
              <p style={{fontSize:14,color:'#334155',lineHeight:1.7,marginBottom:12}}>Historial completo de todos tus pedidos con estado y fecha.</p>
              <table>
                <thead>
                  <tr>
                    <th>Estado</th>
                    <th>Color</th>
                    <th>Significado</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td><span className="badge badge-yellow">Enviado</span></td><td>Amarillo</td><td>Recibido, esperando confirmación</td></tr>
                  <tr><td><span className="badge badge-blue2">Confirmado</span></td><td>Azul</td><td>La verdulería confirmó los productos</td></tr>
                  <tr><td><span className="badge badge-orange">Con faltantes</span></td><td>Naranja</td><td>Hay productos sin stock</td></tr>
                  <tr><td><span className="badge badge-purple">En preparación</span></td><td>Violeta</td><td>Tu pedido se está armando</td></tr>
                  <tr><td><span className="badge badge-green2">Entregado</span></td><td>Verde</td><td>Pedido entregado correctamente</td></tr>
                  <tr><td><span className="badge badge-gray">Cancelado</span></td><td>Gris</td><td>Pedido cancelado</td></tr>
                </tbody>
              </table>
            </div>

            <hr className="divider" />

            <div className="subsection" id="detalle">
              <h3>2.6 Detalle del pedido y PDF</h3>
              <p style={{fontSize:14,color:'#334155',lineHeight:1.7,marginBottom:12}}>Tocá cualquier pedido del historial para ver el detalle completo y descargar el comprobante.</p>
              <ol className="steps">
                <li>Andá a <strong>Mis pedidos</strong></li>
                <li>Tocá el pedido que querés ver</li>
                <li>Revisá los productos, cantidades y precios</li>
                <li>Tocá <strong>"Descargar comprobante"</strong> para obtener el PDF</li>
              </ol>
              <div className="tip">
                <span>💡</span>
                <span>El PDF incluye número de pedido, fecha, listado de productos con precios y total. Puede imprimirse o enviarse por WhatsApp.</span>
              </div>
            </div>

            <hr className="divider" />

            <div className="subsection" id="repetir">
              <h3>2.7 Repetir pedido anterior</h3>
              <ol className="steps">
                <li>Desde la pantalla de <strong>Inicio</strong>, tocá <strong>"Repetir este pedido"</strong></li>
                <li>El sistema copia todos los productos del último pedido</li>
                <li>Los precios se actualizan a los vigentes (incluye tus precios especiales si tenés)</li>
                <li>Te lleva al carrito con todos los ítems cargados</li>
                <li>Podés modificar antes de confirmar</li>
              </ol>
              <div className="note">
                <span>⚠️</span>
                <span>Repetir pedido no garantiza los mismos precios — aplica los precios del día en que hacés el nuevo pedido.</span>
              </div>
            </div>

          </div>
        </div>

        {/* Sección 3 */}
        <div className="section" id="admin">
          <div className="section-header">
            <div className="section-badge badge-blue">⚙️</div>
            <h2>3. Vista del Administrador</h2>
          </div>
          <div className="section-body">

            <div className="subsection" id="dashboard">
              <h3>3.1 Dashboard</h3>
              <p style={{fontSize:14,color:'#334155',lineHeight:1.7,marginBottom:12}}>Pantalla principal con métricas del día y accesos rápidos.</p>
              <table>
                <thead><tr><th>Métrica</th><th>Descripción</th></tr></thead>
                <tbody>
                  <tr><td>⚠️ Por confirmar</td><td>Pedidos enviados que esperan tu confirmación</td></tr>
                  <tr><td>🚚 En proceso</td><td>Pedidos confirmados + en preparación</td></tr>
                  <tr><td>✅ Entregados hoy</td><td>Pedidos completados en el día</td></tr>
                  <tr><td>💰 Total del día</td><td>Suma estimada de todos los pedidos activos</td></tr>
                </tbody>
              </table>
              <p style={{fontSize:13,color:'#64748b',marginTop:12}}>Navegación inferior: 🏠 Inicio · 📋 Pedidos · 📃 Picking · 📦 Productos · 👥 Clientes · Salir</p>
            </div>

            <hr className="divider" />

            <div className="subsection" id="pedidosadmin">
              <h3>3.2 Pedidos del día</h3>
              <p style={{fontSize:14,color:'#334155',lineHeight:1.7,marginBottom:12}}>
                Lista de todos los pedidos con filtros por estado. Tocá cualquier filtro en la barra superior para ver solo esos pedidos.
              </p>
              <div className="tip">
                <span>💡</span>
                <span>El filtro <strong>Enviados</strong> te muestra los pedidos que están esperando tu confirmación — es lo primero que tenés que revisar cada día.</span>
              </div>
            </div>

            <hr className="divider" />

            <div className="subsection" id="confirmaradmin">
              <h3>3.3 Confirmar un pedido</h3>
              <ol className="steps">
                <li>Tocá un pedido de la lista → entrás al detalle</li>
                <li>Revisá los productos solicitados</li>
                <li>Si algún producto no tiene stock → tocá <strong>"Marcar faltante"</strong> (se pone naranja)</li>
                <li>Ajustá la <strong>cantidad confirmada</strong> si entregás menos de lo solicitado</li>
                <li>Agregá <strong>notas internas</strong> si necesitás (solo las ve el admin)</li>
                <li>Tocá <strong>"Confirmar pedido"</strong></li>
              </ol>
              <p style={{fontSize:13,color:'#64748b',marginBottom:12}}>Flujo de estados del pedido:</p>
              <div className="flow">
                <span className="flow-step">Enviado</span>
                <span className="flow-arrow">→</span>
                <span className="flow-step">Confirmado / Con faltantes</span>
                <span className="flow-arrow">→</span>
                <span className="flow-step">En preparación</span>
                <span className="flow-arrow">→</span>
                <span className="flow-step">Entregado ✅</span>
              </div>
            </div>

            <hr className="divider" />

            <div className="subsection" id="picking">
              <h3>3.4 Picking List</h3>
              <p style={{fontSize:14,color:'#334155',lineHeight:1.7,marginBottom:12}}>
                Lista consolidada de todos los productos de los pedidos activos (Confirmados + En preparación). Tiene dos vistas:
              </p>
              <table>
                <thead><tr><th>Tab</th><th>Para qué sirve</th></tr></thead>
                <tbody>
                  <tr><td><strong>Por producto</strong></td><td>Ver la cantidad total de cada producto sumada entre todos los pedidos. Ideal para ir al depósito y juntar todo junto.</td></tr>
                  <tr><td><strong>Por cliente</strong></td><td>Ver qué le corresponde a cada cliente. Ideal para armar las cajas o bolsas individuales.</td></tr>
                </tbody>
              </table>
              <p style={{fontSize:14,color:'#334155',lineHeight:1.7,margin:'12px 0'}}>
                Tocá <strong>"Descargar picking list PDF"</strong> para obtener un PDF de 2 páginas (una por cada vista).
              </p>
              <div className="note">
                <span>⚠️</span>
                <span>Solo incluye pedidos <strong>Confirmados</strong>, <strong>Con faltantes</strong> o <strong>En preparación</strong>. Los pedidos Enviados sin confirmar NO aparecen.</span>
              </div>
            </div>

            <hr className="divider" />

            <div className="subsection" id="productos">
              <h3>3.5 Gestión de productos</h3>
              <ul className="bullets">
                <li><strong>Nuevo producto:</strong> tocá "+ Nuevo producto", completá nombre, categoría y unidades con precios</li>
                <li><strong>Editar:</strong> tocá el ícono ✏️ al lado del producto</li>
                <li><strong>Expandir:</strong> tocá ∨ para ver y editar precios por unidad</li>
                <li><strong>Activar/desactivar:</strong> tocá el botón "Activo" para ocultar del catálogo sin borrar</li>
              </ul>
              <p style={{fontSize:14,fontWeight:600,color:'#0f172a',margin:'16px 0 8px'}}>Importar desde Excel</p>
              <ol className="steps">
                <li>Tocá <strong>"Importar Excel"</strong> (arriba a la derecha)</li>
                <li>Descargá la plantilla de ejemplo</li>
                <li>Completá el Excel con columnas: <code style={{background:'#f1f5f9',padding:'1px 6px',borderRadius:4}}>nombre</code>, <code style={{background:'#f1f5f9',padding:'1px 6px',borderRadius:4}}>categoria</code>, <code style={{background:'#f1f5f9',padding:'1px 6px',borderRadius:4}}>unidad</code>, <code style={{background:'#f1f5f9',padding:'1px 6px',borderRadius:4}}>precio_base</code></li>
                <li>Subí el archivo (.xlsx o .csv)</li>
                <li>Revisá la vista previa y tocá <strong>"Importar X productos"</strong></li>
              </ol>
              <div className="tip">
                <span>💡</span>
                <span>Unidades válidas: <strong>kg, cajon, bolsa, atado, unidad</strong>. Un mismo producto en varias unidades va en filas separadas.</span>
              </div>
            </div>

            <hr className="divider" />

            <div className="subsection" id="clientes">
              <h3>3.6 Gestión de clientes</h3>
              <ul className="bullets">
                <li><strong>Nuevo cliente:</strong> tocá "+ Nuevo", completá nombre, email, contraseña y datos de entrega</li>
                <li><strong>Editar datos:</strong> tocá el cliente → modificá los campos → "Guardar datos"</li>
                <li><strong>Activar/desactivar:</strong> tocá "Activo" en la lista para habilitar/deshabilitar el acceso</li>
              </ul>
              <p style={{fontSize:14,fontWeight:600,color:'#0f172a',margin:'16px 0 8px'}}>Precios especiales por cliente</p>
              <ol className="steps">
                <li>Entrá al detalle del cliente</li>
                <li>En la sección <strong>"Precios especiales"</strong>, buscá el producto</li>
                <li>Escribí el precio especial en el campo de la derecha (se resalta en verde)</li>
                <li>Dejá vacío para usar el precio base</li>
                <li>Tocá <strong>"Guardar precios especiales"</strong></li>
              </ol>
              <div className="tip">
                <span>💡</span>
                <span>Los precios especiales se aplican automáticamente cuando ese cliente ve el catálogo y hace un pedido.</span>
              </div>
            </div>

          </div>
        </div>

        {/* FAQ */}
        <div className="section" id="faq">
          <div className="section-header">
            <div className="section-badge badge-green">❓</div>
            <h2>4. Preguntas frecuentes</h2>
          </div>
          <div className="section-body">
            <table>
              <tbody>
                {[
                  ["¿Qué pasa si el precio cambia después de enviar el pedido?","Los precios se congelan al enviar. Cambios posteriores no afectan el pedido ya enviado."],
                  ["¿Puedo editar un pedido después de enviarlo?","No. Una vez enviado, contactá al administrador para cualquier cambio."],
                  ["¿El total estimado es el precio final?","Es una estimación. Puede variar si el admin confirma cantidades diferentes por faltantes."],
                  ["¿Cómo sé si mi pedido fue confirmado?","En 'Mis pedidos' vas a ver el estado actualizado. El admin también puede avisarte por WhatsApp."],
                  ["¿Qué significa 'Con faltantes'?","Uno o más productos no tienen stock. Revisá el detalle del pedido para ver cuáles."],
                  ["¿La picking list incluye todos los pedidos?","Solo los pedidos Confirmados, Con faltantes o En preparación. Los Enviados no aparecen."],
                  ["¿Funciona en celular?","Sí, el sistema está diseñado principalmente para celular. Funciona en Chrome, Safari y Firefox."],
                ].map(([q, a], i) => (
                  <tr key={i}>
                    <td style={{fontWeight:600,width:'40%',color:'#0f172a',verticalAlign:'top'}}>{q}</td>
                    <td style={{color:'#475569'}}>{a}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="footer">
          Manual de Usuario · Reparto La Verdu · Sistema de Pedidos · Versión 1.0 · Mayo 2026
        </div>
      </div>

      <PrintButton />
    </>
  )
}
