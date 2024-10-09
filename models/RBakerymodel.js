import mongoose from "mongoose";
const signupSchema = new mongoose.Schema({
    restrauntName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String, required: true },
    number: { type: String, required: true },
    type: { type: [String], enum: ['pickup', 'delivery'], required: true }, // 'pickup' or 'delivery'
}, { timestamps: true });
const RegisteredBakeries = mongoose.models.RegisteredBakeries || mongoose.model('RegisteredBakeries', signupSchema);

export default RegisteredBakeries;