// ** Express
import express from "express";

// ** Controllers
import userController from "../../controllers/user.controller.js";
import authController from "../../controllers/auth.controller.js";
import { userValidation } from "../../middlewares/validate-data/user.js";

// ** Middlewares
// import { authValidation } from "../../middlewares/validate-data/auth";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     DeliveryAddress:
 *       type: object
 *       required:
 *       properties:
 *         isSuccess:
 *           type: boolean
 *         statusCode:
 *           type: number
 *         data:
 *           type:: array
 *           items:
 *              type: object
 *              properties:
 *                 id:
 *                   type: string
 *                 fullName:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 email:
 *                   type: string
 *                 address:
 *                   type: string
 *                 province:
 *                   type: object
 *                   properties:
 *                      provinceId:
 *                          type: stirng
 *                      provinceName:
 *                          type: string
 *                 district:
 *                   type: object
 *                   properties:
 *                      districtId:
 *                         type: string
 *                      districtName:
 *                         type: string
 *                 ward:
 *                   type: object
 *                   properties:
 *                        wardId:
 *                           type: string
 *                        wardName:
 *                           type: string
 *                 isDefault:
 *                   type: boolean
 *       example:
 *         isSuccess: true
 *         statusCode: 200
 *         data: 
 *            - id: "60d0fe4f5311236168a109ca"
 *              fullName: "Thomas Lee"
 *              phone: "0364716473"
 *              address: "123 Main St"
 *              province:
 *                  provinceId: "201"
 *                  provinceName: "Ha Noi" 
 *              district: 
 *                  districtId: "3303"
 *                  districtName: "Thuong Tin"
 *              ward:
 *                  wardId: 1B2705
 *                  wardName: "Ha Hoi"
 *              isDefault: true
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *       properties:
 *         isSuccess:
 *           type: boolean
 *         statusCode:
 *           type: number
 *         data:
 *           type: Object
 *           properties:
 *             _id:
 *              type: string
 *             username:
 *              type: string
 *             email:
 *              type: string
 *             isBlocked:
 *              type: boolean
 *             role:
 *              type: string
 *             user:
 *              type: Object
 *              properties:
 *                  firstName:
 *                      type: string
 *                  lastName:
 *                      type: string
 *                  avatar:
 *                      type: string
 *                  phone:
 *                      type: string
 *                  deliveryAddress:
 *                      type: array
 *                  address:
 *                     type: string
 *       example:
 *         isSuccess: true
 *         statusCode: 200
 *         data: 
 *              _id: "60d0fe4f5311236168a109ca"
 *              username: "johndoe"
 *              email: "johndoe@example.com"
 *              isBlocked: false
 *              role: "User"
 *              user:
 *                  firstName: "John"
 *                  lastName: "Doe"
 *                  avatar: "http://example.com/avatar.jpg"
 *                  phone: "123456789"
 *                  deliveryAddress: []
 *                  address: "123 Main St"
 */
/**
 * @swagger
 * tags:
 *   name: User
 *   description: The User managing API
 */
/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [User]
 *     responses:
 *       200:
 *         description: User profile
 *         content:
 *           application/json:
 *             schema:
 *                 $ref: '#/components/schemas/User'
 */
router.get("/profile", userController.getProfile);

/**
 * @swagger
 * /api/user/updateProfile:
 *   post:
 *     summary: Update user profile
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               dob:
 *                 type: number
 *           example:
 *             username: testzed920
 *             email: testzed920@gmail.com
 *             phone: "0987654321"
 *             firstName: Thomas
 *             lastName: Lee
 *             dob: 1382086394000
 *     responses:
 *       200:
 *         description: User profile updated
 *         content:
 *           application/json:
 *             schema:
 *                  type: object
 *                  properties:
 *                      isSuccess:
 *                          type: boolean
 *                      statusCode:
 *                          type: number
 *                      data:
 *                          type: Object
 *                          properties:
 *                              _id:
 *                                  type: string
 *                                  example: 665fbbde32d25335b95b1089
 *                              username:
 *                                  type: string
 *                                  example: thomaslee
 *                              email:
 *                                  type: string
 *                                  example: testzed920@gmail.com
 *                              isBlocked:
 *                                  type: boolean
 *                                  example: false
 *                              role:
 *                                  type: string
 *                                  example: User
 *                              user:
 *                                  type: Object
 *                                  properties:
 *                                      firstName:
 *                                          type: string
 *                                      lastName:
 *                                          type: string
 *                                      dob:
 *                                          type: number
 *                                      phone:
 *                                          type: string
 *                                      deliveryAddress:
 *                                          type: array
 *                                      address:
 *                                          type: string                  
 *             example:
 *              isSuccess: true
 *              statusCode: 200
 *              data: 
 *                  _id: 665fbbde32d25335b95b1089
 *                  username: thomaslee
 *                  email: testzed920@gmail.com
 *                  isBlocked: false
 *                  role: User
 *                  user:
 *                     firstName: Thomas
 *                     lastName: Lee
 *                     dob: ""
 *                     phone: "123456789"
 *                     deliveryAddress: []
 *                     address: ""
 * 
 */
