import mongoose from 'mongoose';

// ** Model
import { SizeMetrics } from './product.js';

// ** Constant
import { ORDER_STATUS } from '../constants/model.constant.js';

const paymentSchema = new mongoose.Schema({
    method: {
        type: String,
        required: true,
    },

    paid: {
        type: Boolean,
        required: false,
    },

    transactionDate: {
        type: Number,
        required: false,
    },

    refunded: {
        type: Boolean,
        required: false,
    },
}, { _id: false });

const shippingSchema = new mongoose.Schema({
    shippingId: {
        type: String,
    },

    method: {
        type: Boolean,
        required: true,
    },

    fee: {
        type: Number,
        required: false,
    },

    reason: {
        type: String,
    },
}, { _id: false });

export const itemSchema = new mongoose.Schema({
    displayName: {
        type: String,
    },
    productCode: {
        type: String,
    },
    image: {
        type: String,
    },
    price: {
        type: Number,
    },
    sizeMetrics: [SizeMetrics],
    size: {
        type: Number,
    },
    quantity: {
        type: Number,
    },
    isHide: {
        type: Boolean,
    },
}, { _id: false });

const deliveryAddressSchema = new mongoose.Schema({
    id: {
        type: String,
        required: false,
    },

    address: {
        type: String,
        required: true,
    },

    province: {
        type: String,
        required: true,
    },

    district: {
        type: String,
        required: true,
    },

    ward: {
        type: String,
        required: true,
    },

    isEdited: {
        type: Boolean,
        default: false,
    },
}, { _id: false });

const orderSchema = new mongoose.Schema({
    code: {
        type: String,
    },

    items: [itemSchema],

    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
    },

    email: {
        type: String,
        required: true,
    },

    receiverName: {
        type: String,
        required: true,
    },

    deliveryAddress: {
        type: deliveryAddressSchema,
        required: true,
    },

    receiverPhone: {
        type: String,
        required: true,
    },

    payment: {
        type: paymentSchema,
        required: true,
    },

    voucherCode: {
        type: String,
        required: false,
    },

    discountValue: {
        type: Number,
        required: false,
    },

    status: {
        type: String,
        required: true,
        default: ORDER_STATUS.PENDING,
    },

    cancelReason: {
        type: String,
        required: false,
    },

    shipping: {
        type: shippingSchema,
        required: false,
    },

    totalPrice: {
        type: Number,
        required: true,
    },

    approvedBy: {
        type: String,
        required: false,
    },

    canceledBy: {
        type: String,
        required: false,
    },
}, { timestamps: true });

let Order = mongoose.model('Order', orderSchema);

export default Order;