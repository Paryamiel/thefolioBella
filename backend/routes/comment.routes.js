const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Post = require('../models/Post'); // We import this just to check if the post exists

const { protect } = require('../middleware/auth.middleware');
const { memberOrAdmin, adminOnly } = require('../middleware/role.middleware');

// @route   GET /api/comments/:postId
// @desc    Get all comments for a specific post
// @access  Public
router.get('/:postId', async (req, res) => {
    try {
        const comments = await Comment.find({ post: req.params.postId })
            .populate('author', 'name profilePic')
            .sort({ createdAt: -1 }); // Newest comments first
            
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching comments' });
    }
});

// @route   POST /api/comments/:postId
// @desc    Add a comment to a post
// @access  Private (Members and Admins only)
router.post('/:postId', protect, memberOrAdmin, async (req, res) => {
    try {
        const { body } = req.body;

        // Verify the post actually exists before commenting
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const comment = await Comment.create({
            post: req.params.postId,
            author: req.user._id, // Provided by the 'protect' middleware
            body
        });

        // We populate the author data immediately before sending it back to React
        await comment.populate('author', 'name profilePic');

        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ message: 'Server error creating comment' });
    }
});

// @route   DELETE /api/comments/:id
// @desc    Delete a comment
// @access  Private (Only the author or an Admin can delete)
router.delete('/:id', protect, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // RUBRIC REQUIREMENT: Is this the author? OR is the user an admin?
        if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'User not authorized to delete this comment' });
        }

        await comment.deleteOne();
        res.json({ message: 'Comment removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error deleting comment' });
    }
});

/// @route   GET /api/comments
// @desc    Get ALL comments across the entire site (For Admin Dashboard)
// @access  Private (Admin Only)
router.get('/', protect, adminOnly, async (req, res) => {
    try {
        const comments = await Comment.find({})
            .populate('author', 'name email')
            .sort({ createdAt: -1 });
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching all comments' });
    }
});

module.exports = router;