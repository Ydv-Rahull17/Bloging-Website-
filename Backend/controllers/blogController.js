// controllers/blogController.js
const db = require("../config/db");

// Create a new blog
exports.createBlog = async (req, res) => {
  try {
    const { title, content, user_id, category } = req.body;
    const image = req.file ? req.file.filename : null;

    console.log('Received blog data:', { title, content, user_id, category, image });

    const result = await db.query(
      "INSERT INTO blogs (title, content, image, user_id, category, created_at) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *",
      [title, content, image, user_id, category]
    );

    console.log('Blog created:', result.rows[0]);
    res.status(201).json({ success: true, blog: result.rows[0] });
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
};

// Fetch all blogs
exports.getBlogs = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM blogs ORDER BY created_at DESC");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
};

// Fetch blogs by user ID
exports.getBlogsByUser = async (req, res) => {
  const { user_id } = req.params;
  try {
    const result = await db.query("SELECT * FROM blogs WHERE user_id = $1 ORDER BY created_at DESC", [user_id]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching user's blogs:", error);
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
};

// Fetch a blog by ID
exports.getBlogById = async (req, res) => {
  const { id } = req.params;
  console.log('Fetching blog with ID:', id);
  try {
    const result = await db.query('SELECT blogs.* ,users.username AS author_name , users.profile_image FROM blogs join users on blogs.user_id = users.id WHERE blogs.id = $1', [id]);
    console.log('Blog fetched:', result.rows[0]);
    if (result.rows.length > 0) {
      const blog = result.rows[0];
      blog.profile_image = `http://localhost:5000/uploads/${blog.profile_image}`;
      blog.blog_image = `http://localhost:5000/uploads/${blog.image}`;
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
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ success: false, error: "Something went wrong" });
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



exports.getPopularBlog = async (req,res)=>{
  try{
    const query = `select blogs.*, users.username , users.profile_image from blogs inner join users on blogs.user_id= users.id
where blogs.id in (7,8,9,10)`
const result = await db.query(query);
res.status(200).json(result.rows);

  }catch(err){
    console.error(err);
    res.status(500).json({ message: "Something went wrong", error: err.message });  
  }
}