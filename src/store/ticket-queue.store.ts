import type { QueueMessageState } from '../types/queue-message-state'
import type { Ticket } from '../types/tickets'

interface QueueStoreState {
	lastTicketNumbers: {
		A: number
		P: number
	}

	pending: {
		normal: Ticket[]
		preferential: Ticket[]
	}
	activeByDesk: Record<number, Ticket | undefined>
	recentlyServed: Ticket[]
}

export class MyStore {
	private state: QueueStoreState = {
		lastTicketNumbers: { A: 0, P: 0 },
		pending: {
			normal: [],
			preferential: [],
		},
		activeByDesk: {},
		recentlyServed: [],
	}

	getAll(): QueueMessageState {
		return {
			lastTicketNumbers: {
				A: this.state.lastTicketNumbers.A,
				P: this.state.lastTicketNumbers.P,
			},
			pendingTotal: {
				normal: this.state.pending.normal.length,
				preferential: this.state.pending.preferential.length,
				combined:
					this.state.pending.normal.length +
					this.state.pending.preferential.length,
			},
			activeByDesk: this.state.activeByDesk,
			recentlyServed: this.state.recentlyServed,
		}
	}
}
