// ** Lib
import bcrypt from "bcrypt";
import moment from 'moment';

// ** Models
import Account from "../models/account.js";
import User from "../models/user.js";
import Voucher from '../models/voucher.js';

// ** Constants
import { selectUser } from "../constants/query.constant.js";
import { selectVoucher } from "../constants/query.constant.js";
import { ROLE } from "../constants/model.constant.js";

const accountRepository = {
    create: async (account) => {
        const query = [];
        if (account.username) {
            query.push({ username: account.username });
        }
        if (account.email) {
            query.push({ email: account.email });
        }

        const usernameExist = await Account.findOne({ $or: query });

        // 1 mỗi 1 account chỉ có 1 username và 1 email
        if (usernameExist) {
            if (usernameExist.username === account.username) {
                throw new Error("Tên đăng nhập này đã được sử dụng");
            } else {
                throw new Error("Email này đã được sử dụng");
            }
        }

        const user = new User({
            firstName: account.firstName,
            lastName: account.lastName,
            phone: account.phone,
            dob: account.dob,
        });

        const newAccount = new Account({
            username: account.username,
            password: account.password,
            email: account.email,
            user,
            status: {
                isBlocked: false,
            }
        });

        // account.user = user._id;

        if (account.password) {
            const salt = bcrypt.genSaltSync();

            newAccount.password = bcrypt.hashSync(newAccount.password, salt);
        }

        await newAccount.save();

        await user.save();

        return newAccount.populate("user", selectUser);
    },

    updateUser: async (accountId, firstName, lastName, dob, phone) => {
        const account = await accountRepository.findById(accountId);

        await User.findByIdAndUpdate(
            account.user,
            {
                firstName: firstName,
                lastName: lastName,
                phone: phone,
                dob: dob,
            },
            { new: true }
        );

        return account;
    },

    findByUsername: async (username) => {
        const account = await Account.findOne({
            $or: [{ username }, { email: username }],
        }).populate({
            path: "user",
            select: selectUser,
            populate: {
                path: "personalVoucher.voucher",
                model: Voucher,
                select: "-__v"
            }
        });

        if (!account) throw new Error("Tên đăng nhập không đúng");

        return account;
    },

    findById: async (id) => {
        const account = await Account.findById(id).select("-__v").populate({
            path: "user",
            select: selectUser,
            populate: {
                path: "personalVoucher.voucher",
                model: Voucher,
                select: "-__v"
            }
        });

        if (!account) throw new Error("Tài khoản không tồn tại");

        return account;
    },

    findAccountAndUser: async (id) => {
        try {
            const account = await Account.findById(id).select({ __v: 0 });
            const user = await accountRepository.findUserById(
                account.user.toString()
            );
            if (!account || !user) throw new Error("Tài khoản không tồn tại");

            return {
                account: account,
                user: user,
            };
        } catch (err) {
            throw new Error("Tài khoản không tồn tại");
        }
    },

    findUserById: async (id) => {
        try {
            const user = await User.findById(id).select("-__v").populate("personalVoucher.voucher", selectVoucher);
            if (!user) throw new Error("Tài khoản không tồn tại");

            return user;
        } catch (err) {
            throw new Error("Tài khoản không tồn tại");
        }
    },

    findByEmail: async (email) => {
        const account = await Account.findOne({ email }).populate({
            path: "user",
            select: selectUser,
            populate: {
                path: "personalVoucher.voucher",
                model: Voucher,
                select: "-__v"
            }
        });
        return account;
    },

    findByPasswordResetToken: async (token) => {
        const account = await Account.findOne({
            passwordResetToken: token,
            passwordResetExpires: { $gt: Date.now() },
        });
        return account;
    },

    filterAccounts: async (query, skip, size) => {
        return await Account.find(query)
            .populate("user", selectUser)
            .select("-__v")
            .skip(skip)
            .limit(size);
    },

    assign: async (account) => {
        const query = [];
        if (account.username) {
            query.push({ username: account.username });
        }
        if (account.email) {
            query.push({ email: account.email });
        }

        const usernameExist = await Account.findOne({ $or: query });

        // mỗi 1 account chỉ có 1 username và 1 email
        if (usernameExist) {
            if (usernameExist.username === account.username) {
                throw new Error("Username đã tồn tại");
            } else {
                throw new Error("Email này đã được sử dụng");
            }
        }

        const userProfile = new User({
            firstName: '',
            lastName: '',
            phone: '',
        });

        const newAccount = new Account({
            username: account.username,
            password: account.password,
            email: account.email,
            role: account.role,
            user: userProfile,
            status: {
                isBlocked: false,
            }
        });

        if (account.password) {
            const salt = bcrypt.genSaltSync();
            newAccount.password = bcrypt.hashSync(newAccount.password, salt);
        }

        await newAccount.save();

        await userProfile.save();

        return newAccount.populate("user", selectUser);
    },

    totalDocuments: async (query) => {
        return await Account.countDocuments(query);
    },

    editRole: async (accountId, newRole) => {
        const account = await accountRepository.findById(accountId);
        account.role = newRole;
        await account.save();
        return account;
    },

    blockById: async (accountId, blockReason) => {
        const account = await accountRepository.findById(accountId);

        if (account.status.isBlocked) {
            account.status.isBlocked = !account.status.isBlocked;
            account.status.blockReason = "";
        } else {
            account.status.isBlocked = !account.status.isBlocked;
            account.status.blockReason = blockReason;
        }

        await account.save();
        return account;
    },

    giveAwayVoucher: async (userId, voucher) => {
        const receivedUser = await User.findByIdAndUpdate(
            userId,
            {
                $push: {
                    personalVoucher: {
                        voucher: voucher._id,
                    }
                },
            },
            { new: true }
        ).select({
            firstName: 1,
            lastName: 1,
            phone: 1,
            personalVoucher: 1,
        });

        const formatUser = receivedUser.populate("personalVoucher.voucher", selectVoucher);

        return formatUser;
    },

    findUserByAccountId: async (accountId) => {
        const account = await Account.findById(accountId).populate({
            path: "user",
            select: selectUser,
            populate: {
                path: "personalVoucher.voucher",
                model: Voucher,
                select: "-__v"
            }
        });
        return account.user;
    },

    findAllUser: async () => {
        const accounts = await Account.find({
            role: ROLE.USER,
        }).select("-__v").populate({
            path: "user",
            select: selectUser,
            populate: {
                path: "personalVoucher.voucher",
                model: Voucher,
                select: "-__v"
            }
        });

        return accounts;
    },

    findAccountByRole: async (role) => {
        return await Account.findOne({ role: role });
    },
};

export default accountRepository;
