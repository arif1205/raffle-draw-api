const router = require("express").Router();
const {
	sellBulkTicket,
	sellSingleTicket,
	findAll,
	findById,
	findByUsername,
	updateById,
	updateByUsername,
	deleteById,
	deleteByUsername,
	drawWinner,
} = require("./controllers");

router.route("/t/:id").get(findById).put(updateById).delete(deleteById);

router
	.route("/u/:username")
	.get(findByUsername)
	.put(updateByUsername)
	.delete(deleteByUsername);

router.route("/").get(findAll).post(sellSingleTicket);

router.get("/draw", drawWinner);
router.post("/bulk", sellBulkTicket);

module.exports = router;
