import express from "express";
import { test } from "../controllers/User.controller.js";
const router = express.Router();

router.get("/", test);

export default router;
