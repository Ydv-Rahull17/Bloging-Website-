const nodemailer = require("nodemailer");
const pool = require("../config/db");

const createTransporter = () =>
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "ydvrahul1711@gmail.com",
      pass: "pceu yjvs squq bkrh",
    },
  });

const sendContactMail = async (req, res) => {
  console.log("Received contact form data:", req.body);

  const { firstName, lastName, email, country, message } = req.body;

  try {
    await pool.query(
      `INSERT INTO contact_messages 
      (first_name, last_name, email, country, message)
      VALUES ($1, $2, $3, $4, $5)`,
      [firstName, lastName, email, country, message]
    );

    const transporter = createTransporter();

    const mailOptions = {
      from: "ydvrahul1711@gmail.com",
      to: email,
      subject: "Contact Form Confirmation",
      text: `Hello ${firstName} ${lastName},

We received your message successfully.

Country: ${country}

Your Message:
${message}

Thank you for contacting us.`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "Message saved and email sent successfully",
    });
  } catch (error) {
    console.error("Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to process request",
    });
  }
};

const getAllContactMessages = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, first_name, last_name, email, country, message, is_readed, is_replyed, created_at
       FROM contact_messages
       ORDER BY created_at DESC`
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    res.status(500).json({ success: false, message: "Failed to fetch messages" });
  }
};

const markMessageRead = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `UPDATE contact_messages SET is_readed = TRUE WHERE id = $1 RETURNING id`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }

    res.status(200).json({ success: true, message: "Message marked as read" });
  } catch (error) {
    console.error("Error marking message read:", error);
    res.status(500).json({ success: false, message: "Failed to update message" });
  }
};

const replyToContactMessage = async (req, res) => {
  const { id } = req.params;
  const { replyMessage } = req.body;

  if (!replyMessage || replyMessage.trim().length === 0) {
    return res.status(400).json({ success: false, message: "Reply message cannot be empty" });
  }

  try {
    const queryResult = await pool.query(
      `SELECT first_name, last_name, email FROM contact_messages WHERE id = $1`,
      [id]
    );

    if (queryResult.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }

    const contact = queryResult.rows[0];
    const transporter = createTransporter();

    const mailOptions = {
      from: "ydvrahul1711@gmail.com",
      to: contact.email,
      subject: `Reply to your message, ${contact.first_name}`,
      text: `Hello ${contact.first_name} ${contact.last_name},

Thank you for reaching out to us. Here is our reply to your message:

${replyMessage}

If you have further questions, please feel free to reply to this email.

Best regards,
MSP Blog Team`,
    };

    await transporter.sendMail(mailOptions);

    await pool.query(
      `UPDATE contact_messages SET is_replyed = TRUE, is_readed = TRUE WHERE id = $1`,
      [id]
    );

    res.status(200).json({ success: true, message: "Reply sent successfully" });
  } catch (error) {
    console.error("Error replying to contact message:", error);
    res.status(500).json({ success: false, message: "Failed to send reply" });
  }
};

const deleteContactMessage = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM contact_messages WHERE id = $1 RETURNING id`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }

    res.status(200).json({ success: true, message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting contact message:", error);
    res.status(500).json({ success: false, message: "Failed to delete message" });
  }
};

module.exports = {
  sendContactMail,
  getAllContactMessages,
  markMessageRead,
  replyToContactMessage,
  deleteContactMessage,
};