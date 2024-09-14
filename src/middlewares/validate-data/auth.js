// ** Libs
import { body } from "express-validator";

// ** Validate
import { validate } from "./validation-request.js";

// ** Helpers
import { message } from "../../utils/message.js";

export const authValidation = {
    register: () =>
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

            body("phone")
                .optional()
                .isMobilePhone("vi-VN").withMessage(message.invalid("số điện thoại")), // validate số điện thoại

            body("firstName")
                .optional()
                .notEmpty().withMessage(message.required("firstName"))
                .isLength({ min: 2, max: 15 }).withMessage(message.stringLengthInRange({ min: 2, max: 15 })),

            body("lastName")
                .optional()
                .notEmpty().withMessage(message.required("lastName"))
                .isLength({ min: 2, max: 15 }).withMessage(message.stringLengthInRange({ min: 2, max: 15 })),
        ]),

    login: () =>
        validate([
            body("username")
                .notEmpty()
                .withMessage(message.required("username"))
                .matches(/^\S+$/).withMessage(message.noSpace("username")),

            body("password")
                .notEmpty()
                .withMessage(message.required("password"))
                .isLength({ min: 6, max: 30 })
                .withMessage(message.stringLengthInRange({ min: 6, max: 30 }))
                .matches(/^\S+$/).withMessage(message.noSpace("password")),
        ]),

    // changePassword: () =>
    //     validate([
    //         body("currentPassword")
    //             .notEmpty()
    //             .withMessage(message.required("currentPassword")),
    //         body("newPassword")
    //             .notEmpty()
    //             .withMessage(message.required("newPassword"))
    //             .isLength({ min: 6, max: 30 })
    //             .withMessage(message.stringLengthInRange({ min: 6, max: 30 })),
    //     ]),
};