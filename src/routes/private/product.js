// ** Express
import express from "express";

// ** Configs
import { upload } from "../../configs/multer.js";

// ** Controllers
import productController from "../../controllers/product.controller.js";

//** Middlewares
import { productValidation } from "../../middlewares/validate-data/product.js";
import { authorizeRoles } from "../../middlewares/auth.js";

// ** Constants
import { ROLE } from "../../constants/model.constant.js";
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
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
 *             productCode:
 *               type: string
 *               example: abcsd
 *             productName:
 *               type: string
 *               example: Bitis Hunter X
 *             type:
 *               type: string
 *               example: Low top
 *             displayName:
 *               type: string
 *               example: Bitis Hunter X - Low top - SKyblue
 *             description:
 *               type: string
 *               example: Giày chạy bộ tốt nhất năm 2024
 *             images:
 *               type: array
 *               items:
 *                 type: string
 *                 example: https://product.hstatic.net/1000230642/product/hsm004401den1_58f0020cd4314e309c76dcdd2621ee82.jpg
 *             category:
 *               type: string
 *             isHide:
 *               type: boolean
 *               example: false
 *             colourVariant:
 *               type: Object
 *               properties:
 *                 colourName:
 *                   type: String
 *                   example: Skyblue
 *                 hex:
 *                   type: String
 *                   example: #00CCFF
 *                 sizeMetrics:
 *                   type: array
 *                   items:
 *                     type: Object
 *                     properties:
 *                       size:
 *                         type: number
 *                         example: 41
 *                       quantity:
 *                         type: number
 *                         example: 400
 *             price:
 *               type: number
 *               example: 400000
 *             salePrice:
 *               type: number
 *               example: 400000
 *             totalQuantity:
 *               type: number
 *               example: 300
 *       example:
 *         isSuccess: true
 *         statusCode: 200
 *         data:
 *              productCode: abcsd
 *              productName: Bitis Hunter X
 *              type: Low top
 *              displayName: Bitis Hunter X - Low top - SKyblue
 *              description: Giày chạy bộ tốt nhất năm 2024
 *              images:
 *                  - https://product.hstatic.net/1000230642/product/hsm004401den1_58f0020cd4314e309c76dcdd2621ee82.jpg
 *              category: Bitis Hunter
 *              isHide: false
 *              colourVariant: 
 *                colourName: Skyblue
 *                hex: 00CCFF
 *                sizeMetrics: 
 *                  - size: 42
 *                    quantity: 100
 *                  - size: 43
 *                    quantity: 200
 *              price: 400000
 *              salePrice: 400000
 *              totalQuantity: 300
 */
/**
 * @swagger
 * tags:
 *   name: Product
 *   description: The Product managing API
 */
/**
 * @swagger
 * /api/product/createProduct:
 *   post:
 *     summary: Create new product
 *     tags: [Product]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               productName: 
 *                 type: string
 *                 example: Bitis Hunter X
 *               type:
 *                 type: string
 *                 example: Low top
 *               description:
 *                 type: string
 *                 example: Giày chạy bộ tốt nhất năm 2024
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               categoryId:
 *                 type: string
 *                 example: 6661cab......
 *               price:
 *                 type: number
 *                 example: 400000
 *               colourVariant:
 *                 type: object
 *                 properties:
 *                   colourName:
 *                     type: string
 *                     example: Skyblue
 *                   hex:
 *                     type: string
 *                     example: '#00CCFF'
 *                   sizeMetrics:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         size:
 *                           type: number
 *                           example: 41
 *                         quantity:
 *                           type: number
 *                           example: 500000
 *           encoding:
 *             images:
 *               contentType: image/jpeg, image/png, image/jpg
 *     responses:
 *       200:
 *         description: Create new product
 *         content:
 *           application/json:
 *             schema:
 *                 $ref: '#/components/schemas/Product'
 */
router.post("/createProduct", authorizeRoles(ROLE.SHOP_OWNER, ROLE.WAREHOUSE_MANAGER), upload.array('images'), productValidation.body(), productController.createProduct);

/**
 * @swagger
 * /api/product/changeStatus/{code}:
 *   put:
 *     summary: Delete Product 
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: The id of the product to delete 
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *                  $ref: '#/components/schemas/Product'
 *                 
 */
router.put("/changeStatus/:code", authorizeRoles(ROLE.SHOP_OWNER, ROLE.WAREHOUSE_MANAGER), productController.changeStatus);

/**
 * @swagger
 * /api/product/{code}:
 *   put:
 *     summary: Update Product 
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: The product code
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               productName: 
 *                 type: string
 *                 example: Bitis Hunter X
 *               type:
 *                 type: string
 *                 example: Low top
 *               description:
 *                 type: string
 *                 example: Giày chạy bộ tốt nhất năm 2024
 *               removeImageIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: 6661cab......
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               categoryId:
 *                 type: string
 *                 example: 6661cab......
 *               price:
 *                 type: number
 *                 example: 400000
 *               colourVariant:
 *                 type: object
 *                 properties:
 *                   colourName:
 *                     type: string
 *                     example: Skyblue
 *                   hex:
 *                     type: string
 *                     example: '#00CCFF'
 *                   sizeMetrics:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         size:
 *                           type: number
 *                           example: 41
 *                         quantity:
 *                           type: number
 *                           example: 500000
 *     responses:
 *       200:
 *         description: Update product successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 */
router.put("/:code", authorizeRoles(ROLE.SHOP_OWNER, ROLE.WAREHOUSE_MANAGER), upload.array('images'), productController.updateProduct);

/**
 * @swagger
 * /api/product/dashboard:
 *   get:
 *     summary: Get Product dashboard list
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
 *         name: categoryId
 *         schema:
 *           type: string
 *       - in: query
 *         name: color
 *         schema:
 *           type: string
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
 *                     type: Object
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
 *                      - productCode: abcsd
 *                        productName: Bitis Hunter X
 *                        type: Low top
 *                        displayName: Bitis Hunter X - Low top - SKyblue
 *                        description: Giày chạy bộ tốt nhất năm 2024
 *                        images:
 *                            - https://product.hstatic.net/1000230642/product/hsm004401den1_58f0020cd4314e309c76dcdd2621ee82.jpg
 *                        category: Bitis Hunter
 *                        isHide: false
 *                        colourVariant: 
 *                          colourName: Skyblue
 *                          hex: 00CCFF
 *                          sizeMetrics: 
 *                            - size: 42
 *                              quantity: 100
 *                            - size: 43
 *                              quantity: 200
 *                        price: 400000
 *                        salePrice: 400000
 *                        totalQuantity: 300
 */
router.get("/dashboard", authorizeRoles(ROLE.SHOP_OWNER, ROLE.WAREHOUSE_MANAGER, ROLE.STAFF), productController.getProductsDashboard);
export default router;
