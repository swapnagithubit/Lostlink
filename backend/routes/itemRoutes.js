const express = require("express");
const router = express.Router();

const itemController = require("../controllers/itemController");
const auth = require("../middleware/authMiddleware"); // 🔐 import auth

// 🔓 Public routes
router.get("/", itemController.getItems);
router.get("/community/:community", itemController.getByCommunity);

// 🔒 Protected routes
router.post("/", auth, itemController.addItem);
router.put("/:id", auth, itemController.updateStatus);
router.delete("/:id", auth, itemController.deleteItem);

module.exports = router;