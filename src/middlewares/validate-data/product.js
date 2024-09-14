// ** Libs
import { body, query, param } from "express-validator";

// ** Validate
import { validate } from "./validation-request.js";

// ** Helpers
import { message } from "../../utils/message.js";

// ** Constants
import { sortOptions } from "../../constants/query.constant.js";

export const productValidation = {
    body: () =>
        validate([
            body("productName")
                .trim()
                .notEmpty().withMessage(message.required("productName"))
                .matches(/^[a-zA-Z0-9 ]+$/).withMessage(message.specialCharacter("productName"))
                .isLength({ min: 2, max: 40 }).withMessage(message.stringLengthInRange({ min: 2, max: 40 })),

            body("type")
                .trim()
                .notEmpty().withMessage(message.required("type"))
                .isLength({ min: 2, max: 20 }).withMessage(message.stringLengthInRange({ min: 2, max: 20 })),

            body("description")
                .optional()
                .isLength({ min: 2, max: 1000 }).withMessage(message.stringLengthInRange({ min: 2, max: 1000 })),

            body('categoryId')
                .notEmpty().withMessage(message.required("categoryId"))
                .isMongoId().withMessage(message.invalid("categoryId")),

            body("price")
                .notEmpty().withMessage(message.required("price"))
                .isNumeric().withMessage(message.invalid("price"))
                .custom(value => value > 0).withMessage(message.mustBeNumberAndGreaterThan("price", 0)),

            body("colourVariant")
                .notEmpty().withMessage(message.required("colourVariant"))
                .custom((value) => {
                    let colourVariant;
                    try {
                        colourVariant = JSON.parse(value);
                    } catch (e) {
                        throw new Error('colourVariant không hợp lệ');
                    }

                    const { sizeMetrics, hex } = colourVariant;

                    if (!Array.isArray(sizeMetrics) || sizeMetrics.length === 0) {
                        throw new Error(message.required('sizeMetrics'));
                    }

                    const sizes = sizeMetrics.map(item => item.size);
                    const uniqueSizes = new Set(sizes);

                    const allSizesInRange = sizes.every(size => size >= 34 && size <= 43);
                    const allSizesUnique = sizes.length === uniqueSizes.size;
                    const allQuantitiesValid = sizeMetrics.every(item => item.quantity > 0);

                    if (!allSizesInRange) {
                        throw new Error(message.mustBeOneOfAndNotDuplicated({ field: 'size', values: [34, 35, 36, 37, 38, 39, 40, 41, 42, 43] }));
                    }

                    if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex)) {
                        throw new Error(message.isHexColor('hex'));
                    }

                    if (!allSizesUnique) {
                        throw new Error('Size phải là duy nhất');
                    }

                    if (!allQuantitiesValid) {
                        throw new Error(message.mustBeNumberAndGreaterThan('quantity', 0));
                    }

                    return true;
                }),
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

            query("minPrice")
                .optional()
                .isNumeric().withMessage(message.invalid("minPrice"))
                .custom(value => value >= 0).withMessage(message.mustBeNumberAndGreaterOrEqualThan("minPrice", 0)),

            query("maxPrice")
                .optional()
                .isNumeric().withMessage(message.invalid("maxPrice"))
                .custom(value => value > 0).withMessage(message.mustBeNumberAndGreaterThan("maxPrice", 0)),

            query("minPrice")
                .optional()
                .custom((value, { req }) => {
                    const minPrice = parseFloat(value);
                    const maxPrice = parseFloat(req.query.maxPrice);

                    if (isNaN(minPrice)) {
                        throw new Error(message.invalid("minPrice"));
                    }

                    if (req.query.maxPrice !== undefined && isNaN(maxPrice)) {
                        throw new Error(message.invalid("maxPrice"));
                    }

                    if (req.query.maxPrice !== undefined && minPrice > maxPrice) {
                        throw new Error(message.mustBeLessThan("minPrice", "maxPrice"));
                    }

                    return true;
                }),

            query("priceSort")
                .optional()
                .isIn([sortOptions.ASC, sortOptions.DESC]).withMessage(message.mustBeOneOf({ field: "priceSort", values: [sortOptions.ASC, sortOptions.DESC] })),
        ]),

    checkStock: () =>
        validate([
            query("productCode")
                .notEmpty().withMessage(message.required("productCode"))
                .isString().withMessage(message.invalid("productCode")),

            query("size")
                .notEmpty().withMessage(message.required("size"))
                .isNumeric().withMessage(message.invalid("size"))
                .custom(value => value >= 34 && value <= 43).withMessage(message.mustBeOneOf({ field: "size", values: [34, 35, 36, 37, 38, 39, 40, 41, 42, 43] })),

            query("quantity")
                .notEmpty().withMessage(message.required("quantity"))
                .isNumeric().withMessage(message.invalid("quantity"))
                .custom(value => value > 0).withMessage(message.mustBeNumberAndGreaterThan("quantity", 0)),
        ]),

};