// ** Lib
import express from 'express';

// ** Controller
import cartController from '../../controllers/cart.controller.js';

// **Middleware
import { cartValidation } from '../../middlewares/validate-data/cart.js';

const router = express.Router();

/**
 * @swagger
 * /api/public/cart/checkProduct:
 *   post:
 *     summary: Check product in cart
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
 *         description: Check product in cart
 *         content:
 *           application/json:
 *             schema:
 *                  $ref: '#/components/schemas/Cart'
 */
router.post('/checkProduct', cartController.checkCartInStock);

export default router;