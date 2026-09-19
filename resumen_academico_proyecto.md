# INFORME TÉCNICO ACADÉMICO: SISTEMA WEB DE CONTROL DE INVENTARIO, GESTIÓN DE ALMACÉN Y TRAZABILIDAD COMERCIAL

**Empresa Caso de Estudio:** Representaciones Martín S.A.C.  
**Rubro:** Comercialización y distribución de tableros de melamina, planchas de drywall, pisos flotantes y materiales de construcción y acabados.  
**Arquitectura:** Modelo - Vista - Controlador (MVC)  
**Tecnologías:** React 18, Vite, Tailwind CSS, Node.js / Express, Microsoft SQL Server (SSMS).

---

## 1. Introducción y Planteamiento del Problema

### 1.1. Contexto Empresarial
**Representaciones Martín** es una empresa dedicada a la comercialización mayorista y minorista de materiales para la carpintería moderna, la arquitectura de interiores y la construcción en seco (drywall). Su catálogo principal está compuesto por bienes voluminosos y de alto tonelaje: tableros de melamina de dimensiones estándar (2.15 m × 2.44 m con espesores de 15 mm, 18 mm y 25 mm), planchas de yeso/fibrocemento, perfiles de acero galvanizado, pisos laminados y accesorios de ferretería pesada.

### 1.2. Problemática Identificada
Antes de la implementación del sistema, la empresa presentaba debilidades operativas comunes al sector maderero y ferretero:
1. **Discrepancia entre Inventario Físico y Teórico:** Desconocimiento en tiempo real de las existencias exactas debido a desfases entre las notas de despacho en patio y los registros de venta.
2. **Elevado Índice de Mermas no Controladas:** Los tableros de melamina sufren frecuentemente desportilladuras en esquinas o rajaduras durante la estiba o maniobra de montacargas, sin que existiera un registro con justificación técnica obligatoria.
3. **Dificultad en la Localización Física de Mercadería:** Pérdida de tiempo del personal de patio para ubicar productos específicos dentro de los racks y bahías de almacenamiento.
4. **Ausencia de un Kardex Automatizado conforme a Normativa Tributaria:** Incumplimiento de reportes estructurados bajo el método del Costo Promedio Ponderado exigido por entidades tributarias (SUNAT).
5. **Riesgos de Seguridad y Control Interno:** Falta de segmentación de privilegios operativos entre el personal administrativo, gerencial y almacenero.

---

## 2. Objetivos del Sistema

### 2.1. Objetivo General
Desarrollar e implementar un sistema web integral bajo la arquitectura **Modelo-Vista-Controlador (MVC)** que automatice el control de inventario, optimice la ubicación física en almacén mediante racks 2D, estandarice la emisión del Kardex valorizado y garantice la trazabilidad inalterable de cada transacción comercial y operativa de Representaciones Martín.

### 2.2. Objetivos Específicos
- **OE1:** Implementar un esquema de **Seguridad y Control de Acceso Basado en Roles (RBAC)** que restrinja el acceso a módulos críticos según el perfil laboral (Administrador, Gerencia, Almacenero).
- **OE2:** Desarrollar un **Catálogo Maestro de Productos** especializado en el rubro maderero, registrando características físicas (espesor, dimensiones, peso unitario) y parámetros de reabastecimiento (stock mínimo y máximo).
- **OE3:** Establecer un **Sistema de Alertas Tempranas de Reabastecimiento** que identifique automáticamente productos bajo el stock de seguridad para emitir órdenes de compra oportunas.
- **OE4:** Diseñar una **Topografía Digital de Almacén en Racks 2D** que mapee la capacidad de carga estructural en kilogramos y la coordenada exacta de cada producto (Zona, Pasillo, Rack, Nivel).
- **OE5:** Implementar un flujo unificado de **Salidas por Venta / Despacho** y generación automática de la **Hoja de Kardex Físico-Valorizado** (método promedio ponderado).
- **OE6:** Desarrollar un módulo de **Ajustes y Mermas Justificadas** que exija justificación técnica detallada antes de alterar existencias, resguardando la auditoría contable.
- **OE7:** Integrar herramientas de **Analítica de Demanda (Clasificación ABC de Pareto)** y **Cierre Diario Operativo con Firma Digital** para certificar la conciliación entre almacén y gerencia al fin de cada jornada.

---

## 3. Alcance y Requerimientos Funcionales del Sistema (RF-01 al RF-22)

El sistema satisface de manera estricta los 22 requerimientos funcionales organizados en 8 módulos operativos:

