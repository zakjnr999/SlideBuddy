import express from 'express';
import History from '../models/History.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// @route   GET /api/history
// @desc    Get user's history
// @access  Private
router.get('/', async (req, res) => {
    try {
        const history = await History.find({ userId: req.user._id })
            .sort({ processedAt: -1 })
            .limit(100); // Limit to last 100 items

        res.json({
            history
        });
    } catch (error) {
        console.error('Get history error:', error);
        res.status(500).json({
            error: 'Error fetching history'
        });
    }
});

// @route   POST /api/history
// @desc    Save new history item
// @access  Private
router.post('/', async (req, res) => {
    try {
        const { filename, summary, questions } = req.body;

        if (!filename || !summary) {
            return res.status(400).json({
                error: 'Please provide filename and summary'
            });
        }

        const historyItem = await History.create({
            userId: req.user._id,
            filename,
            summary,
            questions: questions || []
        });

        res.status(201).json({
            historyItem
        });
    } catch (error) {
        console.error('Save history error:', error);
        res.status(500).json({
            error: 'Error saving history'
        });
    }
});

// @route   DELETE /api/history/:id
// @desc    Delete history item
// @access  Private
router.delete('/:id', async (req, res) => {
    try {
        const historyItem = await History.findById(req.params.id);

        if (!historyItem) {
            return res.status(404).json({
                error: 'History item not found'
            });
        }

        // Make sure user owns this history item
        if (historyItem.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                error: 'Not authorized to delete this item'
            });
        }

        await historyItem.deleteOne();

        res.json({
            message: 'History item deleted'
        });
    } catch (error) {
        console.error('Delete history error:', error);
        res.status(500).json({
            error: 'Error deleting history'
        });
    }
});

// @route   DELETE /api/history
// @desc    Clear all history
// @access  Private
router.delete('/', async (req, res) => {
    try {
        await History.deleteMany({ userId: req.user._id });

        res.json({
            message: 'All history cleared'
        });
    } catch (error) {
        console.error('Clear history error:', error);
        res.status(500).json({
            error: 'Error clearing history'
        });
    }
});

export default router;
