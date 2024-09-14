// ** Service
import userService from "../services/user.service.js";

// ** Constants
import { statusCode } from "../constants/index.js";

// ** Utils
import { response } from "../utils/baseResponse.js";

const userController = {
    getProfile: async (req, res) => {
        const { user } = req;
        try {
            const userInfo = await userService.getProfile(user.id);
            if (userInfo.user.isBlocked) {
                throw new Error(`Tài khoản này đang bị khóa vì lý do: ${account.status.blockReason}`);
            }
            res.status(statusCode.OK).json(response.success(
                {
                    data: userInfo,
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

    updateProfile: async (req, res) => {
        const accountId = req.user.id;
        const data = req.body;
        try {
            const userInfo = await userService.updateProfile(accountId, data);
            if (userInfo.status.isBlocked) {
                throw new Error(`Tài khoản này đang bị khóa vì lý do: ${account.status.blockReason}`);
            }
            res.status(statusCode.OK).json(response.success(
                {
                    data: userInfo,
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

    createDeliveryAddress: async (req, res) => {
        const { user } = req;
        const address = req.body;
        try {
            const result = await userService.createDeliveryAddress(user.id, address);
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
            ));
        }
    },


    updateDeliveryAddress: async (req, res) => {
        const { user } = req;
        const { addressId } = req.params;
        const address = req.body;

        try {
            const result = await userService.updateDeliveryAddress(user.id, addressId, address);
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
            ));
        }
    },

    getMyAddresses: async (req, res) => {
        const { user } = req;
        try {
            const result = await userService.getUserDeliveryAddress(user.id);
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
            ));
        }
    },

    deleteDeliveryAddress: async (req, res) => {
        const { user } = req;
        const { addressId } = req.params;
        try {
            const result = await userService.deleteDeliveryAddress(user.id, addressId);
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
            ));
        }
    }
};

export default userController;