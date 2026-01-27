import mongoose from "mongoose";

const unitSchema = new mongoose.Schema(
    {
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true,
            index: true
        },

        displayName: {
            type: String,
            required: true,
            trim: true // e.g., "Living Room AC", "Backup Generator"
        },

        type: {
            type: String,
            required: true,
            enum: ["AC", "Heater", "Machine", "Generator"]
        },

        lastServiceDate: {
            type: Date
        },

        nextServiceDate: {
            type: Date,
            required: true,
            index: true
        },

        serviceIntervalDays: {
            type: Number,
            min: 1
        }
    },
    { timestamps: true }
);


unitSchema.index({ nextServiceDate: 1 });

export const Unit = mongoose.model("Unit", unitSchema);
