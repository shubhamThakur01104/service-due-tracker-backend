import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
    {
        houseNumber: {
            type: String,
            trim: true
        },

        street: {
            type: String,
            trim: true
        },

        area: {
            type: String,
            trim: true
        },

        city: {
            type: String,
            trim: true
        },

        state: {
            type: String,
            trim: true
        },

        pincode: {
            type: String,
            trim: true
        },

        country: {
            type: String,
            trim: true
        }
    },
    {
        _id: false // important: no separate id for address
    }
);

const customerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        phone: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            trim: true,
            lowercase: true
        },

        address: addressSchema
    },
    {
        timestamps: true
    }
);
customerSchema.index({ createdAt: -1 });

export const Customer = mongoose.model("Customer", customerSchema);
