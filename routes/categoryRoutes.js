const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const auth = require("../middleware/authMiddleware");

router.get("/", auth, categoryController.getAll);
router.get("/:id", auth, categoryController.getById);
router.post("/", auth, categoryController.create);
router.put("/:id", auth, categoryController.update);
router.delete("/:id", auth, categoryController.remove);

module.exports = router;