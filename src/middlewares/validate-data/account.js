// ** Libs
import { body } from "express-validator";

// ** Validate
import { validate } from "./validation-request.js";

// ** Helpers
import { message } from "../../utils/message.js";
import { ROLE } from "../../constants/model.constant.js";

export const accountValidation = {
    assign: () =>
        validate([
            body("username")
                .trim()
                .notEmpty().withMessage(message.required("username"))
                .isLength({ min: 6, max: 30 }).withMessage(message.stringLengthInRange({ min: 6, max: 30 }))
                .matches(/^\S+$/).withMessage(message.noSpace("username")),

            body("email")
                .trim()
                .notEmpty().withMessage(message.required("email"))
                .isEmail().withMessage(message.invalid("email"))
                .matches(/^\S+$/).withMessage(message.noSpace("email")),

            // validate tối thiểu 8 kí tự, ít nhất 1 chữ hoa 1 chữ thường
            body("password")
                .notEmpty().withMessage(message.required("password"))
                .isLength({ min: 8, max: 30 }).withMessage(message.stringLengthInRange({ min: 8, max: 30 }))
                .matches(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/).withMessage('Mật khẩu của bạn phải chứa ít nhất một chữ cái viết hoa, một số và một ký tự đặc biệt')
                .matches(/^\S+$/).withMessage(message.noSpace("password")),
        ]),

    editRole: () =>
        validate([
            body("role")
                .trim()
                .notEmpty().withMessage(message.required("role"))
                .custom((value) => { // Custom validator for role
                    const allowedRoles = [ROLE.ADMIN, ROLE.WAREHOUSE_MANAGER, ROLE.STAFF];
                    if (!allowedRoles.includes(value)) {
                        throw new Error(message.invalid("role")); // Use a specific error message
                    }
                    return value;
                }),
        ]),
};