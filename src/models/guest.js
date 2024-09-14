import mongoose from "mongoose";

const guestSChema = new mongoose.Schema({
    fullName: {
        type: String
    },

    phone: {
        type: String,
        unique: true,
        require: true,
    },

    totalCanceled: {
        type: Number,
        default: 0,
    },

    totalSuccess: {
        type: Number,
        default: 0,
    },

    prestige: {
        type: Number,
        default: 100,
        max: 100,
    },
},
    { timestamps: true }
);

let Guest = mongoose.model('Guest', guestSChema);

export default Guest;