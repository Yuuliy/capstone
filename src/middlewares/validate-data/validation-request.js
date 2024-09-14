// ** Libs
import { validationResult } from "express-validator";

// ** Utils
import { response } from "../../utils/baseResponse.js";

// ** Constants
import { statusCode } from "../../constants/index.js";

export const validate = (validations = []) => {
  return async (req, res, next) => {
    for (let validation of validations) {
      const result = await validation.run(req);
      if (result.errors.length) break;
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const errMessage = {};

    errors.array().forEach((error) => {
      errMessage[error.path] = error.msg;
    });


    res.status(statusCode.BAD_REQUEST).json(
      response.error({
        message: errors.array(),
        code: statusCode.BAD_REQUEST,
      })
    );
  };
};
