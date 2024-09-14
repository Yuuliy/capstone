// ** Libs
import express from 'express';

// ** Controller
import dashBoardController from '../../controllers/dashboard.controller.js';

// ** Middleware
import { dashboardValidation } from '../../middlewares/validate-data/dashboard.js';
import { authorizeRoles } from "../../middlewares/auth.js";

// ** Constants
import { ROLE } from "../../constants/model.constant.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Order
 *   description: The Order managing API
 */

/**
 * @swagger
 * /api/dashboard/revenue-dashboard:
 *   get:
 *     summary: revenue dashboard
 *     tags: [Dashboard]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *            type: string
 *            enum: ["WEEK", "YEAR", "DAY"]
 *            example: PENDING
 *       - in: query
 *         name: startDate
 *         schema:
 *            type: number
 *            example: 1720483140000
 *       - in: query
 *         name: endDate
 *         schema:
 *            type: number
 *            example: 1721001540000
 *     responses:
 *       200:
 *         description: Order dashboard
 *         content:
 *           application/json:
 *              schema:
 *                 type: object
 *                 properties:
 *                    isSuccess:
 *                    type: boolean
 *                 statusCode:
 *                    type: number
 *                    example: 200
 *                 data:
 *                    type: array
 *                    items:
 *                       type: number
 *              example:
 *                  isSuccess: true
 *                  statusCode: 200
 *                  data:
 *                      dashboard:
 *                          - 1
 *                          - 2
 *                          - 3
 *                          - 4
 *                          - 5
 *                          - 6
 *                          - 7
 *                      total: 2000000
*/
router.get('/revenue-dashboard', authorizeRoles(ROLE.SHOP_OWNER, ROLE.ADMIN, ROLE.STAFF, ROLE.WAREHOUSE_MANAGER), dashboardValidation.revenueDashboard(), dashBoardController.getRevenueDashboard);


/**
 * @swagger
 * /api/dashboard/total-product-selled:
 *   get:
 *     summary: Total product selled
 *     tags: [Dashboard]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *            type: number
 *            example: 1720483140000
 *       - in: query
 *         name: endDate
 *         schema:
 *            type: number
 *            example: 1721001540000
 *     responses:
 *       200:
 *         description: Order dashboard
 *         content:
 *           application/json:
 *              schema:
 *                 type: object
 *                 properties:
 *                    isSuccess:
 *                    type: boolean
 *                 statusCode:
 *                    type: number
 *                    example: 200
 *                 data:
 *                    type: array
 *                    items:
 *                       type: number
 *              example:
 *                  isSuccess: true
 *                  statusCode: 200
 *                  data: 200
*/
router.get('/total-product-selled', authorizeRoles(ROLE.SHOP_OWNER, ROLE.ADMIN, ROLE.STAFF, ROLE.WAREHOUSE_MANAGER), dashboardValidation.revenueDashboard(), dashBoardController.getTotalProductSelled);

/**
 * @swagger
 * /api/dashboard/order-status:
 *   get:
 *     summary: Order status
 *     tags: [Dashboard]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *            type: number
 *            example: 1720483140000
 *       - in: query
 *         name: endDate
 *         schema:
 *            type: number
 *            example: 1721001540000
 *     responses:
 *       200:
 *         description: Order dashboard
 *         content:
 *           application/json:
 *              schema:
 *                 type: object
 *                 properties:
 *                    isSuccess:
 *                    type: boolean
 *                 statusCode:
 *                    type: number
 *                    example: 200
 *                 data:
 *                    type: array
 *                    items:
 *                       type: number
 *              example:
 *                  isSuccess: true
 *                  statusCode: 200
 *                  data: 
 *                     totalOrder: 21
 *                     orderStatus:
 *                         - status: "PENDING"
 *                           amount: 10
 *                         - status: "PROCESSING"
 *                           amount: 10
 *                         - status: "DELIVERING"
 *                           amount: 10
 *                         - status: "DELIVERED"
 *                           amount: 10
 *                         - status: "CANCELLED"
 *                           amount: 10
*/
router.get('/order-status', authorizeRoles(ROLE.SHOP_OWNER, ROLE.ADMIN, ROLE.STAFF, ROLE.WAREHOUSE_MANAGER), dashboardValidation.revenueDashboard(), dashBoardController.getOrderStatus);


/**
 * @swagger
 * /api/dashboard/top-products:
 *   get:
 *     summary: Top 10 Product
 *     tags: [Dashboard]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *            type: number
 *            example: 1720483140000
 *       - in: query
 *         name: endDate
 *         schema:
 *            type: number
 *            example: 1721001540000
 *     responses:
 *       200:
 *         description: Order dashboard
 *         content:
 *           application/json:
 *              schema:
 *                 type: object
 *                 properties:
 *                    isSuccess:
 *                    type: boolean
 *                 statusCode:
 *                    type: number
 *                    example: 200
 *                 data:
 *                    type: array
 *                    items:
 *                       type: number
 *              example:
 *                  isSuccess: true
 *                  statusCode: 200
 *                  data: 
 *                     - productCode: AKS1NJK12
 *                       displayName: Vintage VINTAS MISTER NE - High Top
 *                       image: https://firebasestorage.googleapis.com/v0/b/social-media-33aea.appspot.com/o/TOSE27VE23%2F668b4f03b284ceabc2eccab2?alt=media&token=9491ca73-fdfc-4f8e-89c2-54613dafc198
 *                       quantity: 10
*/
router.get('/top-products', authorizeRoles(ROLE.SHOP_OWNER, ROLE.ADMIN, ROLE.STAFF, ROLE.WAREHOUSE_MANAGER), dashboardValidation.revenueDashboard(), dashBoardController.getTopProducts);
export default router;