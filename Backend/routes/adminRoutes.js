const express = require('express');
const router = express.Router();
const { getUsers, getBlogs, deleteBlog, deleteUser } = require('../controllers/adminController');

//  Route to fetch all users
router.get('/users', getUsers);

//  Route to fetch all blogs (with author info)
router.get('/blogs', getBlogs);

//  Route to delete a blog
router.delete('/blog/:id', deleteBlog);

//  Route to delete user and their blogs
router.delete('/user/:id', deleteUser);

module.exports = router;
