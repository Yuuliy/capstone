// ** Libs
import { body } from "express-validator";

// ** Validate
import { validate } from "./validation-request.js";

// ** Helpers
import { message } from "../../utils/message.js";

export const cartValidation = {
    add: () =>
        validate([
            body("items")
                .isArray().withMessage(message.mustBeArray("items"))
                .custom(value => value.every(item => item.productCode && item.size && item.quantity)).withMessage(message.required("productCode, size, quantity"))
                .custom(value => value.every(item => item.size >= 34 && item.size <= 43)).withMessage(message.mustBeOneOfAndNotDuplicated({ field: "size", values: [34, 35, 36, 37, 38, 39, 40, 41, 42, 43] }))
                .custom(value => value.every(item => item.quantity > 0)).withMessage(message.mustBeNumberAndGreaterThan("quantity", 0)),
        ]),

    remove: () =>
        validate([
            body("productCode")
                .trim()
                .notEmpty().withMessage(message.required("productCode")),

            body("size")
                .notEmpty().withMessage(message.required("size"))
                .isNumeric().withMessage(message.invalid("size"))
                .custom(value => value >= 34 && value <= 43).withMessage(message.mustBeOneOfAndNotDuplicated({ field: "oldSize", values: [34, 35, 36, 37, 38, 39, 40, 41, 42, 43] })),
        ]),

    update: () =>
        validate([
            body("productCode")
                .trim()
                .notEmpty().withMessage(message.required("productCode")),

            body("oldSize")
                .notEmpty().withMessage(message.required("oldSize"))
                .isNumeric().withMessage(message.invalid("oldSize"))
                .custom(value => value >= 34 && value <= 43).withMessage(message.mustBeOneOfAndNotDuplicated({ field: "oldSize", values: [34, 35, 36, 37, 38, 39, 40, 41, 42, 43] })),

            body("newSize")
                .notEmpty().withMessage(message.required("newSize"))
                .isNumeric().withMessage(message.invalid("newSize"))
                .custom(value => value >= 34 && value <= 43).withMessage(message.mustBeOneOfAndNotDuplicated({ field: "newSize", values: [34, 35, 36, 37, 38, 39, 40, 41, 42, 43] })),

            body("oldQuantity")
                .notEmpty().withMessage(message.required("oldQuantity"))
                .isNumeric().withMessage(message.invalid("oldQuantity"))
                .custom(value => value > 0).withMessage(message.mustBeNumberAndGreaterThan("newQuantity", 0)),

            body("newQuantity")
                .notEmpty().withMessage(message.required("newQuantity"))
                .isNumeric().withMessage(message.invalid("newQuantity"))
                .custom(value => value > 0).withMessage(message.mustBeNumberAndGreaterThan("newQuantity", 0)),

        ]),
};