| Código | Requerimiento Funcional | Descripción Operativa |
|---|---|---|
| **RF-01** | Registro de Usuarios y Credenciales | El Administrador registra personal con datos personales, asigna roles y el sistema genera contraseñas aleatorias iniciales. |
| **RF-02** | Recuperación de Cuenta con Token | Flujo de auto-recuperación mediante tokens temporales de seguridad con expiración de 30 minutos. |
| **RF-03** | Matriz de Roles Jerárquicos | Definición formal de los perfiles: *Administrador*, *Gerencia* y *Encargado de Almacén*. |
| **RF-04** | Control de Acceso RBAC | Restricción condicional y bloqueo visual de vistas y botones de acción según el rol del usuario autenticado. |
| **RF-05** | Alta de Catálogo Especializado | Registro de artículos con SKU, código de barras EAN-13, marca, dimensiones, espesor (mm), peso y precios. |
| **RF-06** | Modificación de Atributos Comerciales | Actualización de precios de venta, costos de compra, ubicaciones asignadas y parámetros de stock. |
| **RF-07** | Baja Lógica de Productos | Retiro de productos obsoletos sin destruir la integridad referencial del historial de movimientos ni del Kardex. |
| **RF-08** | Búsqueda y Filtrado Reactivo | Búsqueda multi-criterio en milisegundos por SKU, denominación, código de barras o categoría. |
| **RF-09** | Alertas de Stock Mínimo | Detección automática en interfaz de productos en estado crítico o agotados. |
| **RF-10** | Cálculo de Cantidades a Reordenar | Algoritmo que sugiere unidades exactas a comprar para reponer hasta el stock máximo permitido. |
| **RF-11** | Reportes Valorizados y Márgenes | Reporte económico que contrasta costo de adquisición vs. valor proyectado de venta y rentabilidad bruta. |
| **RF-12** | Ubicación y Capacidad de Carga en Racks | Mapeo topográfico en 2D que valida la carga en kilogramos para prevenir colapsos en estanterías pesadas. |
| **RF-13** | Órdenes de Compra y Proveedores | Emisión de O/C a fabricantes (Arauco, Pelíkano, Gyplac) con recepción y alta de stock automática en patio. |
| **RF-14** | Dashboard Ejecutivo en Tiempo Real | Panel principal con KPIs de valorización global, rotación del día, alertas y accesos rápidos. |
| **RF-15** | Clasificación Algorítmica ABC | Segmentación de Pareto (Clase A: 80% demanda, Clase B: 15%, Clase C: 5% baja rotación / capital estancado). |
| **RF-16** | Historial Inmutable de Movimientos | Registro cronológico auditado de entradas por compra, salidas por venta, mermas y ajustes de inventario. |
| **RF-17** | Kardex Valorizado SUNAT | Hoja oficial multicolumna (Entradas, Salidas, Saldos) calculada mediante Costo Promedio Ponderado. |
| **RF-18** | Consulta Rápida y Terminal Patio | Vista móvil/tablet para almaceneros con lectura de código de barras y despacho express en mostrador. |
| **RF-19** | Cierre Diario y Arqueo Operativo | Certificación nocturna del total de entradas y salidas de la jornada con generación de firma digital hash. |
| **RF-20** | Registro Justificado de Mermas | Acta de roturas por manipulación o estiba que exige motivo formal y detalle técnico antes de descontar unidades. |
| **RF-21** | Inactivación y Bajas de Colaboradores | Bloqueo administrativo del acceso al sistema de usuarios con registro de motivo de cese laboral. |
| **RF-22** | Bitácora de Auditoría Forense | Log de eventos inmutables que captura: fecha/hora exacta, usuario, rol, módulo y descripción de la acción. |

---

## 4. Arquitectura de Software y Patrón de Diseño (MVC)

El sistema está estructurado bajo el patrón **Modelo - Vista - Controlador (MVC)**, lo que garantiza alta cohesión, bajo acoplamiento, escalabilidad y facilidad de mantenimiento:

```
                  ┌─────────────────────────────────────┐
                  │          USUARIO / CLIENTE          │
                  └──────────────────┬──────────────────┘
                                     │ Interacción UI
                                     ▼
                  ┌─────────────────────────────────────┐
                  │             VISTAS (Views)          │
                  │   src/views/ & src/components/      │
                  │  - DashboardView    - CatalogoView   │
                  │  - MovimientosView  - KardexView     │
                  │  - QuickStockView   - VentaModal     │
                  └─────────┬──────────────────▲────────┘
             Envía acciones │                  │ Notifica cambios
                            ▼                  │ y renderiza estado
                  ┌────────────────────────────┴────────┐
                  │         CONTROLADORES (Controllers) │
                  │            src/controllers/         │
                  │   - InventoryController.js          │
                  │   - AuthController.js               │
                  │ (Lógica de negocio y orquestación)  │
                  └─────────┬──────────────────▲────────┘
             Ejecuta reglas │                  │ Retorna datos
             y persistencia │                  │ validados
                            ▼                  │
                  ┌────────────────────────────┴────────┐
                  │             MODELOS (Models)        │
                  │              src/models/            │
                  │  - ProductModel    - MovementModel   │
                  │  - UserModel       - OrderModel      │
                  │  - AdjustmentModel - StorageModel    │
                  └──────────────────┬──────────────────┘
                                     │ Persistencia
                                     ▼
                  ┌─────────────────────────────────────┐
                  │    CAPA DE DATOS / PERSISTENCIA     │
                  │ - LocalStorage (Caché Cliente)      │
                  │ - Microsoft SQL Server (Transact-SQL│
                  └─────────────────────────────────────┘
```

