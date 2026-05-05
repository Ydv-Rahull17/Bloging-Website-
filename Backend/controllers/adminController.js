const db = require("../config/db");

// Get all users
exports.getUsers = async (req, res) => {
    try {
        const result = await db.query("SELECT id, username, email, profile_image FROM users ORDER BY id ASC");
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ success: false, error: "Something went wrong" });
    }
};

// Get all blogs with author info
exports.getBlogs = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT blogs.*, users.username AS author_name 
            FROM blogs 
            JOIN users ON blogs.user_id = users.id 
            ORDER BY blogs.created_at DESC
        `);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching blogs for admin:", error);
        res.status(500).json({ success: false, error: "Something went wrong" });
    }
};

// Delete a blog
exports.deleteBlog = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query("DELETE FROM blogs WHERE id = $1", [id]);
        res.status(200).json({ success: true, message: "Blog deleted successfully" });
    } catch (error) {
        console.error("Error deleting blog:", error);
        res.status(500).json({ success: false, error: "Something went wrong" });
    }
};

// Delete a user and their blogs
exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        // First delete all blogs by the user (if not handled by ON DELETE CASCADE)
        await db.query("DELETE FROM blogs WHERE user_id = $1", [id]);
        // Then delete the user
        const result = await db.query("DELETE FROM users WHERE id = $1 RETURNING *", [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        
        res.status(200).json({ success: true, message: "User and their blogs deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ success: false, error: "Something went wrong" });
    }
};
