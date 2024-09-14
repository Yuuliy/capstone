// ** Lib
import express from 'express';

// ** Controller
import paymentController from '../../controllers/payment.controller.js';

const router = express.Router();

router.post('/create-payment-url', paymentController.createPaymentUrl);

router.post('/repayment', paymentController.repayment);

router.get('/vnpay-return', paymentController.vnpayReturn);

export default router;