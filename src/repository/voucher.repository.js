// ** Lib
import moment from 'moment'

// ** Model
import { VOUCHER_STATUS } from '../constants/model.constant.js';
import Voucher from '../models/voucher.js';

const voucherRepository = {
    create: async ({ title, code, description, discount, minOrderPrice, maxDiscountValue, expiredDate, isRelease, quantity, startDate, type, createdBy, status }) => {
        const voucherExist = await Voucher.findOne({ title: title })
        if (voucherExist) throw new Error('Voucher đã tồn tại');

        const newVoucher = new Voucher({
            title,
            code,
            description,
            discount,
            minOrderPrice,
            maxDiscountValue,
            startDate,
            expiredDate,
            isRelease,
            quantity,
            type,
            createdBy,
            status
        });

        await newVoucher.save();
        return newVoucher;
    },

    getVoucherPaginate: async (query, skip, size, sortOptions) => {
        return Voucher.find(query)
            .skip(skip)
            .sort(sortOptions)
            .limit(size).select('-__v');
    },

    getByCode: async (code) => {
        const voucher = await Voucher.findOne({ code })
        if (!voucher) throw new Error(`Không tìm thấy voucher với mã ${code}`);
        return voucher;
    },

    changePublishStatus: async (code, approvedBy) => {
        const voucher = await Voucher.findOne({ code });

        if (!voucher) throw new Error(`Voucher ${code} không tồn tại`);

        if (voucher.isRelease) throw new Error('Không thể ẩn voucher đã được phát hành');

        if (!voucher.startDate) {
            const tomorrow = new Date();
            const vietnamTime = new Date(tomorrow.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));
            vietnamTime.setDate(vietnamTime.getDate() + 1);
            vietnamTime.setHours(0, 0, 0, 0);
            voucher.startDate = vietnamTime.getTime() - 7 * 60 * 60 * 1000;
        } else if (voucher.startDate < Date.now()) throw new Error('Voucher đã quá lịch phát hành');

        voucher.status = VOUCHER_STATUS.APPROVED;
        voucher.approvedBy = approvedBy;

        await voucher.save()
        return voucher;
    },

    totalDocuments: async (query) => {
        return Voucher.countDocuments(query);
    },

    findBy: async (query) => {
        return await Voucher.find(query);
    },

    findOneBy: async (query) => {
        return await Voucher.findOne(query);
    },

    findAndUpdateExpiredVoucher: async () => {
        await Voucher.updateMany({ expiredDate: { $lte: Date.now() } }, { status: VOUCHER_STATUS.EXPIRED });
    },

    removeVoucherExpired: async () => {
        const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        await Voucher.deleteMany(
            {
                status: VOUCHER_STATUS.EXPIRED,
                expiredDate: { $lte: sevenDaysAgo }
            }
        );
    },

    findScheduleVoucher: async () => {
        moment.updateLocale('vn', {
            week: {
                dow: 1, // Monday is the first day of the week
            }
        });

        const endOfWeek = moment().endOf('week').valueOf();
        const startOfWeek = moment().startOf('week').valueOf();
        return Voucher.find(
            {
                $and: {
                    startDate: { $exists: true },
                    startDate: { $lte: endOfWeek },
                    startDate: { $gte: startOfWeek }
                },
                status: VOUCHER_STATUS.APPROVED,
                isRelease: false
            }
        );
    },
};

export default voucherRepository;