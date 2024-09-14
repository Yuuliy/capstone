//** Express
import express from 'express';

//** Controller
import cateController from '../../controllers/category.controller.js';

// ** Validation
import { categoryValidation } from '../../middlewares/validate-data/category.js';
import { authorizeRoles } from "../../middlewares/auth.js";

// ** Constants
import { ROLE } from "../../constants/model.constant.js";
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         isSuccess:
 *           type: boolean
 *         statusCode:
 *           type: number
 *         data:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               example: Vintage
 *             description:
 *               type: string
 *               example: This is a description
 *             isHide:
 *               type: boolean
 *               default: false
 *       example:
 *         isSuccess: true
 *         statusCode: 200
 *         data:
 *           name: Vintage
 *           description: This is a description
 *           isHide: false
 */

/** 
 * @swagger
 * tags:
 *   name: Category
 *   description: The Category managing API
 */

/** 
 * @swagger
 * /api/category:
 *   post:
 *     summary: Create a new Category
 *     tags: [Category]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               isHide:
 *                 type: boolean
 *           example:
 *             name: vintage
 *             description: This is a description
 *             isHide: false
 *     responses:
 *       200:
 *         description: Create Category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isSuccess:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: vintage
 *                     description:
 *                       type: string
 *                       example: This is a description
 *                     isHide:
 *                       type: boolean
 *                       example: false
 */

router.post('/', authorizeRoles(ROLE.SHOP_OWNER, ROLE.WAREHOUSE_MANAGER), categoryValidation.create(), cateController.create)


/** 
 * @swagger
 * /api/category/{id}:
 *   put:
 *     summary: Update category
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               isHide:
 *                 type: boolean
 *           example:
 *             name: vintage
 *             description: This is a description
 *             isHide: false
 *     responses:
 *       200:
 *         description: Update Category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isSuccess:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: vintage
 *                     description:
 *                       type: string
 *                       example: This is a description
 *                     isHide:
 *                       type: boolean
 *                       example: false
 */
router.put('/:id', authorizeRoles(ROLE.SHOP_OWNER, ROLE.WAREHOUSE_MANAGER), categoryValidation.update(), cateController.update)


/** 
 * @swagger
 * /api/category/change-status/{id}:
 *   put:
 *     summary: Change status of category
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The category ID
 *     responses:
 *       200:
 *         description: Change status of Category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isSuccess:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: vintage
 *                     description:
 *                       type: string
 *                       example: This is a description
 *                     isHide:
 *                       type: boolean
 *                       example: false
 */
router.put('/change-status/:id', authorizeRoles(ROLE.SHOP_OWNER, ROLE.WAREHOUSE_MANAGER), cateController.changeStatus)

/**
 * @swagger
 * /api/category/list-dashboard:
 *   get:
 *     summary: Get all existing categories
 *     tags: [Category]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         required: false
 *         description: Name of the category to search for
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         required: false
 *         description: Page number for pagination
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *           example: 10
 *         required: false
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: All existing categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isSuccess:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: vintage
 *                           description:
 *                             type: string
 *                             example: This is a description
 *                           isHide:
 *                             type: boolean
 *                             example: false
 *                     totalDocument:
 *                       type: integer
 *                       example: 15
 *                     totalPage:
 *                       type: integer
 *                       example: 5
 *                     activePage:
 *                       type: integer
 *                       example: 1
 */
router.get('/list-dashboard', authorizeRoles(ROLE.SHOP_OWNER, ROLE.WAREHOUSE_MANAGER, ROLE.STAFF), categoryValidation.list(), cateController.searchAndPaginate);

export default router