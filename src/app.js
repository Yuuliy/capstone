//** Lib
import express from "express";
import http from "http";
import swaggerUi from 'swagger-ui-express';

// ** Configs
import configApp from "./configs/appConfig.js";
import swaggerSpec from './configs/swagger.config.js';

// ** Routes
import { publicRouter, privateRouter } from "./routes/index.js";

// ** Middlewares
import { verifyAccessToken } from "./middlewares/auth.js";


// ** Constant
import { statusCode } from "./constants/statusCode.constant.js";


const app = express();
configApp(app);

const server = http.createServer(app);

app.use("/api/health-check", (req, res) => {
    res.status(statusCode.OK).json({
        code: statusCode.OK,
        message: "Health check is OK",
    });
});

//Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ** Public Routes
app.use("/api/public", publicRouter);

// ** Private Routes
app.use("/api/*", verifyAccessToken);

// Private Routes
app.use("/api", privateRouter);

app.use("/*", (req, res) => {
    res.status(statusCode.NOT_FOUND).json({
        code: statusCode.NOT_FOUND,
        message: "API not found",
    });
});

export { server };
