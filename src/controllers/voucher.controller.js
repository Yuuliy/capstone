// ** Service
import voucherService from "../services/voucher.service.js";

// ** Constants
import { statusCode } from "../constants/index.js";

// ** Utils
import { response } from "../utils/baseResponse.js";

const voucherController = {
    newVoucher: async (req, res) => {
        const id = req.user.id;
        const data = req.body;
        try {
            const voucher = await voucherService.create(data, id);
            res.status(statusCode.CREATED).json(response.success(
                {
                    data: voucher,
                    code: statusCode.CREATED,
                }
            ));
        } catch (error) {
            res.status(statusCode.BAD_REQUEST).json(response.error(
                {
                    message: error?.message,
                    code: statusCode.BAD_REQUEST,
                }
            ));
        }
    },

    getVoucherDashboard: async (req, res) => {
        const data = req.query;
        try {
            const vouchers = await voucherService.getVoucherDashboard(data);
            res.status(statusCode.OK).json(response.success(
                {
                    data: vouchers,
                    code: statusCode.OK,
                }
            ));
        } catch (error) {
            res.status(statusCode.BAD_REQUEST).json(response.error(
                {
                    message: error?.message,
                    code: statusCode.BAD_REQUEST,
                }
            ));
        }
    },

    getVoucherRelease: async (req, res) => {
        const data = req.query;
        try {
            const vouchers = await voucherService.getVoucherRelease(data);
            res.status(statusCode.OK).json(response.success(
                {
                    data: vouchers,
                    code: statusCode.OK,
                }
            ));
        } catch (error) {
            res.status(statusCode.BAD_REQUEST).json(response.error(
                {
                    message: error?.message,
                    code: statusCode.BAD_REQUEST,
                }
            ));
        }
    },

    getMyVoucher: async (req, res) => {
        const data = req.query;
        const id = req.user.id;
        try {
            const vouchers = await voucherService.getMyVoucher(id, data);
            res.status(statusCode.OK).json(response.success(
                {
                    data: vouchers,
                    code: statusCode.OK,
                }
            ));
        } catch (error) {
            res.status(statusCode.BAD_REQUEST).json(response.error(
                {
                    message: error?.message,
                    code: statusCode.BAD_REQUEST,
                }
            ));
        }
    },

    getByCode: async (req, res) => {
        const { code } = req.params;
        try {
            const voucher = await voucherService.getByCode(code);
            res.status(statusCode.OK).json(response.success(
                {
                    data: voucher,
                    code: statusCode.OK,
                }
            ));
        } catch (error) {
            res.status(statusCode.BAD_REQUEST).json(response.error(
                {
                    message: error?.message,
                    code: statusCode.BAD_REQUEST,
                }
            ));
        }
    },

    updateVoucher: async (req, res) => {
        const id = req.user.id;
        const { code } = req.params;
        const data = req.body;
        try {
            const voucher = await voucherService.updateVoucher(code, data, id);
            res.status(statusCode.OK).json(response.success(
                {
                    data: voucher,
                    code: statusCode.OK,
                }
            ));
        } catch (error) {
            res.status(statusCode.BAD_REQUEST).json(response.error(
                {
                    message: error?.message,
                    code: statusCode.BAD_REQUEST,
                }
            ));
        }
    },

    changePublishStatus: async (req, res) => {
        const id = req.user.id;
        const code = req.params.code
        try {
            const voucher = await voucherService.changePublishStatus(code, id);
            res.status(statusCode.OK).json(response.success(
                {
                    data: voucher,
                    code: statusCode.OK
                }
            ))
        } catch (error) {
            res.status(statusCode.BAD_REQUEST).json(response.error(
                {
                    message: error?.message,
                    code: statusCode.BAD_REQUEST
                }
            ))
        }
    },

    saveVoucher: async (req, res) => {
        const { voucherCode } = req.body;
        const accountId = req.user.id;
        try {
            await voucherService.saveVoucher(accountId, voucherCode);
            res.status(statusCode.OK).json(response.success(
                {
                    data: 'OK',
                    code: statusCode.OK
                }
            ))
        } catch (error) {
            res.status(statusCode.BAD_REQUEST).json(response.error(
                {
                    message: error?.message,
                    code: statusCode.BAD_REQUEST
                }
            ))
        }
    },

    releaseVoucher: async (req, res) => {
        const { code } = req.params;
        try {
            await voucherService.releaseVoucher(code);
            res.status(statusCode.OK).json(response.success(
                {
                    data: 'OK',
                    code: statusCode.OK
                }
            ))
        } catch (error) {
            res.status(statusCode.BAD_REQUEST).json(response.error(
                {
                    message: error?.message,
                    code: statusCode.BAD_REQUEST
                }
            ))
        }
    },

    saveAllVoucher: async (req, res) => {
        const accountId = req.user.id;
        try {
            const result = await voucherService.saveAllVoucher(accountId);
            res.status(statusCode.OK).json(response.success(
                {
                    data: result,
                    code: statusCode.OK
                }
            ))
        } catch (error) {
            res.status(statusCode.BAD_REQUEST).json(response.error(
                {
                    message: error?.message,
                    code: statusCode.BAD_REQUEST
                }
            ))
        }
    },
};

export default voucherController;