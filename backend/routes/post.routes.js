const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// Import our custom middleware
const { protect } = require('../middleware/auth.middleware');
const { memberOrAdmin } = require('../middleware/role.middleware');
const upload = require('../middleware/upload');

// @route   GET /api/posts
// @desc    Get all published posts
// @access  Public (Anyone can read the blog)
router.get('/', async (req, res) => {
    try {
        // .populate() grabs the author's actual name and profile picture using their ID
        const posts = await Post.find({ status: 'published' })
            .populate('author', 'name profilePic')
            .sort({ createdAt: -1 }); // Sorts by newest first
            
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching posts' });
    }
});

// @route   POST /api/posts
// @desc    Create a new post
// @access  Private (Members and Admins only)
// Notice how we inject protect, memberOrAdmin, and upload.single() before the actual route logic!
router.post('/', protect, memberOrAdmin, upload.single('image'), async (req, res) => {
    try {
        const { title, body } = req.body;
        
        // If an image was uploaded, save its path, otherwise leave it empty
        let imagePath = '';
        if (req.file) {
            imagePath = `/uploads/${req.file.filename}`;
        }

        const post = await Post.create({
            title,
            body,
            image: imagePath,
            author: req.user._id // We get this from the 'protect' middleware!
        });

        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Server error creating post' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'name profilePic'); // Get the author's details too!

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.json(post);
    } catch (error) {
        console.error(error);
        // If the ID is completely malformed, MongoDB throws a specific kind of error
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(500).json({ message: 'Server error fetching single post' });
    }
});

// @route   PUT /api/posts/:id
// @desc    Update a post
// @access  Private (Only the author can edit)
router.put('/:id', protect, async (req, res) => {
    try {
        let post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Security Check: Make sure the person editing is actually the author!
        if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'User not authorized to edit this post' });
        }

        // Update the post with the new data from React
        post = await Post.findByIdAndUpdate(
            req.params.id,
            { $set: { title: req.body.title, body: req.body.body } },
            { new: true } // This tells MongoDB to return the newly updated post
        );

        res.json(post);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error updating post' });
    }
});

// @route   DELETE /api/posts/:id
// @desc    Delete a post
// @access  Private (Only the author or an Admin can delete)
router.delete('/:id', protect, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Security Check: Is the person deleting this the author? Or are they an admin?
        if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'User not authorized to delete this post' });
        }

        await post.deleteOne();
        res.json({ message: 'Post removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error deleting post' });
    }
});

module.exports = router;