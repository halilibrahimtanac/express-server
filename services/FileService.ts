import fs from "fs/promises";
import path from "path";

class FileService {
  
  static async saveFile(userName: string, postId: number, file: any) {
    const dir = path.join('uploads', userName, postId.toString());

    await fs.mkdir(dir, { recursive: true });

    const filePath = path.join(dir, file.originalname);

    await fs.writeFile(filePath, file.buffer);

    return filePath;
  }

  static async readFile(filePath: string): Promise<Buffer> {
    try {
      const fileContent = await fs.readFile(filePath);
      return fileContent;
    } catch (error) {
      throw new Error(`Failed to read file: ${error}`);
    }
  }
}

export default FileService;