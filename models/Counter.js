const mongoose = require('mongoose');

const CounterSchema = new mongoose.Schema({
    _id: { type: String, required: true }, // Counter name (e.g., 'agency', 'vehicle', etc.)
    seq: { type: Number, default: 0 }, // Current sequence value
});

const Counter = mongoose.model('Counter', CounterSchema);

// Helper function to generate a unique ID
const generateId = async (modelName) => {
    try {
        const counter = await Counter.findByIdAndUpdate(
            { _id: modelName }, // Use the model name (e.g., 'agency', 'vehicle', etc.)
            { $inc: { seq: 1 } }, // Increment the sequence number
            { new: true, upsert: true } // Create the counter if it doesn't exist
        );
        return counter.seq; // Return the generated ID
    } catch (error) {
        throw new Error(`Failed to generate ID for ${modelName}: ${error.message}`);
    }
};

// Middleware to attach the pre-save hook for generating unique IDs
const addPreSaveMiddleware = (schema, modelName, idFieldName) => {
    schema.pre('save', async function (next) {
        if (this.isNew) {
            try {
                const id = await generateId(modelName);
                this[idFieldName] = id; // Assign the generated ID to the specified field
            } catch (error) {
                return next(error);
            }
        }
        next();
    });
};

module.exports = { Counter, generateId, addPreSaveMiddleware };
