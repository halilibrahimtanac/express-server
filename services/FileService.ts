import fs from "fs/promises";
import path from "path";

class FileService {
  
  async saveFile(userName: string, postId: number, file: any) {
    const dir = path.join('uploads', userName, postId.toString());

    await fs.mkdir(dir, { recursive: true });

    const filePath = path.join(dir, file.originalname);

    await fs.writeFile(filePath, file.buffer);

    return filePath;
  }
}

export default FileService;