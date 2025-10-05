import express from "express";
import {
  getMessages,
  sendMessage,
  markMessagesAsRead,
  getUnreadCounts,
  getRecentMessages,
} from "../controllers/message.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);
router.put("/read/:id", protectRoute, markMessagesAsRead);
router.get("/unread/counts", protectRoute, getUnreadCounts);
router.get("/recent/all", protectRoute, getRecentMessages);

export default router;
