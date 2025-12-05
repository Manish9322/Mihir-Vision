
import mongoose from 'mongoose';

const sliceSchema = new mongoose.Schema({
    id: { type: String, required: true },
    startTime: { type: Number, required: true },
    endTime: { type: Number, required: true },
    activePlayers: { type: [String], default: [] },
}, { _id: false });

const eventSchema = new mongoose.Schema({
    id: { type: String, required: true },
    timestamp: { type: Number, required: true },
    type: { type: String, required: true },
    details: { type: String },
    playersInvolved: { type: [String], default: [] },
}, { _id: false });

const analysisSessionSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true }, // e.g., "Period 1", "First Half"
    slices: { type: [sliceSchema], default: [] },
    events: { type: [eventSchema], default: [] },
}, { _id: false });

const matchSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    sport: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sport',
        required: true,
    },
    matchDate: {
        type: Date,
        required: true,
    },
    videoUrl: {
        type: String,
    },
    players: {
        type: [String], // Player IDs or numbers
        default: [],
    },
    sessions: {
        type: [analysisSessionSchema],
        default: [
            { id: 'session_1', name: 'Session 1', slices: [], events: [] }
        ],
    },
}, { timestamps: true });

const Match = mongoose.models.Match ?? mongoose.model('Match', matchSchema);

export default Match;
