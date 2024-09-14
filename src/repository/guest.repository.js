// ** Models
import Guest from '../models/guest.js';

const guestRepository = {
    create: async (data) => {
        return await Guest.create(data);
    },

    findOneAndUpdate: async (phone, query) => {
        return await Guest.findOneAndUpdate(
            { phone },
            query,
            { new: true, upsert: true }
        );
    },

    findByPhone: async (phone) => {
        return await Guest.findOne({ phone });
    }
};

export default guestRepository;
