import mongoose from "mongoose";

const deliveryPartnersModel = new mongoose.Schema({
    name: {type:String, required:true},
    contact:{type:String,required:true},
    password: {type:String, required:true},
    area:{type:String, required:true},
    orderId:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: false,
    }]
}, { timestamps: true });

export const deliveryPartnersSchema = mongoose.models.Deliverypartner || mongoose.model("Deliverypartner", deliveryPartnersModel, "deliverypartners");

