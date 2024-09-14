import express from "express";
import session from "express-session";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import path from "path";
import cookieParser from "cookie-parser";
import { CLIENT_URL } from "../constants/env.js";

const configApp = (app) => {

  app.use(express.static(path.join("./src", "assets")));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(
    session({
      secret: "SECRET",
      resave: true,
      saveUninitialized: true,
    })
  );
  app.use(
    cors({
      origin: [CLIENT_URL, 'http://localhost:3000'],
      methods: "GET,POST,PUT,DELETE,PATCH",
      credentials: true,
    })
  );
  app.use(morgan("dev"));

  //limit json req
  app.use(bodyParser.json({ limit: "5mb", extended: true }));
  app.use(
    bodyParser.urlencoded({
      limit: "5mb",
      extended: true,
      parameterLimit: 1000000,
    })
  );
  app.use(cookieParser('G56_CAPSTONE'));
};

export default configApp;
