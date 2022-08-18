const express = require("express");
const morgan = require("morgan");
require("dotenv").config();
const cors = require("cors");

const app = express();
/**
 * Middleware
 */
app.use([morgan("dev"), cors(), express.json()]);

app.use("/api/v1/tickets", require("./routes"));

app.get("/health", (_req, res) => {
	res.status(200).json({ message: "Success" });
});

app.use((_req, _res, next) => {
	const error = new Error("Resource not found!");
	error.status = 404;
	next(error);
});

app.use((error, _req, res, _next) => {
	if (error.status) {
		return res.status(error.status).json({
			message: error.message,
		});
	}

	res.status(500).json({
		message: "Something went wrong!",
	});
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
	console.log("Server started on port " + port);
});
