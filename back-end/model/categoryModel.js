import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        slug: {
            type: String,
            unique: true,
            required: true,
            trim: true
        },

        image: {
            type: String,
            default: ""
        },

        parentCategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            default: null
        }
    },
    { timestamps: true }
);

export const Category = mongoose.model("Category", categorySchema);