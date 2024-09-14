// ** Libs
import express from 'express';

// ** Controller
import cateController from '../../controllers/category.controller.js';

// ** Validation
import { categoryValidation } from '../../middlewares/validate-data/category.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required: []
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
 * /api/public/category/list-active:
 *   get:
 *     summary: Get all active categories
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
 *         description: All active categories
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
router.get('/list-active', categoryValidation.list() ,cateController.searchActivePagination);

/**
 * @swagger
 * /api/public/category/get-for-filter:
 *   get:
 *     summary: Get actice category for product filter
 *     tags: [Category]
 *     responses:
 *       200:
 *         description: Get user's cart
 *         content:
 *           application/json:
 *             schema:
 *                 type: array
 *                 items: 
 *                     type: Object
 *                     properties:
 *                         _id:
 *                           type: string 
 *                         name:
 *                           type: string 
 *             example:
 *                   - _id: 945h34r9h.....
 *                     name: Old School
 *                   - _id: 94fsdfd9h.....
 *                     name: New School                 
 */
router.get('/get-for-filter', cateController.getAll);

/**
 * @swagger
 * /api/public/category/{id}:
 *   get:
 *     summary: Get Category by ID
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
 *         description: Category details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 */
router.get('/:id', cateController.getById);

export default router;