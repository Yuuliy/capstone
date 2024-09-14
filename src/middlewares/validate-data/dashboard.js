// ** Libs
import { body, query } from "express-validator";

// ** Validate
import { validate } from "./validation-request.js";

// ** Helpers
import { message } from "../../utils/message.js";

// ** Constants
import { TIME_TYPE } from "../../services/order.service.js";

export const dashboardValidation = {
    revenueDashboard: () =>
        validate([
            query("type")
                .optional()
                .isIn([TIME_TYPE.WEEK, TIME_TYPE.YEAR, TIME_TYPE.DAY]).withMessage(message.mustBeOneOf({ field: "type", values: [TIME_TYPE.WEEK, TIME_TYPE.YEAR, TIME_TYPE.DAY] })),

            query("startDate")
                .optional()
                .isNumeric().withMessage(message.invalid("startDate"))
                .custom(value => value > 0).withMessage(message.mustBeNumberAndGreaterThan("startDate", 0)),

            query("startDate")
                .optional()
                .isNumeric().withMessage(message.invalid("startDate"))
                .custom(value => value > 0).withMessage(message.mustBeNumberAndGreaterThan("startDate", 0)),
        ]),
};
