// ** Repository
import guestRepository from "../repository/guest.repository.js";

const guestService = {
    create: async ({
        fullName,
        phone,
    }) => {
        const blacklist = await guestRepository.create({
            fullName,
            phone,
        });

        return blacklist;
    },

    reductPrestige: async ({
        phone,
        fullName,
    }) => {
        const guest = await guestRepository.findByPhone(phone);

        if (guest) {
            const newPrestige = Math.max(guest.prestige - 30, 0);
            await guestRepository.findOneAndUpdate(phone, {
                fullName,
                prestige: newPrestige,
                $inc: { totalCanceled: 1 },
            });
        } else {
            await guestRepository.findOneAndUpdate(phone, {
                fullName,
                $inc: { totalCanceled: 1 , prestige: 70},
            });
        };
    },

    increasePrestige: async ({
        phone,
        fullName,
    }) => {
        const guest = await guestRepository.findByPhone(phone);

        if (guest) {
            const newPrestige = Math.min(guest.prestige + 10, 100);
            await guestRepository.findOneAndUpdate(phone, {
                fullName,
                prestige: newPrestige,
                $inc: { totalSuccess: 1 },
            });
        } else {
            await guestRepository.findOneAndUpdate(phone, {
                fullName,
                $inc: { totalSuccess: 1 },
            });
        }
    },

    findByPhone: async (phone) => {
        return await guestRepository.findByPhone(phone);
    },
};

export default guestService;