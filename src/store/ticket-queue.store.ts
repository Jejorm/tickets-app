import type { QueueMessageState } from '../types/queue-message-state'
import type { Ticket, TicketPrefix } from '../types/tickets'
import { formatTicketId } from '../utils/format-ticket-id'

const DEFAULT_RECENTLY_SERVED_LIMIT = 8

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

export class TicketQueueStore {
	private state: QueueStoreState = {
		lastTicketNumbers: { A: 0, P: 0 },
		pending: {
			normal: [],
			preferential: [],
		},
		activeByDesk: {},
		recentlyServed: [],
	}

	getState(): QueueMessageState {
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

	createTicket(prefix: TicketPrefix): Ticket {
		const validPrefixes = ['A', 'P']

		if (!validPrefixes.includes(prefix))
			throw new Error(
				`Invalid prefix, ${prefix}. Valid prefixes are ${validPrefixes.join(', ')}`,
			)

		let currentNumber = this.state.lastTicketNumbers[prefix] ?? 0

		if (currentNumber >= 999) {
			currentNumber = 0
		}

		const nextNumber = currentNumber + 1

		this.state.lastTicketNumbers[prefix] = nextNumber

		const ticket: Ticket = {
			id: formatTicketId(prefix, nextNumber),
			prefix,
			number: nextNumber,
			deskNumber: undefined,
			createdAt: Date.now(),
			servedAt: undefined,
		}

		if (prefix === 'P') {
			this.state.pending.preferential.push(ticket)
		} else {
			this.state.pending.normal.push(ticket)
		}

		return ticket
	}

	assignNextTicket(deskNumber: number, forceNormalTicket: boolean) {
		const queuePriority = forceNormalTicket
			? [this.state.pending.normal, this.state.pending.preferential]
			: [this.state.pending.preferential, this.state.pending.normal]

		const ticket = queuePriority.find((queue) => queue.length > 0)?.shift()

		if (!ticket) {
			return undefined
		}

		ticket.deskNumber = deskNumber
		ticket.servedAt = Date.now()

		this.state.activeByDesk[deskNumber] = ticket

		this.pushRecentlyServed(ticket)

		return ticket
	}

	private pushRecentlyServed(ticket: Ticket) {
		this.state.recentlyServed.unshift(ticket)

		if (this.state.recentlyServed.length > DEFAULT_RECENTLY_SERVED_LIMIT) {
			this.state.recentlyServed = this.state.recentlyServed.slice(
				0,
				DEFAULT_RECENTLY_SERVED_LIMIT,
			)
		}
	}

	reset() {
		this.state = {
			lastTicketNumbers: { A: 0, P: 0 },
			pending: {
				normal: [],
				preferential: [],
			},
			activeByDesk: {},
			recentlyServed: [],
		}
	}
}
