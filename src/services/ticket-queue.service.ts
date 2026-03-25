import { TicketQueueStore } from '../store/ticket-queue.store'
import type { QueueMessageState } from '../types/queue-message-state'
import type { Ticket, TicketPrefix } from '../types/tickets'

class TicketQueueService {
	private readonly store: TicketQueueStore

	constructor() {
		this.store = new TicketQueueStore()
	}

	getState(): QueueMessageState {
		return this.store.getState()
	}

	createTicket(prefix: TicketPrefix): Ticket {
		return this.store.createTicket(prefix)
	}

	assignnextTicket(
		deskNumber: number,
		forceNormalTicket: boolean,
	): Ticket | undefined {
		return this.store.assignNextTicket(deskNumber, forceNormalTicket)
	}

	reset(): void {
		this.store.reset()
	}
}

export const ticketQueueService = new TicketQueueService()
