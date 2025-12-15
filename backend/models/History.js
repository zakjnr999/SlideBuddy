import mongoose from 'mongoose';

const historySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    filename: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    questions: [{
        question: String,
        answer: String
    }],
    processedAt: {
        type: Date,
        default: Date.now
    }
});

// Index for faster queries
historySchema.index({ userId: 1, processedAt: -1 });

const History = mongoose.model('History', historySchema);

export default History;
