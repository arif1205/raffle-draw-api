const ticketsCollection = require("./tickets");

// ticket selling controllers

exports.sellSingleTicket = (req, res) => {
	const { username, price } = req.body;
	const ticket = ticketsCollection.create(username, price);
	res.status(201).json({ message: "Ticket created successfully", ticket });
};

exports.sellBulkTicket = (req, res) => {
	const { username, price, quantity } = req.body;
	const tickets = ticketsCollection.createBulk(username, price, quantity);
	res.status(201).json({ message: "Tickets created successfully", tickets });
};

// Find tickets controller

exports.findAll = (req, res) => {
	const tickets = ticketsCollection.find();
	res.status(200).json({ items: tickets, total: tickets.length });
};

exports.findById = (req, res) => {
	const id = req.params.id;
	const ticket = ticketsCollection.findTicketById(id);
	if (!ticket) {
		res.status(404).json({ message: "404 not found!" });
	}
	res.status(200).json(ticket);
};

exports.findByUsername = (req, res) => {
	const username = req.params.username;
	const tickets = ticketsCollection.findTicketsByUsername(username);
	if (!tickets.length) {
		res.status(404).json({ message: "404 not found!" });
	}
	res.status(200).json({ items: tickets, total: tickets.length });
};

// update controllers

exports.updateByUsername = (req, res) => {
	const username = req.params.username;
	const tickets = ticketsCollection.updateBulk(username, req.body);
	res.status(200).json({ items: tickets, total: tickets.length });
};

exports.updateById = (req, res) => {
	const id = req.params.id;
	const ticket = ticketsCollection.updateById(id, req.body);

	if (!ticket) {
		res.status(404).json({ message: "404 not found!" });
	}
	res.status(200).json(ticket);
};

// Delete Controllers

exports.deleteById = (req, res) => {
	const id = req.params.id;
	const ticket = ticketsCollection.deleteById(id);
	if (!ticket) {
		res.status(404).json({ message: "Can't delete ticket" });
	}
	res.status(204).json({ ticket, message: "Delete successful" });
};

exports.deleteByUsername = (req, res) => {
	const username = req.params.username;
	const ticket = ticketsCollection.deleteAllByUsername(username);
	res.status(204).json({ ticket, message: "Delete successful" });
};

// Draw controller
exports.drawWinner = (req, res) => {
	const wc = req.query.wc;
	const winners = ticketsCollection.draw(wc);
	res.status(200).json(winners);
};
