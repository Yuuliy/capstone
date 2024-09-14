// ** Lib
import queryString from 'qs';
import crypto from 'crypto';
import axios from 'axios';
import moment from 'moment';

// ** Services
import orderService from './order.service.js';

// ** Repository
import orderRepository from '../repository/order.repository.js';
import accountRepository from '../repository/account.repository.js';
import cartRepository from '../repository/cart.repository.js';

// ** Constants
import { TMN_CODE, VNPAY_SECRET_KEY, VNPAY_URL, SERVER_URL, CURR_CODE, VNP_API } from '../constants/index.js';

const paymentService = {
    getVnPaytUrl: async (ipAddr, bankCode, locale, order, accountId) => {
        let newOrder = null;
        if (accountId) {
            newOrder = await orderService.createOrder(order, accountId);
        } else {
            newOrder = await orderService.createGuestOrder(order);
        }

        return await paymentService.createVnPaytUrl(ipAddr, bankCode, locale, newOrder.code);
    },


    getRepaymentUrlBy: async (ipAddr, bankCode, locale, orderCode) => {
        return await paymentService.createVnPaytUrl(ipAddr, bankCode, locale, orderCode);
    },


    createVnPaytUrl: async (ipAddr, bankCode, locale, orderCode) => {
        const date = new Date(Date.now() + 7 * 60 * 60 * 1000);
        const createDate = moment(date).format('YYYYMMDDHHmmss');

        const order = await orderRepository.findByCode(orderCode);
        order.payment.transactionDate = createDate;
        order.save();
        const tmnCode = TMN_CODE;
        const secretKey = VNPAY_SECRET_KEY;
        let vnpUrl = VNPAY_URL;
        const returnUrl = `${SERVER_URL}/api/public/payment/vnpay-return`;
        const orderId = order.code;

        const discountValue = order.discountValue || 0;
        const vnp_Amount = (order.totalPrice + order.shipping.fee - discountValue) * 100;

        let vnp_Params = {
            vnp_Version: '2.1.0',
            vnp_Command: 'pay',
            vnp_TmnCode: tmnCode,
            vnp_Locale: locale,
            vnp_CurrCode: CURR_CODE,
            vnp_TxnRef: orderId,
            vnp_OrderInfo: `Thanh toan cho ma GD:${orderId}`,
            vnp_OrderType: 'other',
            vnp_Amount,
            vnp_ReturnUrl: returnUrl,
            vnp_IpAddr: ipAddr,
            vnp_CreateDate: createDate
        };

        if (bankCode) {
            vnp_Params['vnp_BankCode'] = bankCode;
        }

        vnp_Params = await paymentService.sortObject(vnp_Params);

        const signData = queryString.stringify(vnp_Params, { encode: false });
        const hmac = crypto.createHmac("sha512", secretKey);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
        vnp_Params['vnp_SecureHash'] = signed;
        vnpUrl += '?' + queryString.stringify(vnp_Params, { encode: false });

        return vnpUrl;
    },

    vnpayReturn: async (vnpParams) => {
        const secureHash = vnpParams.vnp_SecureHash;
        delete vnpParams.vnp_SecureHash;
        delete vnpParams.vnp_SecureHashType;

        const vnpParamsSorted = await paymentService.sortObject(vnpParams);
        const secretKey = VNPAY_SECRET_KEY;

        const signData = queryString.stringify(vnpParamsSorted, { encode: false });

        const hmac = crypto.createHmac("sha512", secretKey);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

        const order = await orderRepository.findByCode(vnpParamsSorted.vnp_TxnRef);

        if (secureHash === signed && vnpParamsSorted.vnp_TransactionStatus === '00') {
            order.payment.paid = true;

            order.save();
            return order;
        } else if (vnpParamsSorted.vnp_TransactionStatus === '02') {
            throw new Error('Thanh toán thất bại');
        }
    },

    sortObject: async (obj) => {
        const sorted = {};
        const str = Object.keys(obj).map(key => encodeURIComponent(key)).sort();

        str.forEach(key => {
            sorted[key] = encodeURIComponent(obj[key]).replace(/%20/g, "+");
        });

        return sorted;
    },

    refund: async (vnp_IpAddr, orderCode, createBy) => {
        const order = await orderRepository.findByCode(orderCode);
        if (!order.payment.method == 'VNPAY' || !order.payment.paid) throw new Error('Phương thức thanh toán không hợp lệ hoặc đơn hàng chưa được thanh toán');

        const discountValue = order.discountValue || 0;

        const date = new Date();

        const vnp_TxnRef = order.code;
        const vnp_TransactionDate =  order.payment.transactionDate;
        const vnp_Amount = (order.totalPrice + order.shipping.fee - discountValue) * 100;
        const vnp_TransactionType = '02';
        const vnp_CreateBy = createBy;

        const currCode = 'VND';

        const vnp_RequestId = moment(date).format('HHmmss');
        const vnp_Version = '2.1.0';
        const vnp_Command = 'refund';
        const vnp_OrderInfo = `Hoan tien GD ma: ${vnp_TxnRef}`;


        const vnp_CreateDate = moment(date).format('YYYYMMDDHHmmss');
        const vnp_TransactionNo = '0';

        const data = [
            vnp_RequestId,
            vnp_Version,
            vnp_Command,
            TMN_CODE,
            vnp_TransactionType,
            vnp_TxnRef,
            vnp_Amount,
            vnp_TransactionNo,
            vnp_TransactionDate,
            vnp_CreateBy,
            vnp_CreateDate,
            vnp_IpAddr,
            vnp_OrderInfo
        ].join('|');

        const hmac = crypto.createHmac('sha512', VNPAY_SECRET_KEY);
        const vnp_SecureHash = hmac.update(Buffer.from(data, 'utf-8')).digest('hex');

        const dataObj = {
            vnp_RequestId,
            vnp_Version,
            vnp_Command,
            vnp_TmnCode: TMN_CODE,
            vnp_TransactionType,
            vnp_TxnRef,
            vnp_Amount,
            vnp_TransactionNo,
            vnp_CreateBy,
            vnp_OrderInfo,
            vnp_TransactionDate,
            vnp_CreateDate,
            vnp_IpAddr,
            vnp_SecureHash
        };

        try {
            const response = await axios.post(VNP_API, dataObj);

            if (response.data.vnp_ResponseCode != '00') throw new Error(response.data.vnp_Message);

            order.payment.refunded = true;
            order.save();

            return response.data;
        } catch (error) {
            throw new Error(error);
        }
    }
};

export default paymentService;