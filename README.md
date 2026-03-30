# 🎫 Tickets App - Queue Management System

Una solución profesional y ligera para la gestión de colas de tickets en tiempo real, desarrollada con el ecosistema moderno de **Bun** y **TypeScript**.

Este sistema permite administrar flujos de atención al cliente de manera eficiente, diferenciando entre tickets **normales** y **preferenciales**, y permitiendo la asignación dinámica a múltiples escritorios de atención.

## ✨ Funcionalidades Clave

- **🕒 Tiempo Real:** Comunicación bidireccional instantánea mediante WebSockets.
- **🏷️ Gestión de Tickets:** Creación de tickets con prefijos (`A` para normal, `P` para preferencial).
- **🖥️ Escritorios de Atención:** Asignación de tickets a escritorios específicos.
- **⚡ Priorización Inteligente:** Soporte nativo para atención preferencial.
- **📊 Estado Global:** Sincronización automática de la cola, últimos tickets llamados y estado de escritorios para todos los clientes conectados.
- **🛡️ Validación Robusta:** Validación de mensajes mediante esquemas de **Zod**.

## 🛠️ Stack Tecnológico

- **Runtime:** [Bun](https://bun.sh/) (All-in-one toolkit)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
- **Infraestructura:** WebSockets nativos de Bun (`Bun.serve`)
- **Validación:** [Zod](https://zod.dev/)
- **Calidad de Código:** [Biome](https://biomejs.dev/)

---

## 🚀 Inicio Rápido

### Requisitos Previos

- Tener instalado [Bun](https://bun.sh/docs/installation) (v1.0.0 o superior).

### Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/tickets-app.git
   cd tickets-app
   ```

2. Instala las dependencias:
   ```bash
   bun install
   ```

3. (Opcional) Configura las variables de entorno:
   Copia el archivo `.env.template` a `.env` y ajusta el puerto si es necesario.
   ```bash
   cp .env.template .env
   ```

### Ejecución en Desarrollo

Para iniciar el servidor con **hot-reload**:

```bash
bun run dev
```

El servidor estará disponible por defecto en `http://localhost:3000`.

---

## 📖 Cómo Funciona (Guía de Uso)

El sistema opera mediante un protocolo de mensajes JSON a través de WebSockets.

### 1. Conexión
Al conectarse, el cliente es suscrito automáticamente al canal global y recibe el estado actual de la cola (`QUEUE_STATE`).

### 2. Generación de Tickets
El cliente puede enviar un mensaje de tipo `CREATE_TICKET` especificando si es preferencial. El sistema genera un ID único (ej: `A-1`, `P-5`) y lo añade a la cola correspondiente.

### 3. Llamada de Tickets (Escritorios)
Un escritorio solicita el siguiente ticket con `REQUEST_NEXT_TICKET`. El sistema prioriza automáticamente los tickets preferenciales a menos que se fuerce un ticket normal.

### 4. Monitoreo
Todos los clientes conectados (pantallas de visualización, otros escritorios) reciben actualizaciones automáticas cada vez que la cola cambia.

---

## 🏗️ Estructura del Proyecto

```text
src/
├── handlers/    # Procesamiento de mensajes WebSocket
├── services/    # Lógica de negocio (Queue Management)
├── store/       # Estado en memoria (Persistence layer)
├── schemas/     # Validaciones de esquemas (Zod)
├── types/       # Definiciones de TypeScript
└── server.ts    # Configuración de Bun.serve
```

---

## 🚢 Despliegue

Gracias a Bun, el despliegue es extremadamente sencillo ya que no requiere pasos de compilación complejos.

### Opción 1: Docker (Recomendado)

Crea un `Dockerfile` básico para Bun:

```dockerfile
FROM oven/bun:latest
WORKDIR /app
COPY . .
RUN bun install
EXPOSE 3000
CMD ["bun", "src/index.ts"]
```

### Opción 2: Ejecución Directa en Producción

En tu servidor:

```bash
bun run start
```

Se recomienda utilizar un gestor de procesos como **PM2** o un servicio de **Systemd** para asegurar que el proceso se reinicie automáticamente.

---

## 🧼 Calidad de Código

Este proyecto utiliza **Biome** para el linting y formateo.

- **Verificar errores:** `bun x @biomejs/biome check .`
- **Formatear código:** `bun x @biomejs/biome format --write .`

---

## 📄 Licencia

Este proyecto es de código abierto. Siéntete libre de usarlo y mejorarlo.
