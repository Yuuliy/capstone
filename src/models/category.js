import mongoose from "mongoose";

const categorySChema = new mongoose.Schema({
    name: {
        type: String
    },
    description: {
        type: String
    },
    isHide: {
        type: Boolean,
        default: false,
    }
},
    { timestamps: true }
);

let Category = mongoose.model('Category', categorySChema);
export default Category;