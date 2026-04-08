const express = require("express");
const router = express.Router();
const {
  sendContactMail,
  getAllContactMessages,
  markMessageRead,
  replyToContactMessage,
  deleteContactMessage,
} = require("../controllers/contactController");

// POST request to handle the contact form submission
router.post("/", sendContactMail);
router.get("/messages", getAllContactMessages);
router.patch("/messages/read/:id", markMessageRead);
router.post("/messages/reply/:id", replyToContactMessage);
router.delete("/messages/:id", deleteContactMessage);

module.exports = router;
