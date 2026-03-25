import type { TicketPrefix } from '../types/tickets'

export const formatTicketId = (
	prefix: TicketPrefix,
	number: number,
): string => {
	return `${prefix}-${String(number).padStart(3, '0')}`
}
