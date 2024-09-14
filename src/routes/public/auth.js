// ** Lib
import express from "express";

// ** Controllers
import authController from "../../controllers/auth.controller.js";

// ** Middlewares
import { authValidation } from "../../middlewares/validate-data/auth.js";

const router = express.Router();


// /**
//  * @swagger
//  * components:
//  *   schemas:
//  *     Auth:
//  *       type: object
//  *       properties:
//  *         isSuccess:
//  *           type: boolean
//  *         statusCode:
//  *           type: number
//  *         data:
//  *           type: Object
//  *           properties:
//  *             username:
//  *               type: string
//  *               example: thomaslee
//  *             email:
//  *               type: string
//  *               example: testzed920@gmail.com
//  *             isBlocked:
//  *               type: boolean
//  *               example: false
//  *             role:
//  *               type: string
//  *               example: User
//  *       example:
//  *         isSuccess: true
//  *         statusCode: 200
//  *         data: 
//  *              username: thomaslee
//  *              email: testzed920@gmail.com
//  *              isBlocked: false
//  *              role: User
//  */
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: The Auth API
 */
/**
 * @swagger
 * /api/public/auth/register:
 *   post:
 *     summary: Create a new account
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username: 
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *           example:
 *             username: thomaslee
 *             password: "123456"
 *             email: testzed920@gmail.com
 *             phone: "123456789"
 *             firstName: Thomas
 *             lastName: Lee
 *     responses:
 *       200:
 *         description: User profile
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
 *                                      avatar:
 *                                          type: string
 *                                      phone:
 *                                          type: string
 *                                      deliveryAddress:
 *                                          type: array
 *                                      address:
 *                                          type: string
 *                              favourite:
 *                                  type: Array
 *                                  example: []                     
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
 *                     avatar: ""
 *                     phone: "123456789"
 *                     deliveryAddress: []
 *                     address: ""
 *                  favourite: []
 * 
 */
router.post("/register", authValidation.register() ,authController.register);

/**
 * @swagger
 * /api/public/auth/login:
 *  post:
 *     summary: Create a new account
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username: 
 *                 type: string
 *               password:
 *                 type: string
 *           example:
 *             username: thomaslee
 *             password: thanh2002
 *     responses:
 *       200:
 *         description: User login
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
 *                      type: object
 *                      properties:
 *                          id: 
 *                              type: string
 *                              example: 665fbbde32d25335b95b1089
 *                          username:
 *                              type: string
 *                              example: thomaslee
 *                          email:
 *                              type: string
 *                              example: abcd@gmail.com
 *                          role:
 *                              type: string
 *                              example: User
 *                          isBlocked:
 *                              type: string
 *                              example: false
 *                          accessToken:
 *                              type: string
 *                              example: eyJhbGciO....
 */
router.post("/login", authValidation.login() ,authController.login);

// /**
//  * @swagger
//  * /api/public/auth/google/login:
//  *  post:
//  *     summary: Create a new account
//  *     tags: [Auth]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               credential: 
//  *                 type: string
//  *           example:
//  *             credential: aibhjkcnlkmaikbjslkn.....
//  *     responses:
//  *       200:
//  *         description: User login
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                  isSuccess:
//  *                      type: boolean
//  *                      example: true
//  *                  statusCode:
//  *                      type: number
//  *                      example: 200
//  *                  data:
//  *                      type: object
//  *                      properties:
//  *                          id: 
//  *                              type: string
//  *                              example: 665fbbde32d25335b95b1089
//  *                          username:
//  *                              type: string
//  *                              example: thomaslee
//  *                          email:
//  *                              type: string
//  *                              example: abcd@gmail.com
//  *                          role:
//  *                              type: string
//  *                              example: User
//  *                          isBlocked:
//  *                              type: string
//  *                              example: false
//  *                          accessToken:
//  *                              type: string
//  *                              example: eyJhbGciO....
//  */
// router.post("/google/login", authController.loginWithGoogle);

/**
 * @swagger
 * /api/public/auth/refresh-access-token:
 *  get:
 *     summary: refresh token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Refresh Token
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
 *                      type: object
 *                      properties:
 *                          accessToken: 
 *                              type: string
 *                              example: eyJhbGciO....
 */
router.get("/refresh-access-token", authController.refreshAccessToken);

/**
 * @swagger
 * /api/public/auth/logout:
 *  post:
 *     summary: Logout
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               accessToken: 
 *                 type: string
 *           example:
 *             accessToken: aibhjkcnlkmaikbjslkn.....
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
router.post("/logout", authController.logout);

/**
 * @swagger
 * /api/public/auth/forgot-password:
 *  post:
 *     summary: Forgot password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: 
 *                 type: string
 *           example:
 *             email: testzed9220@gmail.com
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
router.post("/forgot-password", authController.forgotPassword);

/**
 * @swagger
 * /api/public/auth/reset-password:
 *  post:
 *     summary: Reset password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token: 
 *                 type: string
 *               password: 
 *                 type: string
 *           example:
 *             token: e6d30c541e9aec2a9f78589........
 *             password: thanh2002
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
router.post("/reset-password", authController.resetPassword)

export default router;
