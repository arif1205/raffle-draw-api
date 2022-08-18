const Ticket = require("./Ticket");
const { readFile, writeFile } = require("./util");

const tickets = Symbol("tickets");

class TicketCollection {
	constructor() {
		(async () => {
			this[tickets] = await readFile();
		})();
	}

	/**
	 * create a new ticket and save
	 * @param {string} username
	 * @param {number} price
	 * @return {Ticket}
	 */
	create(username, price) {
		const ticket = new Ticket(username, price);
		this[tickets].push(ticket);
		writeFile(this[tickets]);
		return ticket;
	}

	/**
	 * Bulk insert new tickets
	 * @param {string} username
	 * @param {number} price
	 * @param {number} quantity
	 * @return {Ticket[]}
	 */
	createBulk(username, price, quantity) {
		const result = [];
		for (let i = 0; i < quantity; i++) {
			const ticket = this.create(username, price);
			result.push(ticket);
		}
		return result;
	}

	/**
	 * Return all ticket from Db
	 * @returns {Ticket[]}
	 */
	find() {
		return this[tickets];
	}

	/**
	 * Find a ticket by id
	 * @param {string} id
	 * @returns {Ticket}
	 */
	findTicketById(id) {
		const ticket = this[tickets].find((ticket) => ticket.id === id);
		return ticket;
	}

	/**
	 * Find all ticket belongs to a user
	 * @param {string} username
	 * @return {Ticket[]}
	 */
	findTicketsByUsername(username) {
		const usertickets = this[tickets].filter(
			(ticket) => ticket.username === username
		);
		return usertickets;
	}

	/**
	 * Update ticket by id
	 * @param {string} id
	 * @param {{username: string, price: number}} ticketBody
	 * @return {Ticket}
	 */
	updateById(id, ticketBody) {
		const ticket = this.findTicketById(id);
		if (!ticket) {
			throw new Error("Ticket not found");
		}
		ticket.username = ticketBody.username || ticket.username;
		ticket.price = ticketBody.price || ticket.price;
		ticket.updatedAt = new Date();
		writeFile(this[tickets]);
		return ticket;
	}

	/**
	 * Bulk update according to specific username
	 * @param {string} username
	 * @param {{username: string, price: number}} ticketBody
	 * @return {Ticket[]}
	 */
	updateBulk(username, ticketBody) {
		const userTicket = this.findTicketsByUsername(username);
		const updatedTickets = userTicket.map((ticket) =>
			this.updateById(ticket.id, ticketBody)
		);
		writeFile(this[tickets]);
		return updatedTickets;
	}

	/**
	 * Delete a specific ticket by id
	 * @param {string} id
	 * @return {Ticket}
	 */
	deleteById(id) {
		const index = this[tickets].findIndex((ticket) => ticket.id === id);
		if (index === -1) {
			const ticket = false;
		}
		const ticket = this[tickets].splice(index, 1)[0];
		writeFile(this[tickets]);
		return ticket;
	}

	/**
	 * Delete all tickets according to user name
	 * @param {string} username
	 * @return {Ticket[]}
	 */
	deleteAllByUsername(username) {
		const userTicket = this.findTicketsByusername(username);
		const deletedTickets = userTicket.map((ticket) =>
			this.deleteById(ticket.id)
		);
		return deletedTickets;
	}

	/**
	 * Find winners
	 * @param {number} winnerCount
	 * @return {Ticket[]}
	 */
	draw(winnerCount) {
		const winnerIndexes = new Array(winnerCount);

		let winnerIndex = 0;

		while (winnerIndex < winnerCount) {
			const ticketIndex = Math.floor(Math.random() * this[tickets].length);
			if (!winnerIndexes.includes(ticketIndex)) {
				winnerIndexes[winnerIndex] = ticketIndex;
				winnerIndex++;
			}
		}

		const winners = winnerIndexes.map(
			/**
			 *@param {number} index
			 */
			(index) => this[tickets][index]
		);

		return winners;
	}
}

const ticketsCollection = new TicketCollection();

module.exports = ticketsCollection;
