import express from "express";
import { badRequestRes, createSuccessRes } from "../utils/BaseRespone";
import upload from "./UpLoadMiddleware";
import { UploadService } from "./UploadService";

const router = express.Router();
const uploadService = new UploadService();

router.post("/", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json(badRequestRes('No file uploaded'));
  }
  const fileUrl = uploadService.getFileUrl(req.file.filename);
  return res.status(200).json(createSuccessRes('File uploaded successfully', 200, { file_url: fileUrl }));
});

export default router;
