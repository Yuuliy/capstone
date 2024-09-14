// ** Lib
import express from 'express';

// ** Controller
import cartController from '../../controllers/cart.controller.js';

// **Middleware
import { cartValidation } from '../../middlewares/validate-data/cart.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Cart:
 *       type: object
 *       properties:
 *         isSuccess:
 *           type: boolean
 *           example: true
 *         statusCode:
 *           type: number
 *           example: 200
 *         data:
 *           type: object
 *           properties:
 *             items:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   productCode:
 *                     type: string
 *                     example: "JQKZCRGRON"
 *                   image:
 *                     type: string
 *                     example: "https://product.hstatic.net/1000230642/product/hsm004401den1_58f0020cd4314e309c76dcdd2621ee82.jpg"
 *                   price:
 *                     type: number
 *                     example: 200000
 *                   quantity:
 *                     type: number
 *                     example: 1
 *                   size:
 *                     type: number
 *                     example: 41
 *                   sizeMetrics:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         size:
 *                           type: number
 *                           example: 41
 *                         isAvailable:
 *                           type: boolean
 *                           example: true
 *                   isHide:
 *                     type: boolean
 *                     example: false
 *             totalPrice:
 *               type: number
 *               example: 200000
 */


/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: The Cart managing API
 */

/**
 * @swagger
 * /api/cart/add:
 *   post:
 *     summary: Add to cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                  type: array
 *                  items:
 *                      type: object
 *                      properties:
 *                          productCode:
 *                            type: string
 *                          size:
 *                            type: number
 *                          quantity:
 *                            type: number
 *           example:
 *                  items:
 *                     - productCode: "JQKZCRGRON"
 *                       size: 41
 *                       quantity: 1
 *     responses:
 *       200:
 *         description: Add to cart
 *         content:
 *           application/json:
 *             schema:
 *                  $ref: '#/components/schemas/Cart'
 */
router.post('/add', cartValidation.add() , cartController.addToCart);

/**
 * @swagger
 * /api/cart/get:
 *   get:
 *     summary: Get user's cart
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: Get user's cart
 *         content:
 *           application/json:
 *             schema:
 *                 $ref: '#/components/schemas/Cart'
 */
router.get('/get', cartController.getCart);

/**
 * @swagger
 * /api/cart/removeItem:
 *   patch:
 *     summary: Remove item from cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productCode:
 *                 type: string
 *                 example: "JQKZCRGRON"
 *               size:
 *                 type: number
 *                 example: 41
 *           example:
 *             productCode: "JQKZCRGRON"
 *             size: 41
 *     responses:
 *       200:
 *         description: Add to cart
 *         content:
 *           application/json:
 *             schema:
 *                  $ref: '#/components/schemas/Cart'
 */
router.patch('/removeItem', cartValidation.remove() ,cartController.removeItem);

/**
 * @swagger
 * /api/cart/updateItem:
 *   put:
 *     summary: Update item in cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productCode:
 *                 type: string
 *               oldSize:
 *                 type: number
 *               newSize:
 *                 type: number
 *               oldQuantity:
 *                 type: number
 *               newQuantity:
 *                 type: number
 *           example:
 *             productCode: "JQKZCRGRON"
 *             oldSize: 41
 *             newSize: 42
 *             oldQuantity: 1
 *             newQuantity: 2
 *     responses:
 *       200:
 *         description: Update item in cart
 *         content:
 *           application/json:
 *             schema:
 *                  $ref: '#/components/schemas/Cart'
 */
router.put('/updateItem', cartValidation.update() ,cartController.updateItem);

export default router;