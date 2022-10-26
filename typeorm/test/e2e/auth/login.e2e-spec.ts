import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import createTestApp from '../app';
import { LOGIN_URL, SIGNUP_URL } from '../constants';

describe('[Login] (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await createTestApp();
  });

  describe('login', () => {
    it('throws 401 Unauthorized error if not all fields are prvided', async () => {
      const loginUserDto = {};

      const { body } = await request(app.getHttpServer())
        .post(LOGIN_URL)
        .send(loginUserDto)
        .expect(401);
      expect(body.message).toBe('Unauthorized');
    });

    it('throws 404 Not Found error if email is invalid', async () => {
      const loginUserDto = {
        email: 'invalid@email.com',
        password: 'password',
      };

      const { body } = await request(app.getHttpServer())
        .post(LOGIN_URL)
        .send(loginUserDto)
        .expect(404);

      expect(body.error).toBe('Not Found');
      expect(body.message).toBe(
        'Invalid credentials provided; please try again',
      );
    });

    it('throws 401 Unauthorized error if password is incorrect', async () => {
      const signupUserDto = {
        email: 't@t.com',
        password: 'Pa$$1234',
        confirmPassword: 'Pa$$1234',
        firstName: 'Test',
        lastName: 'Name',
      };

      // Signup a new user
      await request(app.getHttpServer()).post(SIGNUP_URL).send(signupUserDto);

      const loginUserDto = {
        email: 't@t.com',
        password: 'invalid password',
      };

      const { body } = await request(app.getHttpServer())
        .post(LOGIN_URL)
        .send(loginUserDto)
        .expect(401);

      expect(body.error).toBe('Unauthorized');
      expect(body.message).toBe(
        'Invalid credentials provided; please try again',
      );
    });

    it("successfully logs in and responds with the user's email and a jwt", async () => {
      const signupUserDto = {
        email: 't@t.com',
        password: 'Pa$$1234',
        confirmPassword: 'Pa$$1234',
        firstName: 'Test',
        lastName: 'Name',
      };

      // Signup a new user
      await request(app.getHttpServer()).post(SIGNUP_URL).send(signupUserDto);

      const loginUserDto = {
        email: 't@t.com',
        password: 'Pa$$1234',
      };

      const { body } = await request(app.getHttpServer())
        .post(LOGIN_URL)
        .send(loginUserDto)
        .expect(200);

      expect(body.email).toBe(loginUserDto.email);
      expect(body.accessToken).toBeDefined();
      expect(typeof body.accessToken).toBe('string');
    });
  });
});
