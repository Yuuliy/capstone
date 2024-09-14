// ** Service
import paymentService from '../services/payment.service.js'

// ** Constants
import { statusCode } from "../constants/index.js";

// ** Utils
import { response } from "../utils/baseResponse.js";

const paymentController = {
    createPaymentUrl: async (req, res) => {
        const ipAddr = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

        const order = req.body.order;
        const bankCode = req.body.bankCode;
        const locale = req.body.language || 'vn';
        const accountId = req.body.accountId;
        try {
            const vnpUrl = await paymentService.getVnPaytUrl(ipAddr, bankCode, locale, order, accountId);
            res.status(statusCode.OK).json(response.success(
                {
                    data: vnpUrl,
                    code: statusCode.OK,
                }
            ));
        } catch (err) {
            res.status(statusCode.BAD_REQUEST).json(response.error(
                {
                    message: err?.message,
                    code: statusCode.BAD_REQUEST,
                }
            ));
        }
    },

    vnpayReturn: async (req, res) => {
        let vnp_Params = { ...req.query };
        try {
            await paymentService.vnpayReturn(vnp_Params);
            res.redirect(`${process.env.CLIENT_URL}/checkout/success`);
        } catch (err) {
            res.redirect(`${process.env.CLIENT_URL}/checkout/error`);
        }
    },

    repayment: async (req, res) => {
        const ipAddr = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

        const orderCode = req.body.orderCode;
        const bankCode = req.body.bankCode;
        const locale = req.body.language || 'vn';

        try {
            const vnpUrl = await paymentService.getRepaymentUrlBy(ipAddr, bankCode, locale, orderCode);
            res.status(statusCode.OK).json(response.success(
                {
                    data: vnpUrl,
                    code: statusCode.OK,
                }
            ));
        } catch (err) {
            res.status(statusCode.BAD_REQUEST).json(response.error(
                {
                    message: err?.message,
                    code: statusCode.BAD_REQUEST,
                }
            ));
        }
    },

    refund: async (req, res) => {
        const vnp_IpAddr = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

        const orderCode = req.body.orderCode;
        try {
            const result = await paymentService.refund(vnp_IpAddr, orderCode, 'Shoes for Sure');
            res.status(statusCode.OK).json(response.success(
                {
                    data: `Gửi yêu cầu hoàn tiền cho đơn hàng ${result.vnp_TxnRef} thành công`,
                    code: statusCode.OK,
                }
            ));
        } catch (err) {
            res.status(statusCode.BAD_REQUEST).json(response.error(
                {
                    message: err?.message,
                    code: statusCode.BAD_REQUEST,
                }
            ));
        }
    },
};

export default paymentController;