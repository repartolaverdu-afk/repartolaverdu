# Manual de Usuario — Reparto La Verdu
### Sistema de Pedidos Online

---

## Índice

1. [Acceso al sistema](#1-acceso-al-sistema)
2. [Vista del Cliente](#2-vista-del-cliente)
   - 2.1 [Pantalla de inicio](#21-pantalla-de-inicio)
   - 2.2 [Catálogo de productos](#22-catálogo-de-productos)
   - 2.3 [Carrito](#23-carrito)
   - 2.4 [Confirmar pedido](#24-confirmar-pedido)
   - 2.5 [Mis pedidos](#25-mis-pedidos)
   - 2.6 [Detalle del pedido y PDF](#26-detalle-del-pedido-y-pdf)
   - 2.7 [Repetir pedido anterior](#27-repetir-pedido-anterior)
3. [Vista del Administrador](#3-vista-del-administrador)
   - 3.1 [Dashboard](#31-dashboard)
   - 3.2 [Pedidos del día](#32-pedidos-del-día)
   - 3.3 [Confirmar un pedido](#33-confirmar-un-pedido)
   - 3.4 [Picking List](#34-picking-list)
   - 3.5 [Gestión de productos](#35-gestión-de-productos)
   - 3.6 [Gestión de clientes](#36-gestión-de-clientes)
4. [Preguntas frecuentes](#4-preguntas-frecuentes)

---

## 1. Acceso al sistema

### Cómo iniciar sesión

Ingresá a **repartolaverdu.com.ar** desde cualquier dispositivo (celular, tablet o computadora).

```
┌─────────────────────────────────┐
│        Reparto La Verdu         │
│          🌿 (ícono)             │
│                                 │
│  Email                          │
│  ┌─────────────────────────┐    │
│  │ tu@email.com            │    │
│  └─────────────────────────┘    │
│                                 │
│  Contraseña                     │
│  ┌─────────────────────────┐    │
│  │ ••••••••                │    │
│  └─────────────────────────┘    │
│                                 │
│  ┌─────────────────────────┐    │
│  │       INGRESAR          │    │
│  └─────────────────────────┘    │
└─────────────────────────────────┘
```

1. Escribí tu **email** y **contraseña**
2. Tocá **Ingresar**
3. El sistema te redirige automáticamente según tu perfil:
   - **Clientes** → van a la pantalla de Inicio
   - **Administradores** → van al Panel Admin

> **Si olvidaste tu contraseña**, contactá al administrador del sistema para que la restablezca.

---

## 2. Vista del Cliente

### 2.1 Pantalla de inicio

Después de iniciar sesión, el cliente ve su pantalla principal con tres opciones:

```
┌─────────────────────────────────┐
│  Buen día,                      │
│  Juan                           │
├─────────────────────────────────┤
│  ¿Qué querés hacer?             │
│                                 │
│  ┌─────────────────────────┐    │
│  │  🛒  Nuevo pedido  →    │    │  ← Botón verde grande
│  └─────────────────────────┘    │
│                                 │
│  Tu último pedido:              │
│  ┌─────────────────────────┐    │
│  │  Pedido #42             │    │
│  │  12 de mayo · 8 prod.   │    │
│  │  $45.200                │    │
│  │  [↺ Repetir pedido]     │    │
│  └─────────────────────────┘    │
│                                 │
│  📋 Mis pedidos          →      │
└─────────────────────────────────┘
```

**Opciones disponibles:**
- **Nuevo pedido** → abre el catálogo para armar un pedido desde cero
- **Repetir pedido** → copia los productos del último pedido con los precios actuales
- **Mis pedidos** → muestra el historial de todos tus pedidos

---

### 2.2 Catálogo de productos

El catálogo muestra todos los productos disponibles con sus precios.

```
┌─────────────────────────────────┐
│  Catálogo                       │
│  ┌─────────────────────────┐    │
│  │ 🔍 Buscar productos...  │    │  ← Buscador
│  └─────────────────────────┘    │
├─────────────────────────────────┤
│  ┌─────────────────────────┐    │
│  │ Tomate redondo [Verduras]│    │
│  │ kg · $850    [+Agregar] │    │
│  │ cajón · $13.500 [+Agr.] │    │
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │ Zanahoria    [Verduras] │    │
│  │ kg · $320   [-][2][+]   │    │  ← Ya en carrito
│  │ atado · $220 [+Agregar] │    │
│  └─────────────────────────┘    │
├─────────────────────────────────┤
│  🛒 Ver carrito (3)   $4.890    │  ← Botón flotante
└─────────────────────────────────┘
```

**Cómo agregar productos:**
1. Buscá el producto por nombre o categoría usando el buscador
2. Elegí la unidad que querés (kg, cajón, bolsa, atado, unidad)
3. Tocá **+ Agregar** para agregar 1 unidad
4. Usá los botones **−** y **+** para ajustar la cantidad
5. Cuando tengas todo, tocá el botón verde **"Ver carrito"** en el fondo

> **Tip:** El buscador filtra por nombre y categoría en tiempo real. Escribí "tomate" o "Verduras" para filtrar.

---

### 2.3 Carrito

El carrito muestra todos los productos seleccionados antes de confirmar el pedido.

```
┌─────────────────────────────────┐
│  ←  Carrito  (5 productos)  🗑  │
├─────────────────────────────────┤
│  Tomate redondo                 │
│  kg · $850 c/u                  │
│  [-][3][+]              $2.550  │
│  [Notas para este ítem...]      │
├─────────────────────────────────┤
│  Zanahoria                      │
│  atado · $220 c/u               │
│  [-][2][+]              $440    │
│  [Notas para este ítem...]      │
├─────────────────────────────────┤
│  Total estimado       $12.340   │
│  ┌─────────────────────────┐    │
│  │     Confirmar pedido    │    │
│  └─────────────────────────┘    │
└─────────────────────────────────┘
```

**Acciones disponibles:**
- **− / +** → ajustar cantidad. Si llegás a 0 el producto se elimina
- **🗑 (ícono)** al lado de cada producto → eliminar ese ítem
- **Notas** → campo de texto para aclaraciones por ítem (ej: "sin hojas amarillas")
- **🗑 (arriba a la derecha)** → vaciar todo el carrito
- **Confirmar pedido** → continuar al paso de confirmación

> **Nota:** El carrito se guarda en tu celular. Si cerrás la app sin confirmar, los productos siguen guardados.

---

### 2.4 Confirmar pedido

Pantalla final antes de enviar el pedido a la verdulería.

```
┌─────────────────────────────────┐
│  ← Confirmar pedido             │
├─────────────────────────────────┤
│  RESUMEN — 5 productos          │
│  ─────────────────────────────  │
│  Tomate redondo                 │
│  3 kg · $850 c/u      $2.550   │
│                                 │
│  Zanahoria                      │
│  2 atado · $220 c/u     $440   │
│  ...                            │
├─────────────────────────────────┤
│  Notas del pedido (opcional)    │
│  ┌─────────────────────────┐    │
│  │ Ej: entregar antes de   │    │
│  │ las 10am...             │    │
│  └─────────────────────────┘    │
├─────────────────────────────────┤
│  Total estimado       $12.340   │
│  ┌─────────────────────────┐    │
│  │      Enviar pedido      │    │
│  └─────────────────────────┘    │
└─────────────────────────────────┘
```

1. Revisá el resumen de productos y precios
2. Agregá **notas generales** si necesitás (horario de entrega, instrucciones especiales)
3. Tocá **Enviar pedido**
4. Aparece la pantalla de confirmación con el número de pedido

```
┌─────────────────────────────────┐
│         ✅ ¡Pedido enviado!     │
│         Pedido #47              │
│   Te avisamos cuando sea        │
│        confirmado.              │
│                                 │
│  [ 🏠 Ir al inicio ]            │
│  [ 📋 Ver mis pedidos ]         │
└─────────────────────────────────┘
```

> **Importante:** Los precios se fijan en el momento de enviar el pedido. Cambios de precios posteriores no afectan a este pedido.

---

### 2.5 Mis pedidos

Historial completo de todos tus pedidos con estado y fecha.

```
┌─────────────────────────────────┐
│  ← Mis pedidos                  │
├─────────────────────────────────┤
│  ┌─────────────────────────┐    │
│  │ Pedido #47  [Enviado]   │    │  ← Amarillo
│  │ 30 de mayo · 5 prod.    │    │
│  │ $12.340                 │ →  │
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │ Pedido #42 [Entregado]  │    │  ← Verde
│  │ 15 de mayo · 8 prod.    │    │
│  │ $28.500                 │ →  │
│  └─────────────────────────┘    │
└─────────────────────────────────┘
```

**Estados del pedido:**

| Estado | Color | Significado |
|--------|-------|-------------|
| Enviado | 🟡 Amarillo | Tu pedido fue recibido, esperando confirmación |
| Confirmado | 🔵 Azul | La verdulería confirmó los productos |
| Con faltantes | 🟠 Naranja | Hay productos sin stock (ver detalle) |
| En preparación | 🟣 Violeta | Tu pedido se está armando |
| Entregado | 🟢 Verde | Pedido entregado correctamente |
| Cancelado | ⚫ Gris | Pedido cancelado |

Tocá cualquier pedido para ver el detalle completo.

---

### 2.6 Detalle del pedido y PDF

Al tocar un pedido del historial, ves el detalle completo.

```
┌─────────────────────────────────┐
│  ← Pedido #42     [Entregado]   │
│     15 de mayo de 2025          │
├─────────────────────────────────┤
│  PRODUCTOS — 8 ítems            │
│  ─────────────────────────────  │
│  Tomate redondo                 │
│  5 kg · $820 c/u      $4.100   │
│                                 │
│  Papa bolsa                     │
│  2 bolsa · $8.200 c/u $16.400  │
│  sin faltante                   │
├─────────────────────────────────┤
│  Total estimado       $28.500   │
├─────────────────────────────────┤
│  Notas: entregar lunes AM       │
├─────────────────────────────────┤
│  [⬇ Descargar comprobante]      │
└─────────────────────────────────┘
```

**Cómo descargar el comprobante PDF:**
1. Tocá el botón **"Descargar comprobante"**
2. El PDF se genera automáticamente y se descarga a tu dispositivo
3. El comprobante incluye: número de pedido, fecha, listado de productos, precios y total

> El PDF sirve como comprobante de compra y puede imprimirse o compartirse por WhatsApp.

---

### 2.7 Repetir pedido anterior

Desde la pantalla de **Inicio**, si ya tenés pedidos anteriores, aparece la opción de repetirlo.

```
┌─────────────────────────────────┐
│  Tu último pedido:              │
│  Pedido #42 · 15 de mayo        │
│  $28.500 · 8 productos          │
│  ┌─────────────────────────┐    │
│  │  ↺ Repetir este pedido  │    │
│  └─────────────────────────┘    │
└─────────────────────────────────┘
```

**Cómo funciona:**
1. Tocá **"Repetir este pedido"**
2. El sistema copia todos los productos del pedido anterior
3. Los precios se actualizan a los precios vigentes (si tu cuenta tiene precios especiales, se aplican)
4. Te lleva al **carrito** con todos los ítems cargados
5. Podés agregar, quitar o modificar productos antes de confirmar

> **Importante:** "Repetir pedido" no garantiza los mismos precios — usa los precios del día en que hacés el nuevo pedido.

---

## 3. Vista del Administrador

El panel de administración es solo accesible con un usuario con perfil **admin**.

### 3.1 Dashboard

Pantalla principal del admin con métricas del día.

```
┌─────────────────────────────────┐
│  viernes, 30 de mayo            │
│  Panel Admin                    │
├─────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐    │
│  │ ⚠️  3    │  │ 🚚  2    │    │
│  │Por confir│  │En proceso│    │
│  └──────────┘  └──────────┘    │
│  ┌──────────┐  ┌──────────┐    │
│  │ ✅  1    │  │$142.500  │    │
│  │Entregados│  │Total día │    │
│  └──────────┘  └──────────┘    │
├─────────────────────────────────┤
│  ACCESOS RÁPIDOS                │
│  ┌─────────────────────────┐    │
│  │ 📋 Pedidos del día  [3] │    │
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │ 📃 Picking list         │    │
│  └─────────────────────────┘    │
├─────────────────────────────────┤
│  🏠  📋  📃  📦  👥  Salir      │  ← Nav inferior
└─────────────────────────────────┘
```

**Métricas mostradas:**
- **Por confirmar:** pedidos en estado "Enviado" que necesitan atención
- **En proceso:** pedidos Confirmados + En preparación
- **Entregados hoy:** pedidos completados el día de hoy
- **Total del día:** suma estimada de todos los pedidos activos del día

**Navegación inferior:**
| Ícono | Sección |
|-------|---------|
| 🏠 Inicio | Dashboard con métricas |
| 📋 Pedidos | Lista de pedidos del día |
| 📃 Picking | Lista consolidada para armar |
| 📦 Productos | ABM de productos |
| 👥 Clientes | ABM de clientes |
| Salir | Cerrar sesión |

---

### 3.2 Pedidos del día

Lista completa de todos los pedidos, con filtros por estado.

```
┌─────────────────────────────────┐
│  Pedidos                        │
│  [Todos][Enviados][Confirmados] │
│  [Preparando][Faltantes][Entregados]│
├─────────────────────────────────┤
│  #47 · Juan Rodríguez           │
│  [Enviado]                      │
│  30 may 22:30 · 5 prod · $12.340│  →
│                                 │
│  #46 · María Pérez              │
│  [En preparación]               │
│  30 may 10:15 · 8 prod · $28.500│  →
│                                 │
│  #45 · Resto Chino SRL          │
│  [Con faltantes]                │
│  30 may 09:00 · 6 prod · $19.200│  →
└─────────────────────────────────┘
```

**Cómo filtrar:**
- Tocá cualquier filtro en la barra superior para ver solo esos pedidos
- **Todos** muestra todos los pedidos (excepto borradores)
- El filtro **Enviados** te muestra los que están esperando confirmación

---

### 3.3 Confirmar un pedido

Al tocar un pedido de la lista, entrás al detalle donde podés gestionarlo.

```
┌─────────────────────────────────┐
│  ← Pedido #47       [Enviado]   │
│     30 de mayo de 2025          │
├─────────────────────────────────┤
│  Juan Rodríguez                 │
│  📞 11 4567-8901                │
│  Zona: Norte · Lunes            │
│  "entregar antes de las 10am"   │
├─────────────────────────────────┤
│  Total estimado       $12.340   │
├─────────────────────────────────┤
│  PRODUCTOS                      │
│  ─────────────────────────────  │
│  Tomate redondo                 │
│  kg · solicitado: 3             │
│  Confirmado: [3]  [Faltante]    │
│                                 │
│  Papa bolsa                     │
│  bolsa · solicitado: 2          │
│  Confirmado: [2]  [Faltante]    │
├─────────────────────────────────┤
│  Notas internas (solo admin)    │
│  [                          ]   │
├─────────────────────────────────┤
│  [✅ Confirmar pedido]          │
│  [Cancelar pedido]              │
└─────────────────────────────────┘
```

**Flujo de confirmación paso a paso:**

**Paso 1: Revisar los productos**
- Ver qué pidió el cliente y en qué cantidades

**Paso 2: Marcar faltantes (si hay)**
- Si un producto no tiene stock, tocá **"Marcar faltante"**
- El botón se pone naranja y dice **"Sin stock"**
- La cantidad confirmada se ignora para ese ítem

**Paso 3: Ajustar cantidades si es necesario**
- Si confirmás menos cantidad de la solicitada, cambiá el número en el campo **"Confirmado"**

**Paso 4: Agregar notas internas (opcional)**
- Las notas internas son solo visibles para el admin, no para el cliente

**Paso 5: Confirmar**
- Tocá **"Confirmar pedido"**
- Si hay faltantes → estado pasa a **Con faltantes**
- Si no hay faltantes → estado pasa a **Confirmado**

**Cambios de estado posteriores:**
```
[Enviado] → [Confirmar pedido] → [Confirmado / Con faltantes]
                                         ↓
                              [Iniciar preparación]
                                         ↓
                              [EN PREPARACIÓN]
                                         ↓
                              [Marcar entregado]
                                         ↓
                              [ENTREGADO] ✅
```

---

### 3.4 Picking List

La picking list es la lista consolidada de todos los productos de los pedidos activos (Confirmados + En preparación). Es la herramienta principal para armar los pedidos.

```
┌─────────────────────────────────┐
│  Picking List                   │
│  viernes, 30 de mayo            │
│  [4 productos] [3 pedidos]      │
├─────────────────────────────────┤
│  [Por producto] [Por cliente]   │  ← Tabs
├─────────────────────────────────┤
│  TAB: POR PRODUCTO              │
│  ─────────────────────────────  │
│  Papa — bolsa              10   │
│    Juan R. #47   →  4 bolsas    │
│    María P. #46  →  3 bolsas    │
│    Resto Chino #45 → 3 bolsas   │
│                                 │
│  Tomate redondo — kg       15   │
│    Juan R. #47   →  5 kg        │
│    María P. #46  →  10 kg       │
├─────────────────────────────────┤
│  [⬇ Descargar picking list PDF] │
└─────────────────────────────────┘
```

**Tab "Por producto":**
- Muestra cada producto con la cantidad total necesaria
- Debajo de cada producto, indica cuánto corresponde a cada cliente
- Ideal para ir al depósito y armar todo de una sola vez

**Tab "Por cliente":**
- Muestra cada cliente con la lista completa de lo que pidió
- Ideal para armar las cajas o bolsas individuales por cliente

```
┌─────────────────────────────────┐
│  TAB: POR CLIENTE               │
│  ─────────────────────────────  │
│  Juan Rodríguez      Pedido #47 │
│    Tomate redondo  →  5 kg      │
│    Papa            →  4 bolsas  │
│    Zanahoria       →  2 atados  │
│                                 │
│  María Pérez         Pedido #46 │
│    Tomate redondo  →  10 kg     │
│    Papa            →  3 bolsas  │
└─────────────────────────────────┘
```

**Cómo descargar el PDF:**
1. Tocá **"Descargar picking list PDF"**
2. Se genera un PDF de 2 páginas: primera por producto, segunda por cliente
3. El PDF puede imprimirse para usarlo durante el armado

> **Importante:** La picking list solo incluye pedidos en estado **Confirmado**, **Con faltantes** o **En preparación**. Los pedidos Enviados (sin confirmar) NO aparecen.

---

### 3.5 Gestión de productos

Desde el ícono 📦 del nav, podés administrar el catálogo de productos.

```
┌─────────────────────────────────┐
│  Productos          [Importar ⬆]│
├─────────────────────────────────┤
│  [+ Nuevo producto]             │
├─────────────────────────────────┤
│  Tomate redondo [Verduras]      │
│  [✓ Activo]  [✏ Editar]    [∨] │
│  ▼ expandido:                   │
│    kg      · $850  [✏] [Activa]│
│    cajón   · $13.500[✏] [Activa]│
│    [+ Agregar unidad]           │
├─────────────────────────────────┤
│  Papa          [Verduras]       │
│  [✓ Activo]  [✏ Editar]    [∨] │
└─────────────────────────────────┘
```

#### Crear un producto nuevo

1. Tocá **"+ Nuevo producto"**
2. Completá:
   - **Nombre** (obligatorio): ej. "Morrón rojo"
   - **Categoría**: ej. "Verduras" o "Frutas"
3. Agregá las unidades con sus precios:
   - Elegí el tipo de unidad (kg, cajón, bolsa, atado, unidad)
   - Ingresá el precio base
   - Tocá **"+ Agregar unidad"** para agregar más unidades
4. Tocá **"Crear producto"**

#### Editar un producto existente

1. Tocá el ícono **✏ (lápiz)** al lado del producto
2. Modificá nombre y/o categoría
3. Tocá **"Guardar"**

#### Editar precio de una unidad

1. Tocá la flecha **∨** para expandir el producto
2. Tocá el **✏** al lado de la unidad que querés cambiar
3. Modificá el precio
4. Tocá el ✓ para guardar

#### Activar / desactivar productos

- Tocá el botón **"Activo"** para deshabilitar un producto (ya no aparece en el catálogo)
- Tocá **"Inactivo"** para volver a habilitarlo

> Los productos inactivos no aparecen en el catálogo del cliente, pero mantienen su historial de pedidos.

#### Importar productos desde Excel

Para cargar muchos productos de una sola vez:

1. Tocá el botón **"Importar Excel"** (arriba a la derecha)
2. Descargá la **plantilla de ejemplo** para ver el formato correcto
3. Completá tu archivo Excel con las columnas:

| nombre | categoria | unidad | precio_base |
|--------|-----------|--------|-------------|
| Tomate redondo | Verduras | kg | 850 |
| Tomate redondo | Verduras | cajon | 13500 |
| Papa | Verduras | bolsa | 8500 |

> Unidades válidas: **kg, cajon, bolsa, atado, unidad** (sin tilde, en minúscula)

4. Subí el archivo (.xlsx o .csv)
5. Revisá la **vista previa** con los datos parseados
6. Si está todo bien, tocá **"Importar X productos"**

> **Lógica de importación:** Si el producto ya existe, actualiza el precio. Si no existe, lo crea. Nunca duplica.

---

### 3.6 Gestión de clientes

Desde el ícono 👥 del nav, podés administrar los clientes del sistema.

```
┌─────────────────────────────────┐
│  Clientes              [+ Nuevo]│
├─────────────────────────────────┤
│  Juan Rodríguez                 │
│  11 4567-8901 · Norte · Lunes   │
│  [✓ Activo]                  →  │
│                                 │
│  María Pérez                    │
│  11 9876-5432 · Sur · Miércoles │
│  [✓ Activo]                  →  │
└─────────────────────────────────┘
```

#### Crear un cliente nuevo

1. Tocá **"+ Nuevo"** (arriba a la derecha)
2. Completá los datos:
   - **Nombre** (obligatorio)
   - **Email** (obligatorio) — se usa para iniciar sesión
   - **Contraseña** (obligatorio) — mínimo 6 caracteres
   - **Teléfono** (opcional)
   - **Dirección** (opcional)
   - **Zona de entrega** (opcional) — ej: Norte, Sur, Centro
   - **Día de entrega** (opcional) — ej: Lunes, Miércoles
3. Tocá **"Crear cliente"**

> El cliente recibirá sus datos de acceso por parte del admin (el sistema no envía emails automáticamente).

#### Editar datos de un cliente

1. Tocá el cliente en la lista
2. Modificá los campos que necesitás
3. Tocá **"Guardar datos"**

#### Configurar precios especiales

Podés asignar precios diferentes a un cliente específico (ej: precio mayorista especial):

```
┌─────────────────────────────────┐
│  Precios especiales             │
│  2 precios personalizados       │
│  ┌─────────────────────────┐    │
│  │ 🔍 Buscar producto...   │    │
│  └─────────────────────────┘    │
│  ─────────────────────────────  │
│  Producto        Base  Especial │
│  Tomate kg       $850  [700  ]  │  ← Precio especial en verde
│  Papa bolsa      $8500 [     ]  │  ← Sin precio especial
│  Zanahoria kg    $320  [280  ]  │  ← Precio especial en verde
│                                 │
│  [Guardar precios especiales]   │
└─────────────────────────────────┘
```

1. Entrá al detalle del cliente
2. En la sección **"Precios especiales"**, buscá el producto
3. Escribí el precio especial en el campo de la derecha
4. Si dejás el campo vacío, se usa el precio base
5. Tocá **"Guardar precios especiales"**

> Los precios especiales se aplican automáticamente cuando ese cliente ve el catálogo y hace un pedido.

#### Activar / desactivar clientes

- Tocá el botón **"Activo"** en la lista para deshabilitar un cliente
- Un cliente inactivo no puede iniciar sesión ni hacer pedidos

---

## 4. Preguntas frecuentes

**¿Qué pasa si el precio cambia después de enviar el pedido?**
Los precios se congelan en el momento del envío. Un cambio de precio posterior no afecta al pedido ya enviado.

**¿Puedo editar un pedido después de enviarlo?**
No. Una vez enviado, el pedido no puede ser modificado por el cliente. Contactá al administrador.

**¿El "total estimado" es el precio final?**
Es una estimación. El precio puede variar si el admin confirma cantidades diferentes (por faltantes u otros ajustes).

**¿Cómo sé si mi pedido fue confirmado?**
En "Mis pedidos" vas a ver el estado cambiado a "Confirmado" o "Con faltantes". El admin también puede comunicarlo por WhatsApp.

**¿Qué significa "Con faltantes"?**
Que uno o más productos de tu pedido no tienen stock disponible. Revisá el detalle del pedido para ver cuáles.

**¿La picking list incluye todos los pedidos?**
Solo los pedidos en estado **Confirmado**, **Con faltantes** o **En preparación**. Los pedidos Enviados (aún sin confirmar) no aparecen en el picking.

**¿Puedo acceder desde el celular?**
Sí, el sistema está diseñado primero para celular (mobile-first). Funciona en cualquier navegador moderno (Chrome, Safari, Firefox).

---

*Manual de uso — Reparto La Verdu | Sistema de Pedidos*
*Versión 1.0 — Mayo 2026*
