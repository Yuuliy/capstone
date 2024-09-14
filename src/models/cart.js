import mongoose from "mongoose";

import { itemSchema } from "./order.js";

const cartSchema = new mongoose.Schema({
    items: [itemSchema],
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account'
    },
    totalPrice: {
        type: Number,
    },
},
    { timestamps: true }
);

let Cart = mongoose.model('Cart', cartSchema);

export default Cart;