# tickets-app

Este proyecto es un sistema de gestión de colas de tickets (Ticket Queue Management System) desarrollado con **Bun**, **TypeScript** y **WebSockets**. Permite la creación de tickets (normales y preferenciales), la asignación de tickets a escritorios específicos y la actualización en tiempo real de todos los clientes conectados.

## 🚀 Tecnologías Principales

- **Runtime:** [Bun](https://bun.sh/) (Fast all-in-one JavaScript runtime)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
- **Validación:** [Zod](https://zod.dev/) para esquemas de mensajes WebSocket.
- **Linter/Formatter:** [Biome](https://biomejs.dev/)
- **Comunicación:** WebSockets (vía `Bun.serve`)

## 📂 Estructura del Proyecto

- `src/index.ts`: Punto de entrada de la aplicación.
- `src/server.ts`: Configuración del servidor HTTP y WebSocket utilizando `Bun.serve`.
- `src/config/`: Configuraciones globales (puerto, nombres de canales).
- `src/handlers/`: Controladores de mensajes WebSocket (`message.handler.ts`).
- `src/services/`: Capa de lógica de negocio (`ticket-queue.service.ts`).
- `src/store/`: Gestión del estado en memoria (`ticket-queue.store.ts`).
- `src/schemas/`: Esquemas de Zod para validación de mensajes.
- `src/types/`: Definiciones de tipos de TypeScript.
- `src/utils/`: Funciones de utilidad (generación de UUID, formateo de IDs).
- `public/`: Archivos estáticos (como `index.html`).

## 🛠️ Comandos de Desarrollo

| Comando | Descripción |
|---------|-------------|
| `bun install` | Instala las dependencias del proyecto. |
| `bun run dev` | Inicia el servidor en modo desarrollo con hot-reload. |
| `bun run start` | Inicia el servidor en modo producción. |
| `bun x @biomejs/biome check .` | Ejecuta el linter y verifica el formato. |
| `bun x @biomejs/biome format --write .` | Formatea el código automáticamente según las reglas de Biome. |

## 📏 Convenciones de Desarrollo

- **Formateo de Código:** Se utiliza Biome con indentación por **tabs**, comillas simples y sin puntos y coma (siempre que sea posible).
- **Arquitectura:** Se sigue un patrón de capas para separar la persistencia (Store), la lógica (Service) y la comunicación (Handlers/Server).
- **Mensajería:** Todos los mensajes entrantes por WebSocket deben estar validados mediante esquemas de Zod definidos en `src/schemas/websocket-message.schema.ts`.
- **Estado:** El estado de la cola de tickets es **efímero** (en memoria). Al reiniciar el servidor, la cola se vacía.
- **Tipado:** Se prioriza el uso de `type` e `interface` para mantener la seguridad de tipos en toda la aplicación.

## 🔌 Protocolo WebSocket

El servidor espera mensajes en formato JSON con un campo `type` que actúe como discriminador. Los tipos admitidos son:

- `GET_STATE`: Solicita el estado actual de la cola.
- `CREATE_TICKET`: Crea un nuevo ticket (requiere `payload.isPreferential`).
- `REQUEST_NEXT_TICKET`: Asigna el siguiente ticket disponible a un escritorio (requiere `payload.deskNumber` y `payload.forceNormalTicket`).
- `RESET_QUEUE`: Reinicia todos los contadores y limpia la cola.
