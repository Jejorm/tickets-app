import { SERVER_CONFIG } from './config/server-config'

import indexHtml from '../public/index.html'
import { generateUuid } from './utils/generate-uuid'
import type { WebSocketData } from './types'
import {
	createQueueStateMessage,
	handleMessage,
} from './handlers/message.handler'

export const createServer = () => {
	const server = Bun.serve<WebSocketData>({
		port: SERVER_CONFIG.port,

		routes: {
			'/': indexHtml,
		},

		fetch(req, server) {
			//* Identificar nuestros clientes
			const clientId = generateUuid()
			const upgraded = server.upgrade(req, {
				data: { clientId },
			})

			if (upgraded) {
				return undefined
			}

			return new Response('Upgrade failed', { status: 500 })
		},
		websocket: {
			open(ws) {
				//! Suscribir el cliente a un canal por defecto
				ws.subscribe(SERVER_CONFIG.defaultChannelName)

				const initialStateMessage = createQueueStateMessage()
				ws.send(JSON.stringify(initialStateMessage))
			},
			message(ws, message: string) {
				const response = handleMessage(message)

				for (const personalMessage of response.personal) {
					ws.send(JSON.stringify(personalMessage))
				}

				for (const broadcastMessage of response.broadcast) {
					ws.publish(
						SERVER_CONFIG.defaultChannelName,
						JSON.stringify(broadcastMessage),
					)
				}
			},
			close(ws, code, message) {
				//! Una vez que el cliente se desconecta, "de-suscribir" del canal por defecto
				// console.log(`Cliente desconectado: ${ws.data.clientId}`);
				ws.unsubscribe(SERVER_CONFIG.defaultChannelName)
			}, // a socket is closed
		}, // handlers
	})

	return server
}
