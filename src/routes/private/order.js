// ** Libs
import express from 'express';

// ** Controller
import orderController from '../../controllers/order.controller.js';

// ** Middleware
import { orderValidation } from '../../middlewares/validate-data/order.js';
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
 * /api/order/my-order:
 *   get:
 *     summary: My order
 *     tags: [Order]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *           example: 1
 *       - in: query
 *         name: size
 *         schema:
 *           type: number
 *           example: 10
 *       - in: query
 *         name: code
 *         schema:
 *            type: string
 *            example: V79BKN78H
 *       - in: query
 *         name: status
 *         schema:
 *            type: string
 *            enum: ["PENDING", "PROCESSING", "DELIVERING", "DELIVERED", "CANCELLED"]
 *            example: PENDING
 *     responses:
 *       200:
 *         description: Create new order
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
 *                       type: object
 *                       properties:
 *                            code:
 *                               type: string
 *                            items:
 *                               type: array
 *                               items:
 *                                  type: object
 *                                  properties:
 *                                      displayName:
 *                                          type: string
 *                                      productCode:
 *                                           type: string
 *                                      image:
 *                                           type: string
 *                                      price:
 *                                           type: number
 *                                      size:
 *                                           type: number
 *                                      quantity:
 *                                            type: number
 *                            accountId:
 *                                 type: string
 *                            email:
 *                                 type: string
 *                            receiverName:
 *                                 type: string
 *                            receiverPhone:
 *                                 type: string
 *                            deliveryAddress:
 *                                 type: object
 *                                 properties:
 *                                      address:
 *                                          type: string
 *                                      province:
 *                                          type: string
 *                                      district:
 *                                          type: string
 *                                      ward:
 *                                          type: string
 *                            voucherCode:
 *                                  type: string
 *                            paymentMethod: 
 *                                  type: string
 *                            deliveryTime:
 *                                  type: string
 *                            shippingFee:
 *                                  type: number
 *                            totalPrice:
 *                                  type: number      
 *              example:
 *                  isSuccess: true
 *                  statusCode: 200
 *                  data:
 *                      - code: V79BKN78H
 *                        items:
 *                            - displayName: Vintage
 *                              productCode: Vintage
 *                              image: Vintage
 *                              price: 100
 *                              size: 1
 *                              quantity: 1
 *                        accountId: adadb121312
 *                        email: abcd@gmail.com
 *                        receiverName: abcd
 *                        receiverPhone: "0364716472"
 *                        deliveryAddress:
 *                              address: 123 abc
 *                              province: HCM
 *                              district: Thuong Tin
 *                              ward: Ha Hoi
 *                        voucherCode: V79BKN78H
 *                        paymentMethod: COD
 *                        deliveryTime: 2022-12-12
 *                        shippingFee: 100
 *                        totalPrice: 200
*/
router.get('/my-order', orderController.getMyOrder);

/**
 * @swagger
 * /api/order/postOrder:
 *   post:
 *     summary: Post new order
 *     tags: [Order]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              properties:
 *                code:
 *                  type: string
 *           example:
 *            code: HB6C1DUN2V
 *     responses:
 *       200:
 *         description: Post new order
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 */
router.post('/postOrder', authorizeRoles(ROLE.SHOP_OWNER, ROLE.STAFF), orderController.postOrder);

/**
 * @swagger
 * /api/order/change-delivery-address:
 *   put:
 *     summary: Change delivery address
 *     tags: [Order]
 *     requestBody:
 *       required: true
 *       content:
 *          application/json:
 *             schema:
 *                type: object
 *                properties:
 *                    orderCode: 
 *                       type: string
 *                    deliveryAddressId:
 *                       type: string
 *                    shippingFee:
 *                       type: number
 *             example:
 *                  orderCode: V79BKN78H
 *                  deliveryAddressId: 66a06fc44e498284b6e21028
 *                  shippingFee: 20000
 *     responses:
 *       200:
 *         description: Create new order
 *         content:
 *           application/json:
 *              schema:
 *                 $ref: '#/components/schemas/Order'
 *  
*/
router.put('/change-delivery-address/', orderController.changeDeliveryAddress);

/**
 * @swagger
 * /api/order/cancel-order/{code}:
 *   patch:
 *     summary: Cancel order
 *     tags: [Order]
 *     parameters:
 *        - in: path
 *          name: code
 *          schema:
 *              type: string
 *          required: true
 *     requestBody:
 *       required: true
 *       content:
 *          application/json:
 *             schema:
 *                type: object
 *                properties:
 *                    reason: 
 *                       type: string
 *             example:
 *                  reason: "Tôi muốn nhập voucher khác"
 *     responses:
 *       200:
 *         description: Cancel order
 *         content:
 *           application/json:
 *              schema:
 *                 $ref: '#/components/schemas/Order'
 *  
*/
router.patch('/cancel-order/:code', orderValidation.cancel(), orderController.cancelOrder);

