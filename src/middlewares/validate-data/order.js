// ** Libs
import { body, query } from "express-validator";

// ** Validate
import { validate } from "./validation-request.js";

// ** Helpers
import { message } from "../../utils/message.js";

// ** Constants
import { sortOptions } from "../../constants/query.constant.js";
import { ORDER_STATUS } from "../../constants/model.constant.js";
import { PAYMENT_METHOD } from "../../constants/order.constant.js";
import { TIME_TYPE } from "../../services/order.service.js";

export const orderValidation = {
    create: () =>
        validate([
            body('items')
                .notEmpty().withMessage(message.required("items"))
                .isArray().withMessage(message.invalid("items"))
                .custom(value => value.length > 0).withMessage(message.arrayCannotEmpty("items", 0)),

            body("receiverName")
                .trim()
                .notEmpty().withMessage(message.required("receiverName")),

            body("receiverPhone")
                .trim()
                .notEmpty().withMessage(message.required("receiverPhone"))
                .isMobilePhone('vi-VN').withMessage(message.invalid("receiverPhone")),

            body("deliveryAddress")
                .notEmpty().withMessage(message.required("deliveryAddress"))
                .isObject().withMessage(message.invalid("deliveryAddress"))
                .custom(value => value.address).withMessage(message.required("address"))
                .custom(value => value.province).withMessage(message.required("province"))
                .custom(value => value.district).withMessage(message.required("district"))
                .custom(value => value.ward).withMessage(message.required("ward")),

            body("paymentMethod")
                .notEmpty().withMessage(message.required("paymentMethod"))
                .isIn(['COD', 'VNPAY']).withMessage(message.mustBeOneOf({ field: "paymentMethod", values: ['COD', 'VNPAY'] })),

            body("shipping")
                .isObject().withMessage(message.invalid("shipping"))
                .custom(value => {
                    if (typeof value.method !== 'boolean') {
                        throw new Error(message.invalid("method"));
                    }
                    return true;
                })
                .custom(value => value.fee).withMessage(message.required("fee")),

            body("totalPrice")
                .notEmpty().withMessage(message.required("totalPrice"))
                .isNumeric().withMessage(message.invalid("totalPrice"))
                .custom(value => value >= 0).withMessage(message.mustBeNumberAndGreaterThan("totalPrice", 0))
        ]),

    post: () =>
        validate([
            body("orderCode")
                .trim()
                .notEmpty().withMessage(message.required("orderCode")),

            body("email")
                .trim()
                .notEmpty().withMessage(message.required("email"))
                .isEmail().withMessage(message.invalid("email"))
                .matches(/^\S+$/).withMessage(message.noSpace("email")),

            body("receiverName")
                .trim()
                .notEmpty().withMessage(message.required("receiverName")),

            body("receiverPhone")
                .trim()
                .notEmpty().withMessage(message.required("receiverPhone"))
                .isMobilePhone('vi-VN').withMessage(message.invalid("receiverPhone")),

            body("deliveryAddress")
                .notEmpty().withMessage(message.required("deliveryAddress"))
                .isObject().withMessage(message.invalid("deliveryAddress"))
                .custom(value => value.address).withMessage(message.required("address"))
                .custom(value => value.provice).withMessage(message.required("city"))
                .custom(value => value.district).withMessage(message.required("district"))
                .custom(value => value.ward).withMessage(message.required("ward")),

            body("paymentMethod")
                .notEmpty().withMessage(message.required("paymentMethod"))
                .isIn(['COD', 'VNPAY']).withMessage(message.mustBeOneOf({ field: "paymentMethod", values: ['COD', 'VNPAY'] })),

            body("totalPrice")
                .notEmpty().withMessage(message.required("totalPrice"))
                .isNumeric().withMessage(message.invalid("totalPrice"))
                .custom(value => value >= 0).withMessage(message.mustBeNumberAndGreaterThan("totalPrice", 0))
        ]),

    cancel: () =>
        validate([
            body("reason")
                .trim()
                .notEmpty().withMessage(message.required("reason"))
                .isLength({ min: 10, max: 100 }).withMessage(message.stringLengthInRange({ min: 10, max: 100 })),
        ]),

    changeStatus: () =>
        validate([
            body("status")
                .trim()
                .notEmpty().withMessage(message.required("status"))
                .isIn([ORDER_STATUS.PENDING, ORDER_STATUS.PROCESSING, ORDER_STATUS.DELIVERING, ORDER_STATUS.DELIVERED, ORDER_STATUS.CANCELLED]).withMessage(message.mustBeOneOf({ field: "status", values: [ORDER_STATUS.PENDING, ORDER_STATUS.PROCESSING, ORDER_STATUS.DELIVERING, ORDER_STATUS.DELIVERED, ORDER_STATUS.CANCELLED] })),
        ]),

    query: () =>
        validate([
            query("page")
                .optional()
                .isNumeric().withMessage(message.invalid("page"))
                .custom(value => value > 0).withMessage(message.mustBeNumberAndGreaterThan("page", 0)),

            query("size")
                .optional()
                .isNumeric().withMessage(message.invalid("size"))
                .custom(value => value > 0).withMessage(message.mustBeNumberAndGreaterThan("size", 0)),

            query("payment")
                .optional()
                .isIn([PAYMENT_METHOD.COD, PAYMENT_METHOD.VNPAY]).withMessage(message.mustBeOneOf({ field: "payment", values: [PAYMENT_METHOD.COD, PAYMENT_METHOD.VNPAY] })),

            query("status")
                .optional()
                .isIn(
                    [ORDER_STATUS.PENDING, ORDER_STATUS.PROCESSING, ORDER_STATUS.DELIVERING, ORDER_STATUS.DELIVERED, ORDER_STATUS.CANCELLED, ORDER_STATUS.DELIVERY_FAILED, ORDER_STATUS.RETURNING, ORDER_STATUS.RETURNED]
                )
                .withMessage(
                    message.mustBeOneOf(
                        {
                            field: "status", values: [ORDER_STATUS.PENDING, ORDER_STATUS.PROCESSING, ORDER_STATUS.DELIVERING, ORDER_STATUS.DELIVERED, ORDER_STATUS.CANCELLED, ORDER_STATUS.DELIVERY_FAILED, ORDER_STATUS.RETURNING, ORDER_STATUS.RETURNED]
                        }
                    )
                ),

            query("priceSort")
                .optional()
                .isIn([sortOptions.ASC, sortOptions.DESC]).withMessage(message.mustBeOneOf({ field: "priceSort", values: [sortOptions.ASC, sortOptions.DESC] })),

            query("startDate")
                .optional()
                .isNumeric().withMessage(message.invalid("startDate"))
                .custom(value => value > 0).withMessage(message.mustBeNumberAndGreaterThan("startDate", 0)),

            query("endDate")
                .optional()
                .isNumeric().withMessage(message.invalid("endDate"))
                .custom(value => value > 0).withMessage(message.mustBeNumberAndGreaterThan("endDate", 0))
                .custom((value, { req }) => {
                    const startDate = parseInt(req.query.startDate);
                    const endDate = parseInt(value);
                    if (startDate && endDate && endDate <= startDate) {
                        throw new Error('endDate must be greater than startDate');
                    }
                    return true;
                }).withMessage(message.mustBeNumberAndGreaterThan("endDate", "startDate")),
        ]),
};