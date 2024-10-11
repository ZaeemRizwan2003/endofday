import mongoose from "mongoose";

const deliveryPartnersModel = new mongoose.Schema({
    name: {type:String, required:true},
    contact:{type:Number,required:true},
    password: {type:String, required:true},
    area:{type:String, required:true},
    orderId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required:true,
    }
}, { timestamps: true });

export const deliveryPartnersSchema = mongoose.models.deliverypartners || mongoose.model("deliverypartners", deliveryPartnersModel, "deliverypartners");

