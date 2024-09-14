import mongoose from "mongoose";

export const deliveryAddressSchema = new mongoose.Schema({
    fullName: {
        type: String
    },

    phone: {
        type: String
    },

    address: {
        type: String
    },

    province: {
        type: {
            provinceId: String,
            provinceName: String
        }
    },

    district: {
        type: {
            districtId: String,
            districtName: String
        }
    },

    ward: {
        type: {
            wardId: String,
            wardName: String
        }
    },

    isDefault: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

const voucherSchema = new mongoose.Schema({
    voucher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Voucher',
        required: true
    },
    isUsed: {
        type: Boolean,
        default: false
    }
}, { _id: false });

const userSchema = new mongoose.Schema({
    firstName: {
        type: String
    },

    lastName: {
        type: String
    },

    phone: {
        type: String
    },

    dob: {
        type: Number
    },

    prestige: {
        type: Number,
        default: 100,
        max: 100,
    },

    deliveryAddress: [deliveryAddressSchema],

    personalVoucher: [voucherSchema],

}, { timestamps: true });

// Middleware to check dob update count before findOneAndUpdate
userSchema.pre('findOneAndUpdate', async function (next) {
    const update = this.getUpdate();
    if (update && update.dob !== undefined) {
        const docToUpdate = await this.model.findOne(this.getQuery()).select('dob');

        if (docToUpdate) {
            if (docToUpdate.dob === undefined || docToUpdate.dob === null) {
                return next();
            }

            const dobUpdated = await this.model.findOne(
                {
                    _id: docToUpdate._id,
                    dob: { $ne: null }
                }
            )

            if (dobUpdated) {
                throw new Error('Bạn chỉ có thể cập nhật ngày sinh 1 lần.');
            }
        }
    }
    next();
});

let User = mongoose.model('User', userSchema);

export default User;