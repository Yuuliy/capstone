// ** Express
import express from "express";

// ** Controllers
import productController from "../../controllers/product.controller.js";
import dashBoardController from "../../controllers/dashboard.controller.js";

//** Middlewares
import { productValidation } from "../../middlewares/validate-data/product.js";
import { dashboardValidation } from "../../middlewares/validate-data/dashboard.js";

const router = express.Router();

/** 
 * @swagger
 * tags:
 *   name: Product
 *   description: The Product managing API
 */

/**
 * @swagger
 * /api/public/product/getProducts:
 *   get:
 *     summary: Get Product list
 *     tags: [Product]
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
 *         name: displayName
 *         schema:
 *           type: string
 *       - in: query
 *         name: types
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *           style: form
 *           explode: true
 *           example: ["types"]
 *       - in: query
 *         name: categoryIds
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *           style: form
 *           explode: true
 *           example: ["categoryIds"]
 *       - in: query
 *         name: categoryNames
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *           style: form
 *           explode: true
 *           example: ["categoryNames"]
 *       - in: query
 *         name: colors
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *           style: form
 *           explode: true
 *           example: ["colors"]
 *       - in: query
 *         name: colorNames
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *           style: form
 *           explode: true
 *           example: ["colorNames"]
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: priceSort
 *         schema:
 *           type: string
 *           enum: ['ASC', 'DESC']
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
 *                     type: object
 *                     properties:
 *                       productCode:
 *                         type: string
 *                         example: abcsd
 *                       productName:
 *                         type: string
 *                         example: Bitis Hunter X
 *                       displayName:
 *                         type: string
 *                         example: Bitis Hunter X - Low top - SKyblue
 *                       type:
 *                         type: string
 *                         example: Low top
 *                       colorName:
 *                         type: string
 *                         example: SKyblue
 *                       images:
 *                         type: array
 *                         items:
 *                           type: string
 *                           example: https://product.hstatic.net/1000230642/product/hsm004401den1_58f0020cd4314e309c76dcdd2621ee82.jpg
 *                       price:
 *                         type: number
 *                         example: 400000
 *                       salePrice:
 *                         type: number
 *                         example: 400000
 *                       totalQuantity:
 *                         type: number
 *                         example: 300
 *               example:
 *                   isSuccess: true
 *                   statusCode: 200
 *                   data:
 *                        - productCode: abcsd
 *                          productName: Bitis Hunter X
 *                          displayName: Bitis Hunter X - Low top - SKyblue
 *                          type: Low top
 *                          colorName: SKyblue
 *                          images:
 *                              - https://product.hstatic.net/1000230642/product/hsm004401den1_58f0020cd4314e309c76dcdd2621ee82.jpg
 *                          price: 400000
 *                          salePrice: 400000
 *                          totalQuantity: 300
 */
router.get("/getProducts", productValidation.query(), productController.getAllProducts);


/**
 * @swagger
 * /api/public/product/product-colors:
 *   get:
 *     summary: Get colors of product 
 *     tags: [Product]
 *     responses:
 *       200:
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
 *                       colorName:
 *                         type: string
 *                         example: SKyblue
 *                       hex:
 *                         type: string
 *                         example: '#000000'
 *               example:
 *                   isSuccess: true
 *                   statusCode: 200
 *                   data:
 *                        - colorName: SKyblue
 *                          hex: '#000000'
*/

router.get("/product-colors", productController.getAllColors);

/**
 * @swagger
 * /api/public/product/checkStock:
 *   get:
 *     summary: Check stock of product
 *     tags: [Product]
 *     parameters:
 *       - in: query
 *         name: productCode
 *         schema:
 *           type: string
 *           example: HAKLNLKLKJ
 *       - in: query
 *         name: size
 *         schema:
 *           type: number
 *           example: 10
 *       - in: query
 *         name: quantity
 *         schema:
 *           type: number
 *           example: 10
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
 *                   type: boolean
 *               example:
 *                   isSuccess: true
 *                   statusCode: 200
 *                   data: true
 */
router.get("/checkStock", productValidation.checkStock(), productController.checkStock);

/**
 * @swagger
 * /api/public/product/top-products:
 *   get:
 *     summary: Top 10 Product
 *     tags: [Product]
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
router.get('/top-products', dashboardValidation.revenueDashboard(), dashBoardController.getTopProducts);

/**
 * @swagger
 * /api/public/product/{code}:
 *   get:
 *     summary: Get product details
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: The product ID
 *     responses:
 *       200:
 *         description: Product details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isSuccess:
 *                   type: boolean
 *                 statusCode:
 *                   type: integer
 *                 data:
 *                   type: object
 *                   properties:
 *                     productCode:
 *                       type: string
 *                       example: abcsd
 *                     productName:
 *                       type: string
 *                       example: Bitis Hunter X
 *                     type:
 *                       type: string
 *                       example: Low top
 *                     displayName:
 *                       type: string
 *                       example: Bitis Hunter X - Low top - Skyblue
 *                     description:
 *                       type: string
 *                       example: Giày chạy bộ tốt nhất năm 2024
 *                     images:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: https://product.hstatic.net/1000230642/product/hsm004401den1_58f0020cd4314e309c76dcdd2621ee82.jpg
 *                     category:
 *                       type: string
 *                     isHide:
 *                       type: boolean
 *                       example: false
 *                     colourVariant:
 *                       type: object
 *                       properties:
 *                         colourName:
 *                           type: string
 *                           example: Skyblue
 *                         hex:
 *                           type: string
 *                           example: #00CCFF
 *                         sizeMetrics:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               size:
 *                                 type: number
 *                                 example: 41
 *                               quantity:
 *                                 type: number
 *                                 example: 400
 *                     price:
 *                       type: number
 *                       example: 400000
 *                     salePrice:
 *                       type: number
 *                       example: 400000
 *                     totalQuantity:
 *                       type: number
 *                       example: 300
 *                     ortherColor:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           productCode:
 *                             type: string
 *                             example: abcsd
 *                           hex:
 *                             type: string
 *                             example: '#000000'
 *             example:
 *               isSuccess: true
 *               statusCode: 200
 *               data:
 *                 productCode: abcsd
 *                 productName: Bitis Hunter X
 *                 type: Low top
 *                 displayName: Bitis Hunter X - Low top - Skyblue
 *                 description: Giày chạy bộ tốt nhất năm 2024
 *                 images:
 *                   - https://product.hstatic.net/1000230642/product/hsm004401den1_58f0020cd4314e309c76dcdd2621ee82.jpg
 *                 category:
 *                      id: '667a4086af531....'
 *                      name: Vintas
 *                 isHide: false
 *                 colourVariant:
 *                   colourName: Skyblue
 *                   hex: #00CCFF
 *                   sizeMetrics:
 *                     - size: 42
 *                       quantity: 100
 *                     - size: 43
 *                       quantity: 200
 *                 price: 400000
 *                 salePrice: 400000
 *                 totalQuantity: 300
 *                 ortherColor:
 *                   - productCode: abcsd
 *                     hex: '#000000'
 */
router.get("/:code", productController.productDetail);

export default router;