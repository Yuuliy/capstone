import swaggerJSDoc from 'swagger-jsdoc';
import { HOST, PORT, SERVER_URL } from '../constants/env.js';
const options = {
    swaggerDefinition: {
        openapi: '3.0.0', // Phiên bản của Swagger/OpenAPI
        info: {
            title: 'Tên API của bạn',
            version: '1.0.0',
            description: 'Mô tả API của bạn',
        },
        servers: [
            {
                url: `${SERVER_URL}`,
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./src/routes/**/*.js'], // Đường dẫn đến các tệp chứa chú thích Swagger
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec; // Xuất biến swaggerSpec để có thể import nó trong các tệp khác
