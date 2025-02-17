import bcrypt from 'bcrypt';
import { IPasswordService } from '../models/IPasswordService';

class PasswordService implements IPasswordService {
  private readonly saltRounds = 12;

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.saltRounds);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}

export default new PasswordService();
