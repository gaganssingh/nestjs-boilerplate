import { Request } from 'express';
import { User } from 'src/modules/users/entities';

export interface RequestWithUser extends Request {
  user: User;
}
