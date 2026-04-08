const db = require('../config/db');

//  Get all users
const getUsers = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM users');
    const users = result.rows.map(user => {
      if (user.profile_image) {
        user.profile_image = `/uploads/${user.profile_image}`;
      }
      return user;
    });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Server Error');
  }
};

//  Get all blogs with author username
const getBlogs = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT blogs.*, users.username AS author
      FROM blogs    
      JOIN users ON blogs.user_id = users.id
      ORDER BY blogs.id DESC
    `);

    const blogs = result.rows.map(blog => {
      if (blog.image_url) {
        blog.image_url = `/uploads/${blog.image_url}`;
      }
      return blog;
    });

    res.json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).send('Server Error');
  }
};

//  Delete a blog
const deleteBlog = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM blogs WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ msg: 'Blog not found' });
    }
    res.json({ msg: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).send('Server Error');
  }
};

//  Delete a user and their blogs
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query('DELETE FROM blogs WHERE user_id = $1', [id]);

    const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User and associated blogs deleted successfully' });
  } catch (error) {
    console.error('Error deleting user and blogs:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getUsers, getBlogs, deleteBlog, deleteUser };
