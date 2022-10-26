import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../services';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  // Passport will run the validate() function automatically
  // This will internally call the passport verify method
  async validate(email: string, password: string): Promise<any> {
    return await this.authService.getAuthenticatedUser({ email, password });
  }
}
