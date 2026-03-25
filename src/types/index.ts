import type { QueueMessageState } from './queue-message-state'
import type { Ticket } from './tickets'

//! Este es el objeto que envía el servidor
export type ServerMessage =
	| { type: 'ERROR'; payload: { error: string } }
	| {
			type: 'QUEUE_STATE'
			payload: {
				state: QueueMessageState
			}
	  }
	| { type: 'TICKET_CREATED'; payload: { ticket: Ticket } }
	| {
			type: 'NEXT_TICKET_ASSIGNED'
			payload: { ticket?: Ticket }
	  }
	| {
			type: 'QUEUE_EMPTY'
	  }

//! Este es el objeto que recibe el servidor
export type ClientMessage =
	| { type: 'GET_STATE' }
	| { type: 'CREATE_TICKET'; payload: { isPreferential: boolean } }
	| {
			type: 'REQUEST_NEXT_TICKET'
			payload: { deskNumber: number; forceNormalTicket: boolean }
	  }
	| { type: 'RESET_QUEUE' }

//! Este es el objeto que se almacena por cada cliente
export interface WebSocketData {
	clientId: string
}
