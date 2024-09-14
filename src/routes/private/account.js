// ** Lib
import express from "express";

// ** Controllers
import accountController from "../../controllers/account.controller.js";

// ** Middlewares
import { accountValidation } from "../../middlewares/validate-data/account.js";
import { authorizeRoles } from "../../middlewares/auth.js";

// ** Constants
import { ROLE } from "../../constants/model.constant.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Account
 *   description: The Account API
 */
/**
 * @swagger
 * /api/account/assign:
 *   post:
 *     summary: Assign a new account
 *     tags: [Account]
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
 *               role:
 *                 type: string
 *           example:
 *             username: admintest1
 *             password: "@dminTest1"
 *             email: adminTest1@gmail.com
 *             role: "Admin"
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
 *                     firstName: ""
 *                     lastName: ""
 *                     avatar: ""
 *                     phone: ""
 *                     deliveryAddress: []
 *                     address: ""
 * 
 */
router.post("/assign", authorizeRoles(ROLE.SHOP_OWNER, ROLE.ADMIN), accountValidation.assign(), accountController.assign);

/**
 * @swagger
 * /api/account/dashboard:
 *   get:
 *     summary: Get Product dashboard list
 *     tags: [Account]
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
 *         name: nameKey
 *         schema:
 *           type: string
 *       - in: query
 *         name: isBlocked
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: ['User', 'Admin', 'Warehouse Staff', 'Marketing Staff', 'Shop Owner']
 *           example : User
 *     responses:
 *       200:
 *         description: Product list
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
 *                         type: Object
 *                         properties:
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
 *               example:
 *                   isSuccess: true
 *                   statusCode: 200
 *                   data:
 *                      - _id: 665fbbde32d25335b95b1089
 *                        username: thomaslee
 *                        email: testzed920@gmail.com
 *                        isBlocked: false
 *                        role: User
 *                        user:
 *                           firstName: Thomas
 *                           lastName: Lee
 *                           avatar: ""
 *                           phone: "123456789"
 *                           deliveryAddress: []
 *                           address: ""
 */
router.get("/dashboard", authorizeRoles(ROLE.SHOP_OWNER, ROLE.ADMIN, ROLE.STAFF, ROLE.WAREHOUSE_MANAGER), accountController.allAccounts);

/**
 * @swagger
 * /api/account/editRole/{id}:
 *   put:
 *     summary: Change account role 
 *     tags: [Account]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 6683738e7430ca921031efe7
 *         description: The category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                  role:
 *                    type: string
 *                    example: User
 *     responses:
 *       200:
 *         description: Account profile
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
 * 
 */
router.put("/editRole/:id", authorizeRoles(ROLE.SHOP_OWNER, ROLE.ADMIN), accountValidation.editRole(), accountController.editRole);

/**
 * @swagger
 * /api/account/blockAccount/{id}:
 *   put:
 *     summary: Change account role 
 *     tags: [Account]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The account ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason: 
 *                 type: string
 *                 example: "Spam"
 *     responses:
 *       200:
 *         description: Account profile
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
 * 
 */
router.put("/blockAccount/:id", authorizeRoles(ROLE.SHOP_OWNER, ROLE.ADMIN), accountController.blockAccount);

export default router;