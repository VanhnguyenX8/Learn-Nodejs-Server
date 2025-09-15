
export class UploadService {
  getFileUrl(filename: string) {
    return `/uploads/${filename}`;
  }
}