router.post("/updateProfile", userValidation.updateProfile() , userController.updateProfile);

/**
 * @swagger
 * /api/user/delivery-address:
 *   post:
 *     summary: Add delivery address
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               province:
 *                 type: object
 *                 properties:
 *                    provinceId:
 *                       type: string
 *                    provinceName:
 *                       type: string
 *               district:
 *                 type: object
 *                 properties:
 *                    districtId:
 *                       type: string
 *                    districtName:
 *                       type: string
 *               ward:
 *                 type: object
 *                 properties:
 *                    wardId:
 *                       type: string
 *                    wardName:
 *                       type: string
 *               isDefault:
 *                 type: boolean
 *             example:
 *               fullName: "Thomas Lee"
 *               phone: "0364716473"
 *               address: "123 Main St"
 *               province:
 *                    provinceId: "201"
 *                    provinceName: "Ha Noi"
 *               district:
 *                    districtId: "3303"
 *                    districtName: "Thuong Tin"
 *               ward:
 *                    wardId: 1B2705
 *                    wardName: "Ha Hoi"
 *               isDefault: true
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeliveryAddress'
 */

router.post('/delivery-address', userValidation.addDeliveryAddress(), userController.createDeliveryAddress);

/**
 * @swagger
 * /api/user/my-addresses:
 *   get:
 *     summary: My delivery addresses 
 *     tags: [User]
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *                  $ref: '#/components/schemas/DeliveryAddress'
 */
router.get('/my-addresses', userController.getMyAddresses);

/**
 * @swagger
 * /api/user/delivery-address/{addressId}:
 *   put:
 *     summary: Update delivery address
 *     tags: [User]
 *     parameters:
 *        - in: path
 *          name: addressId
 *          required: true
 *          schema:
 *             type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               province:
 *                 type: object
 *                 properties:
 *                    provinceId:
 *                       type: string
 *                    provinceName:
 *                       type: string
 *               district:
 *                 type: object
 *                 properties:
 *                    districtId:
 *                       type: string
 *                    districtName:
 *                       type: string
 *               ward:
 *                 type: object
 *                 properties:
 *                    wardId:
 *                       type: string
 *                    wardName:
 *                       type: string
 *               isDefault:
 *                 type: boolean
 *             example:
 *               fullName: "Thomas Lee"
 *               phone: "0364716473"
 *               address: "123 Main St"
 *               province:
 *                    provinceId: "201"
 *                    provinceName: "Ha Noi"
 *               district:
 *                    districtId: "3303"
 *                    districtName: "Thuong Tin"
 *               ward:
 *                    wardId: 1B2705
 *                    wardName: "Ha Hoi"
 *               isDefault: true
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                   isSuccess:
 *                      type: boolean
 *                      example: true
 *                   statusCode:
 *                      type: number
 *                      example: 200
 *                   data:
 *                      type: object
 *                      properties:
 *                         id:
 *                           type: string
 *                           example: "60d0fe4f531........"
 *                         fullName:
 *                           type: string
 *                           example: "Thomas Lee"
 *                         phone:
 *                           type: string
 *                           example: "0364716473"
 *                         address:
 *                           type: string
 *                           example: "123 Main St"
 *                         province:
 *                           type: object
 *                           properties:
 *                               provinceId:
 *                                   type: string
 *                                   example: "201"
 *                               provinceName:
 *                                   type: string
 *                                   example: "Ha Noi"
 *                         district:
 *                            type: object
 *                            properties:
 *                               districtId:
 *                                    type: string
 *                                    example: "3303"
 *                               districtName:
 *                                    type: string
 *                                    example: "Thuong Tin"
 *                         ward:
 *                             type: object
 *                             properties:
 *                                wardId:
 *                                   type: string
 *                                   example: "1B2705"
 *                                wardName:
 *                                   type: string
 *                                   example: "Ha Hoi"
 *                         isDefault:
 *                                type: boolean
 *                                example: true
 */
router.put('/delivery-address/:addressId', userController.updateDeliveryAddress);

/**
 * @swagger
 * /api/user/delivery-address/{addressId}:
 *   delete:
 *     summary: Delete delivery address
 *     tags: [User]
 *     parameters:
 *        - in: path
 *          name: addressId
 *          required: true
 *          schema:
 *             type: string
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeliveryAddress'
 */
router.delete('/delivery-address/:addressId', userController.deleteDeliveryAddress);

/**
 * @swagger
 * /api/user/change-password:
 *  post:
 *     summary: Channge password
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword: 
 *                 type: string
 *               newPassword: 
 *                 type: string
 *           example:
 *             oldPassword: thanh0702
 *             newPassword: thanh2002
 *     responses:
 *       200:
 *         description: User logout
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  isSuccess:
 *                      type: boolean
 *                      example: true
 *                  statusCode:
 *                      type: number
 *                      example: 200
 *                  data:
 *                      type: sting
 *                      example: OK
 */
router.post('/change-password', userValidation.changePassword(), authController.changePassword);

export default router;
