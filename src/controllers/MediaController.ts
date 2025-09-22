import { Request, Response } from "express";
import fs from "fs";
import path from "path";

export class MediaController {
  static async stream(req: Request, res: Response) {
    try {
      const { filename } = req.params;
      const filePath = path.join(__dirname, "../../public", filename);

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "File not found" });
      }

      const stat = fs.statSync(filePath);
      const fileSize = stat.size;
      const range = req.headers.range;

      if (!range) {
        res.writeHead(200, {
          "Content-Length": fileSize,
          "Content-Type": filename.endsWith(".mp3") ? "audio/mpeg" : "video/mp4",
        });
        fs.createReadStream(filePath).pipe(res);
        return;
      }

      // Parse "bytes=START-END"
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      if (start >= fileSize) {
        res.status(416).send(`Requested range not satisfiable\n${start} >= ${fileSize}`);
        return;
      }

      const chunkSize = end - start + 1;
      const fileStream = fs.createReadStream(filePath, { start, end });

      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize,
        "Content-Type": filename.endsWith(".mp3") ? "audio/mpeg" : "video/mp4",
      });

      fileStream.pipe(res);

    } catch (error) {
      console.error("Stream error:", error);
      res.status(500).json({ message: "Stream failed", error });
    }
  }
}
