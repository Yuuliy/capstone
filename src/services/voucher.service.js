// ** Lib
import moment from 'moment'
import { Mutex } from 'async-mutex';

// ** Service
import userService from "./user.service.js";

// ** Repository
import voucherRepository from "../repository/voucher.repository.js";
import accountRepository from "../repository/account.repository.js";

// ** Constants
import { sortOptions } from "../constants/query.constant.js";
import { VOUCHER_TYPES, VOUCHER_STATUS } from "../constants/model.constant.js";


const voucherMutex = new Mutex();

const voucherService = {
    create: async ({ title, description, discount, minOrderPrice, maxDiscountValue, expiredDate, isRelease, quantity, startDate, type }, accountId) => {
        const account = await accountRepository.findById(accountId);
        const code = Math.random().toString(36).slice(2, 12);
        const newVoucher = {
            title,
            code: code.toLocaleUpperCase(),
            description,
            discount,
            minOrderPrice,
            maxDiscountValue,
            expiredDate,
            isRelease,
            quantity,
            type,
            createdBy: account.username,
        }

        if (startDate) {
            newVoucher.startDate = startDate;
        }

        const voucher = await voucherRepository.create(newVoucher);

        const result = voucherService.handleVoucherOutput(voucher);
        return result;
    },

    getVoucherDashboard: async ({ title, page, size, status, minOrderPriceSort, isRelease }) => {
        const skip = (page - 1) * size;
        const query = {};

        if (title) {
            query.$or = [
                { title: { $regex: title, $options: 'i' } },
                { code: { $regex: title, $options: 'i' } }
            ];
        }

        if (status) query.status = status;
        if (isRelease !== undefined) query.isRelease = isRelease;

        const sort = {};

        if (minOrderPriceSort === sortOptions.ASC) {
            sort.minOrderPrice = 1;
        } else if (minOrderPriceSort === sortOptions.DESC) {
            sort.minOrderPrice = -1;
        }

        const totalDocuments = await voucherRepository.totalDocuments(query);
        const totalPage = Math.ceil(totalDocuments / size);
        const result = await voucherRepository.getVoucherPaginate(query, skip, size, sort);
        const vouchers = result.map(voucher => voucherService.handleVoucherOutput(voucher));
        return {
            vouchers,
            totalPage,
            totalDocuments,
        };
    },

    getVoucherRelease: async ({ maxDiscountValue, minOrderPrice }) => {
        moment.updateLocale('vn', {
            week: {
                dow: 1,
            }
        });

        const startOfWeek = moment().startOf('week').valueOf();
        const endOfWeek = moment().endOf('week').valueOf();

        const query = {
            type: {
                $ne: VOUCHER_TYPES.UNLIMITED
            },
            status: { $in: [VOUCHER_STATUS.AVAILABLE, VOUCHER_STATUS.APPROVED] },
            startDate: {
                $gte: startOfWeek,
                $lte: endOfWeek
            }
        };

        if (minOrderPrice && minOrderPrice > 0) query.minOrderPrice = { $lte: minOrderPrice };

        if (maxDiscountValue && maxDiscountValue > 0) query.maxDiscountValue = { $gte: maxDiscountValue };

        const voucherRelease = await voucherRepository.findBy(query);
        return voucherRelease.map(voucher => voucherService.handleVoucherOutput(voucher));
    },

    getMyVoucher: async (userId, { title, page, size, status, minOrderPriceSort, orderAmount }) => {
        const userProfile = await accountRepository.findById(userId);
        const personalVoucher = userProfile.user.personalVoucher;

        let filteredVouchers = personalVoucher.filter(voucher => {
            if (!voucher.isUsed) {
                return {
                    voucher: voucher.voucher,
                    isUsed: voucher.isUsed,
                };
            }
        });

        const skip = (page - 1) * size;

        filteredVouchers = filteredVouchers.filter(v => v.voucher.isRelease === true);
        if (title) {
            const regex = new RegExp(title, 'i');
            filteredVouchers = filteredVouchers.filter(v => regex.test(v.voucher.title));
        }
        if (status) {
            filteredVouchers = filteredVouchers.filter(v => v.voucher.status === status);
        }

        if (minOrderPriceSort) {
            filteredVouchers.sort((a, b) => {
                if (minOrderPriceSort === 'ASC') {
                    return a.voucher.minOrderPrice - b.voucher.minOrderPrice;
                } else if (minOrderPriceSort === 'DESC') {
                    return b.voucher.minOrderPrice - a.voucher.minOrderPrice;
                }
                return 0;
            });
        }

        let totalDocuments = filteredVouchers.length;
        let totalPage = Math.ceil(totalDocuments / size);
        let paginatedVouchers = filteredVouchers.slice(skip, skip + size);
        paginatedVouchers = voucherService.handlePersonalVoucherOutput(paginatedVouchers);

        if (orderAmount && !title) {
            paginatedVouchers = await voucherService.handleRecommentVoucher(filteredVouchers, orderAmount);
            paginatedVouchers = voucherService.handlePersonalVoucherOutput(paginatedVouchers);
            totalDocuments = paginatedVouchers.length;
            totalPage = Math.ceil(totalDocuments / size);
        }

        return {
            vouchers: paginatedVouchers,
            totalPage,
            totalDocuments,
        };
    },

    handleRecommentVoucher: async (vouchers, orderAmount) => {
        const recommendVouchers = vouchers.filter(voucher => {
            return orderAmount >= voucher.voucher.minOrderPrice && voucher.voucher.expiredDate > Date.now() && voucher.isUsed === false;
        });

        recommendVouchers.sort((a, b) => {
            const maxDiscountA = Math.min(a.voucher.maxDiscountValue, orderAmount * a.voucher.discount);
            const maxDiscountB = Math.min(b.voucher.maxDiscountValue, orderAmount * b.voucher.discount);
            return maxDiscountB - maxDiscountA;
        });

        return recommendVouchers;
    },

    getByCode: async (code) => {
        const result = await voucherRepository.getByCode(code);
        return voucherService.handleVoucherOutput(result);
    },

    updateVoucher: async (code, { title, description, discount, minOrderPrice, maxDiscountValue, startDate, expiredDate, isRelease, quantity, type }, accountId) => {
        const account = await accountRepository.findById(accountId);
        const voucher = await voucherRepository.getByCode(code);

        const voucherExist = await voucherRepository.findOneBy(
            {
                title: { $regex: title, $options: 'i' },
                code: { $ne: code }
            }
        );

        if (voucherExist) throw new Error('Voucher đã tồn tại');

        if (!voucher) throw new Error(`Không tìm thấy voucher: ${code}`);

        if (voucher.isRelease) throw new Error('Không thể chỉnh sửa voucher đã được phát hành');

        voucher.title = title;
        voucher.description = description;
        voucher.discount = discount;
        voucher.minOrderPrice = minOrderPrice;
        voucher.maxDiscountValue = maxDiscountValue;
        voucher.expiredDate = expiredDate;
        voucher.isRelease = isRelease;
        voucher.quantity = quantity;
        voucher.type = type;
        voucher.editedBy = account.username;

        if (startDate) {
            voucher.startDate = startDate;
        }

        await voucher.save();
        return voucherService.handleVoucherOutput(voucher);
    },

    changePublishStatus: async (code, accountId) => {
        const account = await accountRepository.findById(accountId);
        const voucherUpdated = await voucherRepository.changePublishStatus(code, account.username);
        return voucherService.handleVoucherOutput(voucherUpdated);
    },

    saveVoucher: async (accountId, voucherCode) => {
        const release = await voucherMutex.acquire();

        try {
            const account = await accountRepository.findById(accountId);
            const user = account.user;

            const voucherSaved = user.personalVoucher.find(voucher => voucher.voucher.code === voucherCode);
            if (voucherSaved) throw new Error('Voucher đã được lưu trước đó');

            const voucher = await voucherRepository.getByCode(voucherCode);
            if (!voucher) throw new Error('Không tìm thấy voucher này!');
            if (voucher.quantity === 0) throw new Error('Voucher đã hết!');

            user.personalVoucher.push({
                voucher: voucher._id,
                isUsed: false,
            });

            await user.save();

            if (voucher.quantity) voucher.quantity -= 1;

            await voucher.save();
        } finally {
            release();
        }
    },

    handleVoucherOutput: (voucher) => {
        return {
            title: voucher.title,
            code: voucher.code,
            description: voucher.description,
            discount: voucher.discount,
            minOrderPrice: voucher.minOrderPrice,
            maxDiscountValue: voucher.maxDiscountValue,
            isRelease: voucher.isRelease,
            status: voucher.status,
            type: voucher.type,
            startDate: voucher.startDate,
            expiredDate: voucher.expiredDate,
            type: voucher.type,
            quantity: voucher.quantity,
            createdBy: voucher.createdBy,
            approvedBy: voucher.approvedBy,
            editedBy: voucher.editedBy,
            // isEdited: voucher.isEdited,
        };
    },

    handlePersonalVoucherOutput: (personalVouchers) => {
        return personalVouchers.map(voucher => {
            return {
                title: voucher.voucher.title,
                code: voucher.voucher.code,
                description: voucher.voucher.description,
                discount: voucher.voucher.discount,
                minOrderPrice: voucher.voucher.minOrderPrice,
                maxDiscountValue: voucher.voucher.maxDiscountValue,
                isRelease: voucher.voucher.isRelease,
                status: voucher.voucher.status,
                type: voucher.voucher.type,
                startDate: voucher.voucher.startDate,
                expiredDate: voucher.voucher.expiredDate,
                quantity: voucher.voucher.quantity,
                type: voucher.voucher.type,
                isUsed: voucher.isUsed,
                // isEdited: voucher.voucher.isEdited,
            };
        });
    },

    findOrCreateBirthdayVoucher: async (today) => {
        const voucher = await voucherRepository.findOneBy({
            $or: [
                { title: { $regex: today, $options: 'i' } },
                { title: { $regex: `${today.replace('-', '/')}`, $options: 'i' } }
            ]
        });

        if (voucher) return voucher;

        const startDate = new Date(Date.now()).setHours(0, 0, 0, 0);

        return await voucherRepository.create({
            code: Math.random().toString(36).slice(2, 12).toLocaleUpperCase(),
            title: `Voucher sinh nhật ${today}`,
            description: `Voucher sinh nhật ${today}`,
            discount: 0.5,
            minOrderPrice: 800000,
            maxDiscountValue: 500000,
            startDate,
            expiredDate: startDate + 604800000,
            isRelease: true,
            type: VOUCHER_TYPES.UNLIMITED,
            status: VOUCHER_STATUS.AVAILABLE,
            createdBy: 'System',
        });
    },

    releaseVoucher: async (code) => {
        const voucher = await voucherRepository.getByCode(code);

        if (!voucher) throw new Error('Voucher not found');

        if (Date.now() < voucher.startDate) throw new Error('Voucher chưa đến thời điểm phát hành');

        if (voucher.isRelease) throw new Error('Voucher chưa được phát hành');

        voucher.isRelease = true;
        await voucher.save();
        return voucherService.handleVoucherOutput(voucher);
    },

    handleExpiredVoucher: async () => {
        await voucherRepository.findAndUpdateExpiredVoucher();
    },

    removeVoucherExpired: async () => {
        //handle remove personal voucher
        const accounts = await accountRepository.findAllUser();

        for (const account of accounts) {
            const user = account.user;
            const personalVoucher = user.personalVoucher;

            const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

            const vouchers = personalVoucher.filter(voucher => {
                return voucher.voucher.expiredDate < sevenDaysAgo && voucher.voucher.status == VOUCHER_STATUS.EXPIRED;
            });

            for (const voucher of vouchers) {
                const index = personalVoucher.findIndex(v => v.voucher._id.toString() === voucher.voucher._id.toString());
                personalVoucher.splice(index, 1);
            }

            await user.save();
        }

        await voucherRepository.removeVoucherExpired();
    },

    releaseScheduleVoucher: async () => {
        const scheduleVouchers = await voucherRepository.findScheduleVoucher();
        for (const voucher of scheduleVouchers) {
            if (Date.now() < voucher.startDate) continue;
            if (voucher.isRelease) continue;
            voucher.status = VOUCHER_STATUS.AVAILABLE;
            voucher.isRelease = true;
            await voucher.save();
        }
    },

    saveAllVoucher: async (accountId) => {
        const account = await accountRepository.findById(accountId);
        const user = account.user;
        const personalVoucher = user.personalVoucher;

        moment.updateLocale('vn', {
            week: {
                dow: 1, // Monday is the first day of the week
            }
        });

        const startOfWeek = moment().startOf('week').valueOf();
        const endOfWeek = moment().endOf('week').valueOf();

        const query = {
            type: {
                $ne: VOUCHER_TYPES.UNLIMITED
            },
            status: VOUCHER_STATUS.AVAILABLE,
            startDate: {
                $gte: startOfWeek,
                $lte: endOfWeek
            }
        };

        const vouchersInWeek = await voucherRepository.findBy(query);

        const vouchersSaved = []
        for (const voucher of vouchersInWeek) {
            const isSaved = personalVoucher.find(v => v.voucher._id.toString() == voucher._id.toString());
            if (isSaved) continue;
            if (!voucher.isRelease) continue;
            if (voucher.quantity === 0) continue;
            if (voucher.quantity > 0) voucher.quantity -= 1;
            personalVoucher.push({
                voucher: voucher._id,
                isUsed: false,
            });

            await voucher.save();
            vouchersSaved.push(voucherService.handleVoucherOutput(voucher));
        }

        user.save();

        return vouchersSaved;
    },
};

export default voucherService;