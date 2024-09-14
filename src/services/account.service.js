// ** Lib
import moment from 'moment';

// ** Repository
import { PERMISSION_MATRIX, ROLE } from "../constants/model.constant.js";
import accountRepository from "../repository/account.repository.js";
import productService from "./product.service.js";

const accountService = {
    assignAccount: async ({ username, password, email }) => {
        const account = await accountRepository.assign({ username, password, email, role: ROLE.STAFF });

        return accountService.formatAccountResponse(account);
    },

    getAccountDashboard: async ({
        page,
        size,
        nameKey,
        role,
        isBlocked,
    }) => {
        const skip = (page - 1) * size;
        let query = {};
        if (nameKey) query = {
            $or: [
                { username: { $regex: nameKey, $options: 'i' } },
                { email: { $regex: nameKey, $options: 'i' } },
            ]
        };
        if (role) query.role = role;
        if (isBlocked) query['status.isBlocked'] = isBlocked;

        const totalDocuments = await accountRepository.totalDocuments(query);
        const totalPage = Math.ceil(totalDocuments / size);

        const accounts = await accountRepository.filterAccounts(
            query,
            skip,
            size
        );
        const accountListFormat = await Promise.all(accounts.map((account) =>
            accountService.formatAccountResponse(account))
        );

        return {
            accounts: accountListFormat,
            totalPage,
            totalDocuments,
        };
    },

    editAccountRole: async (accountId, { role }, accountRole) => {
        const account = await accountRepository.findById(accountId);

        if (!PERMISSION_MATRIX[accountRole]?.[account.role]) throw new Error(`Bạn không có quyền chỉnh sửa role của tài khoản này`);

        if (!PERMISSION_MATRIX[accountRole]?.[role]) throw new Error(`Bạn không có quyền đưa tài khoản này thành ${role}`);

        if (account.role === role) return accountService.formatAccountResponse(account);

        if (role !== ROLE.STAFF) {
            const accountWithRole = await accountRepository.findAccountByRole(role);

            if (accountWithRole) {
                accountWithRole.role = ROLE.STAFF;
                await accountWithRole.save();
            }
        }

        const editAccount = await accountRepository.editRole(accountId, role);
        return accountService.formatAccountResponse(editAccount);
    },

    blockAccount: async (accountId, accountRole, blockReason) => {
        const account = await accountRepository.blockById(accountId, blockReason);

        if (!PERMISSION_MATRIX[accountRole]?.[account.role]) throw new Error('Bạn không có quyền chặn tài khoản này');

        return accountService.formatAccountResponse(account);
    },

    formatAccountResponse: async (account) => {
        return {
            _id: account._id,
            username: account.username,
            email: account.email,
            role: account.role,
            user: {
                _id: account.user._id,
                firstName: account.user.firstName,
                lastName: account.user.lastName,
                phone: account.user.phone,
            },
            isBlocked: account.status.isBlocked,
            blockReason: account.status.blockReason,
        }
    },

    reductPrestige: async (accountId) => {
        const user = await accountRepository.findUserByAccountId(accountId);
        const newPrestige = Math.max(user.prestige - 30, 0);
        user.prestige = newPrestige
        await user.save();
    },

    increasePrestige: async (accountId) => {
        const user = await accountRepository.findUserByAccountId(accountId);
        const newPrestige = Math.min(user.prestige + 10, 100);
        user.prestige = newPrestige;
        await user.save();
    },

    findBirthdayAccounts: async (today) => {
        const accounts = await accountRepository.findAllUser();

        const result = accounts.filter(account => {
            if (!account.user.dob) return false;
            const dob = moment(account.user.dob).startOf('day');
            const dobMonthDay = dob.format('MM-DD');
            return today === dobMonthDay;
        });

        return result;
    },

    findAccountById: async (accountId) => {
        return await accountRepository.findById(accountId);
    }
};

export default accountService;