/**
 * @swagger
 * /api/order/order-dashboard:
 *   get:
 *     summary: All order
 *     tags: [Order]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *           example: 1
 *       - in: query
 *         name: size
 *         schema:
 *           type: number
 *           example: 10
 *       - in: query
 *         name: code
 *         schema:
 *            type: string
 *            example: V79BKN78H
 *       - in: query
 *         name: status
 *         schema:
 *            type: string
 *            enum: ["PENDING", "PROCESSING", "DELIVERING", "DELIVERED", "CANCELLED"]
 *            example: PENDING
 *       - in: query
 *         name: address
 *         schema:
 *            type: string
 *            example: Hà Nội
 *       - in: query
 *         name: payment
 *         schema:
 *            type: string
 *            enum: ["COD", "VNPAY"]
 *       - in: query
 *         name: priceSort
 *         schema:
 *            type: string
 *            enum: ["ASC", "DESC"]
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
 *                       type: object
 *                       properties:
 *                            code:
 *                               type: string
 *                            items:
 *                               type: array
 *                               items:
 *                                  type: object
 *                                  properties:
 *                                      displayName:
 *                                          type: string
 *                                      productCode:
 *                                           type: string
 *                                      image:
 *                                           type: string
 *                                      price:
 *                                           type: number
 *                                      size:
 *                                           type: number
 *                                      quantity:
 *                                            type: number
 *                            accountId:
 *                                 type: string
 *                            email:
 *                                 type: string
 *                            receiverName:
 *                                 type: string
 *                            receiverPhone:
 *                                 type: string
 *                            deliveryAddress:
 *                                 type: object
 *                                 properties:
 *                                      address:
 *                                          type: string
 *                                      province:
 *                                          type: string
 *                                      district:
 *                                          type: string
 *                                      ward:
 *                                          type: string
 *                            voucherCode:
 *                                  type: string
 *                            paymentMethod: 
 *                                  type: string
 *                            deliveryTime:
 *                                  type: string
 *                            shippingFee:
 *                                  type: number
 *                            totalPrice:
 *                                  type: number      
 *              example:
 *                  isSuccess: true
 *                  statusCode: 200
 *                  data:
 *                      - code: V79BKN78H
 *                        items:
 *                            - displayName: Vintage
 *                              productCode: Vintage
 *                              image: Vintage
 *                              price: 100
 *                              size: 1
 *                              quantity: 1
 *                        accountId: adadb121312
 *                        email: abcd@gmail.com
 *                        receiverName: abcd
 *                        receiverPhone: "0364716472"
 *                        deliveryAddress:
 *                              address: 123 abc
 *                              province: HCM
 *                              district: Thuong Tin
 *                              ward: Ha Hoi
 *                        voucherCode: V79BKN78H
 *                        paymentMethod: COD
 *                        deliveryTime: 2022-12-12
 *                        shippingFee: 100
 *                        totalPrice: 200
*/
router.get('/order-dashboard', authorizeRoles(ROLE.SHOP_OWNER, ROLE.ADMIN, ROLE.STAFF, ROLE.WAREHOUSE_MANAGER), orderValidation.query(), orderController.getOrderDashboard);

/**
 * @swagger
 * /api/order/create:
 *   post:
 *     summary: Create new order
 *     tags: [Order]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              properties:
 *                items:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      displayName:
 *                        type: string
 *                      productCode:
 *                        type: string
 *                      image:
 *                        type: string
 *                      price:
 *                        type: number
 *                      size:
 *                        type: number
 *                      quantity:
 *                        type: number
 *                receiverName:
 *                  type: string
 *                receiverPhone:
 *                  type: string
 *                deliveryAddressId:
 *                  type: string
 *                voucherCode:
 *                  type: string
 *                discountValue:
 *                  type: number
 *                paymentMethod:
 *                  type: string
 *                shipping:
 *                  type: object
 *                  properties:
 *                    method:
 *                       type: boolean
 *                    fee:
 *                       type: number
 *                totalPrice:
 *                  type: number
 *           example:
 *            items:
 *              - displayName: Adidas - High Top - Dark
 *                productCode: D0P5ZYVRVH
 *                image: https://res.cloudinary.com/dh41vh9dx/image/upload/v1631710007/ecommerce/products/D0P5ZYVRVH.jpg
 *                price: 400000
 *                size: 42
 *                quantity: 43
 *            receiverName: Thomas Lee
 *            receiverPhone: "0364716472"
 *            deliveryAddressId: 66a07262cb734ca1d19a4bc7
 *            voucherCode: V79BKN78H
 *            discountValue: 50000
 *            paymentMethod: COD
 *            shipping: 
 *                method: false
 *                fee: 20000
 *            totalPrice: 400000
 *     responses:
 *       200:
 *         description: Create new order
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 */
router.post('/create', orderController.createOrder);

export default router;