### 4.1. Capa de Modelos (`src/models/`)
Encapsula la definición de entidades, validaciones semánticas y lógica de dominio pura:
- **`ProductModel.js`**: Reglas de validación (precios positivos, stock máximo > mínimo) y cálculo de estados de criticidad (`AGOTADO`, `CRITICO`, `BAJO`, `NORMAL`).
- **`MovementModel.js`**: Valida si el stock disponible en almacén es suficiente antes de autorizar una salida; formatea la estructura de asientos contables del Kardex.
- **`UserModel.js`**: Define la matriz de permisos por rol (RBAC) y validación de correos corporativos.
- **`StorageModel.js`**: Abstracción del almacenamiento persistente con tolerancia a fallos y respaldo de datos iniciales.

### 4.2. Capa de Controladores (`src/controllers/`)
Orquesta las operaciones del sistema coordinando modelos y estados:
- **`InventoryController.js`**:
  - `registerSale()`: Gestiona la venta, descuenta el stock, asienta el comprobante y genera el log de auditoría.
  - `registerMovement()`: Procesa transacciones de compra o transferencias.
  - `registerAdjustment()`: Formaliza actas de merma o conteo físico.
  - `createProduct()`, `updateProduct()`, `deleteProduct()`: Control del ciclo de vida del catálogo.
- **`AuthController.js`**: Manejo de inicio de sesión, simulación rápida de perfiles para evaluación y generación de tokens de restablecimiento.

### 4.3. Capa de Vistas (`src/views/`)
Componentes visuales responsivos desarrollados con React y Tailwind CSS, diseñados bajo principios de **minimalismo industrial**:
- Contraste visual optimizado sobre fondos limpios (`#F8FAFC`).
- Uso estricto de la paleta corporativa: **Verde Martín (`#00843D`)** como tono de éxito, existencias y operaciones activas; y **Naranja Martín (`#E07A00`)** como tono de atención, stock crítico y alertas.
- Modal dedicado de ventas inmediatas ([`VentaModal.jsx`](file:///c:/Users/Kevin/Desktop/WEB%20INVENTARIO/src/views/components/VentaModal.jsx)) con cálculo en vivo de importes e IGV.

---

## 5. Diseño de Base de Datos Relacional (SQL Server)

El sistema cuenta con un esquema de base de datos normalizado en **Tercera Forma Normal (3FN)** implementado en Microsoft SQL Server (`RepresentacionesMartinDB`), que incluye:
- **Tablas Principales:** `ROLES`, `USUARIOS`, `CATEGORIAS`, `UBICACIONES_ALMACEN`, `PROVEEDORES`, `PRODUCTOS`, `MOVIMIENTOS_INVENTARIO`, `KARDEX`, `ORDENES_COMPRA`, `DETALLE_ORDEN_COMPRA`, `AJUSTES_INVENTARIO`, `CIERRES_DIARIOS`, `AUDITORIA_LOGS`.
- **Integridad Referencial:** Claves foráneas con eliminación restringida (`ON DELETE NO ACTION`) para evitar pérdidas accidentales de datos históricos.
- **Triggers (Disparadores):** Disparador automático `TR_AuditoriaProductos` que registra cualquier alteración de precios o especificaciones técnicas en la tabla de bitácora forense.

---

## 6. Resultados, Conclusiones y Beneficios Académicos

1. **Eficiencia en la Trazabilidad:** Se eliminó la pérdida de información entre el mostrador de ventas y el patio de despacho; cualquier salida descuenta las existencias físicas en menos de un segundo.
2. **Control Efectivo de Mermas (RF-20):** Al exigir justificación técnica obligatoria para cada tablero dañado, la empresa obtiene visibilidad de qué maniobras o transportistas generan mayor merma, reduciendo pérdidas no cuantificadas.
3. **Conformidad Contable y Legal:** La integración del Kardex automatizado bajo el método promedio ponderado permite emitir reportes de auditoría listos para fiscalización tributaria.
4. **Diseño Modular y Extensible:** Gracias a la adopción del patrón MVC, el sistema permite sustituir o ampliar fácilmente la capa de almacenamiento hacia microservicios en la nube o sincronización móvil sin afectar la lógica de negocio ni la interfaz de usuario.
