// ** Lib
import express from "express";

// ** Controllers
import voucherController from "../../controllers/voucher.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/public/voucher/releaseVoucher:
 *   get:
 *     summary: Get release Voucher list
 *     tags: [Voucher]
 *     parameters:
 *       - in: query
 *         name: maxDiscountValue
 *         schema:
 *           type: number
 *           example: 50000
 *       - in: query
 *         name: minOrderPrice
 *         schema:
 *           type: number
 *           example: 200000
 *     responses:
 *       200:
 *         description: Voucher list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isSuccess:
 *                   type: boolean
 *                 statusCode:
 *                   type: number
 *                 data:
 *                   type: array
 *                   items:
 *                     type: Object
 *                     properties:
 *                      title:
 *                        type: string
 *                        example: Supper sale 7/7
 *                      code:
 *                        type: string
 *                        example: SUPPERSALE77
 *                      description:
 *                        type: string
 *                        exxample: Description for voucher
 *                      discount:
 *                        type: number
 *                        example: 0.5
 *                      minOrderPrice:
 *                        type: number
 *                        example: 200000
 *                      maxDiscountValue:
 *                        type: number
 *                        exxample: 50000
 *                      expiredDate:
 *                        type: number
 *                        example: 1625668800000
 *                      isRelease:
 *                        type: boolean
 *                        example: false
 *                      status:
 *                        type: string
 *                        example: AVAILABLE
 *                      createdAt:
 *                        type: string
 *                        example: 2021-07-07T03:09:15.000Z
 *                      updatedAt:
 *                        type: string
 *                        example: 2021-07-07T03:09:15.000Z
 *               example:
 *                   isSuccess: true
 *                   statusCode: 200
 *                   data:
 *                        - title: Supper sale 7/7
 *                          code: SUPPERSALE77
 *                          description: Description for voucher
 *                          discount: 0.5
 *                          minOrderPrice: 200000
 *                          maxDiscountValue: 50000
 *                          expiredDate: 1625668800000
 *                          isRelease: false
 *                          status: AVAILABLE
 *                          createdAt: 2021-07-07T03:09:15.000Z
 *                          updatedAt: 2021-07-07T03:09:15.000Z
 */
router.get("/releaseVoucher", voucherController.getVoucherRelease);

/**
* @swagger
* /api/public/voucher/release/{code}:
*   put:
*     summary: Release voucher
*     tags: [Voucher]
*     parameters:
*       - in: path
*         name: code
*         required: true
*     responses:
*       200:
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Voucher'
*/
router.put('/release/:code', voucherController.releaseVoucher);

export default router;