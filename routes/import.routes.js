import express from "express";
import multer from "multer";
import asyncHandler from "../utils/asyncHandler.js";
import { importCSV } from "../controllers/import.controller.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("file"), asyncHandler(importCSV));

export default router;
