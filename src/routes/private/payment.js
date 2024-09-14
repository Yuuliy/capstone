// ** Lib
import express from 'express';

// ** Controller
import paymentController from '../../controllers/payment.controller.js';
import { authorizeRoles } from "../../middlewares/auth.js";

// ** Constants
import { ROLE } from "../../constants/model.constant.js";

const router = express.Router();

// /**
//  * @swagger
//  * /api/payment/refund:
//  *   post:
//  *     summary: Refund
//  *     tags: [Payment]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               orderCode: 
//  *                 type: string
//  *                 example: Bitis Hunter X
//  *     responses:
//  *       200:
//  *         description: Create new product
//  *         content:
//  *           application/json:
//  *             schema:
//  */
router.post('/refund', authorizeRoles(ROLE.SHOP_OWNER, ROLE.STAFF), paymentController.refund);

export default router;