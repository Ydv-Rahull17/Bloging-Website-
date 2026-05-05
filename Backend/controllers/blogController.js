// controllers/blogController.js
const db = require("../config/db");

// Create a new blog
exports.createBlog = async (req, res) => {
    try {
        const { title, content, user_id, category } = req.body;
        const image = req.file ? req.file.filename : null;

        console.log('Received blog data:', { title, content, user_id, category, image });

        const result = await db.query(
            "INSERT INTO blogs (title, content, image, user_id, category) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [title, content, image, user_id, category]
        );

        console.log('Blog created:', result.rows[0]);
        res.status(201).json({ success: true, blog: result.rows[0] });
    } catch (error) {
        console.error("Error creating blog:", error.message, error.stack);
        res.status(500).json({ success: false, error: error.message });
    }
};



// Fetch blogs by user ID
exports.getBlogsByUser = async (req, res) => {
    const { user_id } = req.params;
    try {
        const result = await db.query("SELECT * FROM blogs WHERE user_id = $1 ORDER BY created_at DESC", [user_id]);
        const blogs = result.rows.map(blog => ({
            ...blog,
            image_url: blog.image ? `http://localhost:5000/uploads/${blog.image}` : null
        }));
        res.status(200).json(blogs);
    } catch (error) {
        console.error("Error fetching user's blogs:", error);
        res.status(500).json({ success: false, error: "Something went wrong" });
    }
};

// Fetch a blog by ID
exports.getBlogById = async (req, res) => {
    const { id } = req.params;
    try {
        // const result = await db.query('SELECT * FROM blogs WHERE id = $1', [id]);
        const result = await db.query(`
            SELECT blogs.*, users.username AS author_name , 
            users.profile_image AS profile_image
            FROM blogs
            JOIN users ON blogs.user_id = users.id
            WHERE blogs.id = $1
        `, [id]);
        console.log('Fetched blog:', result.rows[0]);
        if (result.rows.length > 0) {
            const blog = result.rows[0];
            blog.image_url = `http://localhost:5000/uploads/${blog.image}`;
            blog.profile_image_url = blog.profile_image ? `http://localhost:5000/uploads/${blog.profile_image}` : null;
            res.json(blog);
        } else {
            res.status(404).json({ message: 'Blog not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching blog' });
    }
};


// Fetch all blogs with author name
exports.getBlogs = async (req, res) => {
    try {
        const result = await db.query(`
      SELECT blogs.*, users.username AS author_name
      FROM blogs
      JOIN users ON blogs.user_id = users.id
        ORDER BY blogs.created_at DESC
    `);
        const blogs = result.rows.map(blog => ({
            ...blog,
            image_url: blog.image ? `http://localhost:5000/uploads/${blog.image}` : null
        }));
        res.status(200).json(blogs);
    } catch (error) {
        console.error("Error fetching blogs:", error.message, error.stack);
        res.status(500).json({ success: false, error: error.message });
    }
};


// Delete a blog by ID
exports.deleteBlogById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query("DELETE FROM blogs WHERE id = $1 RETURNING *", [id]);
        if (result.rows.length > 0) {
            res.status(200).json({ success: true, message: "Blog deleted successfully" });
        } else {
            res.status(404).json({ success: false, message: "Blog not found" });
        }
    } catch (error) {
        console.error("Error deleting blog:", error);
        res.status(500).json({ success: false, error: "Something went wrong" });
    }
};

/// Update a blog by ID
exports.updateBlogById = async (req, res) => {
    const { id } = req.params;
    const { title, content, category } = req.body;
    const image = req.file ? req.file.filename : null;

    try {
        let query, values;

        if (image) {
            query = "UPDATE blogs SET title = $1, content = $2, category = $3, image = $4 WHERE id = $5 RETURNING *";
            values = [title, content, category, image, id];
        } else {
            query = "UPDATE blogs SET title = $1, content = $2, category = $3 WHERE id = $4 RETURNING *";
            values = [title, content, category, id];
        }

        const result = await db.query(query, values);

        if (result.rows.length > 0) {
            res.status(200).json({ success: true, blog: result.rows[0] });
        } else {
            res.status(404).json({ success: false, message: "Blog not found" });
        }
    } catch (error) {
        console.error("Error updating blog:", error);
        res.status(500).json({ success: false, error: "Something went wrong" });
    }
};

// Fetch popular blogs
exports.getPopularBlog = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT blogs.*, users.username AS author_name
            FROM blogs
            JOIN users ON blogs.user_id = users.id
            ORDER BY blogs.created_at DESC
            LIMIT 5
        `);
        console.log('Fetched popular blogs:', result.rows);
        const blogs = result.rows.map(blog => ({
            ...blog,
            image_url: blog.image ? `http://localhost:5000/uploads/${blog.image}` : null
        }));
        res.status(200).json(blogs);
    } catch (error) {
        console.error("Error fetching popular blogs:", error);
        res.status(500).json({ success: false, error: "Something went wrong" });
    }
};