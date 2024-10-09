import mongoose from 'mongoose';

const AddressSchema = new mongoose.Schema({
    addressLine: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    // country: { type: String, required: true },
    // lat: { type: Number }, // For Google Maps latitude
    // lng: { type: Number }, // For Google Maps longitude
  });

const CartItemSchema = new mongoose.Schema({
    itemId: String,
    title: String,
    price: Number,
    quantity: Number,
  });

const UserSchema= new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'please provide name'],
    },
    email:{
        type: String,
        required: [true, 'please provie email'],
        unique: true,
        match:[/.+\@.+\..+/, 'please provde valid email address'],
    },
    password:{
        type: String,
        required:[true, 'please provide a password'],
        minlength: 6,
    },
    cart:[CartItemSchema],
    addresses: [AddressSchema], 
},{timestamps: true});

const User= mongoose.models.User || mongoose.model('User', UserSchema);

export default User;