// ** Service
import orderService from '../services/order.service.js';

// ** Constants
import { statusCode } from "../constants/index.js";
import { ROLE } from '../constants/model.constant.js';

// ** Utils
import { response } from "../utils/baseResponse.js";

const orderController = {
    createOrder: async (req, res) => {
        try {
            const id = req.user.id;
            const order = req.body;
            const result = await orderService.createOrder(order, id);
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

    guestCreateOrder: async (req, res) => {
        try {
            const order = req.body;
            const result = await orderService.createGuestOrder(order);
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

    postOrder: async (req, res) => {
        try {
            const id = req.user.id;
            const orderCode = req.body.code;
            const result = await orderService.postOrder(orderCode, id);
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

    getMyOrder: async (req, res) => {
        try {
            const { page, size, code, status } = req.query;
            const { id } = req.user;
            const result = await orderService.getMyOrder(id, page, size, code, status);
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

    getOrderDashboard: async (req, res) => {
        try {
            const { page, size, code, status, address, payment, priceSort, startDate, endDate } = req.query;
            const result = await orderService.getAllOrder(page, size, code, status, address, payment, priceSort, startDate, endDate);
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

    getOrderDetail: async (req, res) => {
        try {
            const { code } = req.params;
            const result = await orderService.getOrderDetail(code);
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

    changeDeliveryAddress: async (req, res) => {
        try {
            const { id } = req.user;
            const data = req.body;
            const result = await orderService.changeDeliveryAddress(id, data);
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

    cancelOrder: async (req, res) => {
        try {
            const { id, role } = req.user;
            const { code } = req.params;
            const { reason } = req.body;
            const vnp_IpAddr = req.headers['x-forwarded-for'] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                req.connection.socket.remoteAddress;

            let result = {};
            if (role == ROLE.USER) {
                result = await orderService.cancelOrder(id, code, reason, vnp_IpAddr);
            } else {
                result = await orderService.cancelOrderByAdmin(id, code, reason);
            }

            res.status(statusCode.OK).json(response.success(
                {
                    data: `Huỷ đơn hàng ${result.code} thành công`,
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

    getAllProvinces: async (req, res) => {
        const name = req.query.name;
        try {
            const data = await orderService.getAllVnProvinces(name);
            res.status(statusCode.OK).json(response.success(
                {
                    data: data,
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

    getDistrictOfProvince: async (req, res) => {
        try {
            const { provinceId, name } = req.query
            const data = await orderService.getDistrictOfProvince(provinceId, name);
            res.status(statusCode.OK).json(response.success(
                {
                    data: data,
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

    getWardOfDistrict: async (req, res) => {
        try {
            const { district_id, name } = req.query
            const data = await orderService.getWardOfDistrict(district_id, name);
            res.status(statusCode.OK).json(response.success(
                {
                    data: data,
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

    getShippingFee: async (req, res) => {
        try {
            const address = req.body;
            const data = await orderService.getShippingFee(address);
            res.status(statusCode.OK).json(response.success(
                {
                    data: data,
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

    ghtkOrderCallBack: async (req, res) => {
        try {
            const body = req.body;
            await orderService.handleGhtkOrderCallBack(body);
            res.status(statusCode.OK).json(response.success(
                {
                    data: 'OK',
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

export default orderController;
