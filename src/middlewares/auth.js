// ** Lib
import jwt from "jsonwebtoken";

// ** Constants
import { authConstant, statusCode } from "../constants/index.js"
import { JWT_ACCESS_KEY } from "../constants/index.js";

// ** Utils
import { response } from "../utils/baseResponse.js";

// ** Configs
import { client } from '../configs/redisConfig.js';

// ** Serviec
import accountService from "../services/account.service.js";

export const verifyAccessToken = async (req, res, next) => {
    try {
        let token = req.header("Authorization");

        if (!token)
            return res
                .status(statusCode.UNAUTHORIZED)
                .json(response.error({
                    code: statusCode.UNAUTHORIZED,
                    message: authConstant.UNAUTHORIZED,
                }));

        if (token.startsWith("Bearer "))
            token = token.slice(7, token.length).trim();

        const payload = jwt.verify(token, JWT_ACCESS_KEY);

        const account = await accountService.findAccountById(payload.id);

        if (account.status.isBlocked) throw new Error(`Tài khoản này đang bị khóa vì lý do: ${account.status.blockReason}`);

        const result = await client.get(`${payload.id}_${payload.exp}`);
        if (result === token) {
            return res.status(statusCode.UNAUTHORIZED).json(
                response.error({
                    code: statusCode.UNAUTHORIZED,
                    message: 'Token is expired',
                })
            );
        }

        req.user = payload;
        next();
    } catch (err) {
        const regex = new RegExp('Tài khoản này đang bị khóa vì lý do: ', 'ui');
        const isMatch = regex.test(err.message);
        let code = statusCode.UNAUTHORIZED;
        if (isMatch) {
            code = statusCode.LOCKED;
        } 
        res.status(code).json(
            response.error({
                code,
                message: err.message,
            })
        );
    }
};

export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(statusCode.FORBIDDEN).json(
                response.error({
                    code: statusCode.FORBIDDEN,
                    message: 'Quyền truy cập bị từ chối',
                })
            );
        }
        next();
    };
}
