import mongoose from 'mongoose';

// ** Constant
import { VOUCHER_STATUS, VOUCHER_TYPES } from '../constants/model.constant.js';

const voucherSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },

    code: {
        type: String,
        required: true,
    },

    description: {
        type: String,
    },

    discount: {
        type: Number,
    },

    minOrderPrice: {
        type: Number,
        required: true,
    },

    maxDiscountValue: {
        type: Number,
    },

    expiredDate: {
        type: Number,
    },

    isRelease: {
        type: Boolean,
        default: false,
    },

    status: {
        type: String,
        default: VOUCHER_STATUS.PENDING,
    },

    quantity: {
        type: Number,
        required: false,
    },

    type: {
        type: String,
    },

    startDate: {
        type: Number,
    },

    createdBy: {
        type: String,
    },

    approvedBy: {
        type: String,
    },

    editedBy: {
        type: String,
    },
}, { timestamps: true });

let Voucher = mongoose.model('Voucher', voucherSchema);

export default Voucher;