const { Post, User } = require('../models');

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: { model: User, as: 'author', attributes: ['id', 'name', 'email'] },
    });
    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: { model: User, as: 'author', attributes: ['id', 'name', 'email'] },
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }
    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.createPost = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: 'Content is required.' });
    }

    const post = await Post.create({
      content,
      authorId: req.user.id, // Diambil dari token JWT hasil middleware
    });

    return res.status(201).json({ message: 'Post created successfully.', post });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { content } = req.body;
    const post = await Post.findByPk(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    // Validasi kepemilikan post (authorId harus cocok dengan User ID dari token JWT)
    if (post.authorId !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden. You are not the author of this post.' });
    }

    post.content = content || post.content;
    await post.save();

    return res.status(200).json({ message: 'Post updated successfully.', post });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    // Validasi kepemilikan post
    if (post.authorId !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden. You are not the author of this post.' });
    }

    await post.destroy();
    return res.status(200).json({ message: 'Post deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};