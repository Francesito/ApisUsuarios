import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    salt: {
        type: String,
        required: true,
    },
    tipo: {
        type: String,
        enum: ["usuario", "administrador"],
        default: "usuario",
        required: true
    }
}, {
    timestamps: true
});

export default mongoose.model("User", userSchema);