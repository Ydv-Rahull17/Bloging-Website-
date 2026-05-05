const db = require("../config/db");
const nodemailer = require("nodemailer");

// Nodemailer transporter setup (placeholder credentials)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ydvrahul1711@gmail.com', 
        pass: 'irgw iftf hnzm hpfd'   
    }
});

// Send contact message and save to DB
exports.sendContactMail = async (req, res) => {
    let { firstName:name, email, subject, message } = req.body;

    subject = `contact from ${name}`

    console.log(name , email, subject , message)

    try {

        await db.query(`
            INSERT INTO contact_messages (name, email, subject, message, is_read, created_at)
            VALUES ($1, $2, $3, $4, false, NOW())
        `, [name, email, subject, message]);

    
        const mailOptions = {
            from: 'ydvrahul1711@gmail.com',
            to: '',
            subject: `New Contact Form Submission: ${subject}`,
            text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
        };
        await transporter.sendMail(mailOptions);
        

        res.status(200).json({ success: true, message: "Your message has been sent successfully!" });
    } catch (error) {
        console.error("Error sending contact mail:", error);
        res.status(500).json({ success: false, error: "Something went wrong" });
    }
};

// Fetch all contact messages
exports.getAllContactMessages = async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM contact_messages ORDER BY created_at DESC");
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching contact messages:", error);
        res.status(500).json({ success: false, error: "Something went wrong" });
    }
};

// Mark message as read
exports.markMessageRead = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query("UPDATE contact_messages SET is_read = true WHERE id = $1", [id]);
        res.status(200).json({ success: true, message: "Message marked as read" });
    } catch (error) {
        console.error("Error marking message as read:", error);
        res.status(500).json({ success: false, error: "Something went wrong" });
    }
};

// Reply to contact message
exports.replyToContactMessage = async (req, res) => {
    const { id } = req.params;
    const { replyMessage } = req.body;
    try {
        const result = await db.query("SELECT email FROM contact_messages WHERE id = $1", [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Message not found" });
        }

        const userEmail = result.rows[0].email;

        
        const mailOptions = {
            from: 'ydvrahul1711@gmail.com',
            to: userEmail,
            subject: "Reply to your contact message",
            text: replyMessage
        };
        await transporter.sendMail(mailOptions);
       

        res.status(200).json({ success: true, message: "Reply sent successfully!" });
    } catch (error) {
        console.error("Error replying to contact message:", error);
        res.status(500).json({ success: false, error: "Something went wrong" });
    }
};

// Delete a contact message
exports.deleteContactMessage = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query("DELETE FROM contact_messages WHERE id = $1", [id]);
        res.status(200).json({ success: true, message: "Message deleted successfully" });
    } catch (error) {
        console.error("Error deleting contact message:", error);
        res.status(500).json({ success: false, error: "Something went wrong" });
    }
};
