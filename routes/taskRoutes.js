const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const auth = require("../middleware/authMiddleware");

router.get("/", auth, taskController.getAll);
router.get("/:id", auth, taskController.getById);
router.post("/", auth, taskController.create);
router.put("/:id", auth, taskController.update);
router.delete("/:id", auth, taskController.remove);

module.exports = router;