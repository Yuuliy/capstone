// ** Libs
import { body } from "express-validator";

// ** Validate
import { validate } from "./validation-request.js";

// ** Helpers
import { message } from "../../utils/message.js";

export const userValidation = {
    updateProfile: () =>
        validate([
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

            body("dob")
                .optional()
                .notEmpty().withMessage(message.required("dob"))
                .isInt().withMessage(message.invalid("dob"))
                .custom((value, { req }) => {
                    const dob = new Date(parseInt(value));
                    const now = new Date();

                    
                    if (isNaN(dob.getTime())) {
                        throw new Error(message.invalid("dob"));
                    }
                    
                    if (dob > now) {
                        throw new Error("Ngày sinh nhật không thể lớn hơn ngày hiện tại");
                    }
                    
                    const minAge = 16;
                    const minDate = new Date(now.getFullYear() - minAge, now.getMonth(), now.getDate());
                    if (dob > minDate) {
                        throw new Error(`Bạn phải đủ ${minAge} tuổi`);
                    }
                    
                    const maxAge = 120;
                    const maxDate = new Date(now.getFullYear() - maxAge, now.getMonth(), now.getDate());
                    if (dob < maxDate) {
                        throw new Error(`Bạn không thể lớn hơn ${maxAge} tuổi`);
                    }

                    return true;
                })
        ]),
    
    changePassword: () => validate([
        body("oldPassword")
        .notEmpty().withMessage(message.required("oldPassword"))
        .isLength({ min: 6, max: 30 }).withMessage(message.stringLengthInRange({ min: 6, max: 30 }))
        .matches(/^(?=.*[A-Z])(?=.*[0-9])/).withMessage('Your old password should contain at least one uppercase letter and one number')
        .matches(/^\S+$/).withMessage(message.noSpace("oldPassword")),


        body("newPassword")
        .notEmpty().withMessage(message.required("newPassword"))
        .isLength({ min: 6, max: 30 }).withMessage(message.stringLengthInRange({ min: 6, max: 30 }))
        .matches(/^(?=.*[A-Z])(?=.*[0-9])/).withMessage('Your new password should contain at least one uppercase letter and one number')
        .custom((value, { req }) => {
            if (value === req.body.oldPassword) {
                throw new Error('Mật khẩu mới không được trùng với mật khẩu cũ');
            }
            return true;
        })
        .matches(/^\S+$/).withMessage(message.noSpace("newPassword")),

    ]),

    addDeliveryAddress: () => validate([
        body("fullName")
            .notEmpty().withMessage(message.required("fullName")),

        body("phone")
            .notEmpty().withMessage(message.required("số điện thoại"))
            .isMobilePhone("vi-VN").withMessage(message.invalid("số điện thoại")),

        body("address")
            .notEmpty().withMessage(message.required("address")),

        body("province")
            .notEmpty().withMessage(message.required("province"))
            .custom(value => value.provinceId).withMessage(message.required("provinceId"))
            .custom(value => value.provinceName).withMessage(message.required("provinceName")),

        body("district")
            .notEmpty().withMessage(message.required("district"))
            .custom(value => value.districtId).withMessage(message.required("districtId"))
            .custom(value => value.districtName).withMessage(message.required("districtName")),

        body("ward")
            .notEmpty().withMessage(message.required("ward"))
            .custom(value => value.wardId).withMessage(message.required("wardId"))
            .custom(value => value.wardName).withMessage(message.required("wardName")),

        body("isDefault")
            .optional()
            .isBoolean().withMessage(message.invalid("isDefault")),
    ]),
};