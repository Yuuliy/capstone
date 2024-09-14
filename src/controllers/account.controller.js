// ** Service
import accountService from "../services/account.service.js";

// ** Constants
import { statusCode } from "../constants/index.js";

// ** Utils
import { response } from "../utils/baseResponse.js";

const accountController = {
    assign: async (req, res) => {
        const data = req.body;
        try {
            const result = await accountService.assignAccount(data);
            res.status(statusCode.CREATED).json(response.success(
                {
                    data: result,
                    code: statusCode.CREATED,
                }
            ));
        } catch (error) {
            res.status(statusCode.BAD_REQUEST).json(response.error(
                {
                    message: error?.message,
                    code: statusCode.BAD_REQUEST,
                }
            ))
        }
    },

    allAccounts: async (req, res) => {
        const data = req.query;
        try {
            const result = await accountService.getAccountDashboard(data);
            res.status(statusCode.OK).json(response.success(
                {
                    data: result,
                    code: statusCode.OK,
                }
            ));
        } catch (error) {
            res.status(statusCode.BAD_REQUEST).json(response.error(
                {
                    message: error?.message,
                    code: statusCode.BAD_REQUEST,
                }
            ))
        }
    },

    editRole: async (req, res) => {
        const data = req.body;
        const accountId = req.params.id;
        const { role, id } = req.user;

        try {
            if (accountId == id) throw new Error("Bạn không thể chỉnh sửa role của chính mình");
            const result = await accountService.editAccountRole(accountId, data, role);
            res.status(statusCode.OK).json(response.success(
                {
                    data: result,
                    code: statusCode.OK,
                }
            ));
        } catch (error) {
            res.status(statusCode.BAD_REQUEST).json(response.error(
                {
                    message: error?.message,
                    code: statusCode.BAD_REQUEST,
                }
            ))
        }
    },

    blockAccount: async (req, res) => {
        const accountId = req.params.id;
        const { role, id } = req.user;
        const { reason } = req.body;
        try {
            if (accountId == id) throw new Error("Bạn không thể block chính mình");
            const result = await accountService.blockAccount(accountId, role, reason);
            res.status(statusCode.OK).json(response.success(
                {
                    data: result,
                    code: statusCode.OK,
                }
            ));
        } catch (error) {
            res.status(statusCode.BAD_REQUEST).json(response.error(
                {
                    message: error?.message,
                    code: statusCode.BAD_REQUEST,
                }
            ))
        }
    },
};

export default accountController;