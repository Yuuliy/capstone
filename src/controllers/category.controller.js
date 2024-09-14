// ** Service
import cateService from "../services/category.service.js";

// ** Constants
import { statusCode } from "../constants/index.js";

// ** Utils
import { response } from "../utils/baseResponse.js";

const cateController = {
    getAll: async (req, res) => {
        try {
            const categories = await cateService.getAll();
            res.status(statusCode.OK).json(response.success(
                {
                    data: categories,
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

    getById: async (req, res) => {
        const id = req.params.id;
        try {
            const category = await cateService.getById(id);
            res.status(statusCode.OK).json(response.success(
                {
                    data: category,
                    code: statusCode.OK,
                }
            ));
        } catch (error) {
            res.status(statusCode.BAD_REQUEST).json(response.error(
                {
                    message: error?.message,
                    code: statusCode.BAD_REQUEST
                }
            ))
        }
    },

    create: async (req, res) => {
        const data = req.body
        try {
            const category = await cateService.create(data);
            res.status(statusCode.CREATED).json(response.success(
                {
                    data: category,
                    code: statusCode.CREATED,
                }
            ));
        } catch (error) {
            res.status(statusCode.BAD_REQUEST).json(response.error(
                {
                    message: error?.message,
                    code: statusCode.BAD_REQUEST
                }
            ))
        }
    },

    update: async (req, res) => {
        const data = req.body
        const id = req.params.id
        try {
            const category = await cateService.update(id, data);
            res.status(statusCode.OK).json(response.success(
                {
                    data: category,
                    code: statusCode.OK
                }
            ))
        } catch (error) {
            res.status(statusCode.BAD_REQUEST).json(response.error(
                {
                    message: error?.message,
                    code: statusCode.BAD_REQUEST
                }
            ))
        }
    },

    changeStatus: async (req, res) => {
        const id = req.params.id
        try {
            const category = await cateService.changeStatus(id);
            res.status(statusCode.OK).json(response.success(
                {
                    data: category,
                    code: statusCode.OK
                }
            ))
        } catch (error) {
            res.status(statusCode.BAD_REQUEST).json(response.error(
                {
                    message: error?.message,
                    code: statusCode.BAD_REQUEST
                }
            ))
        }
    },

    //get al existing categories (for admin only)
    searchAndPaginate: async (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const size = parseInt(req.query.size) || 5;
        const name = req.query.name || '';

        try {
            const result = await cateService.searchAndPaginate(page, size, name);
            res.status(statusCode.OK).json(response.success(
                {
                    data: result,
                    code: statusCode.OK
                }
            ))
        } catch (error) {
            res.status(statusCode.BAD_REQUEST).json(response.error(
                {
                    message: error?.message,
                    code: statusCode.BAD_REQUEST
                }
            ))
        }
    },

    searchActivePagination: async (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const size = parseInt(req.query.size) || 10;
        const name = req.query.name || '';

        try {
            const result = await cateService.searchActivePagination(page, size, name);
            res.status(statusCode.OK).json(response.success(
                {
                    data: result,
                    code: statusCode.OK
                }
            ))
        } catch (error) {
            res.status(statusCode.BAD_REQUEST).json(response.error(
                {
                    message: error?.message,
                    code: statusCode.BAD_REQUEST
                }
            ))
        }
    }
}

export default cateController;