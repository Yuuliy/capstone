// ** Service
import orderService from '../services/order.service.js';

// ** Constants
import { statusCode } from "../constants/index.js";

// ** Utils
import { response } from "../utils/baseResponse.js";

const dashBoardController = {
    getRevenueDashboard: async (req, res) => {
        const query = req.query;
        try {
            const data = await orderService.getRevenueDashboard(query);
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

    getTotalProductSelled: async (req, res) => {
        const query = req.query;
        try {
            const data = await orderService.getTotalProductSelled(query);
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

    getOrderStatus: async (req, res) => {
        const query = req.query;
        try {
            const data = await orderService.getOrderStatus(query);
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

    getTopProducts: async (req, res) => {
        const query = req.query;
        try {
            const data = await orderService.getTopProducts(query);
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
    }
}

export default dashBoardController;