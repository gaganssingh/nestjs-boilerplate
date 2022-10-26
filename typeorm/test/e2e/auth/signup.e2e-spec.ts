import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import createTestApp from '../app';
import { SIGNUP_URL } from '../constants';

describe('[Auth (e2e)]', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await createTestApp();
  });

  describe(`signup`, () => {
    it('throws an error if not all fields are prvided', async () => {
      const signupUserDto = {};

      const { body } = await request(app.getHttpServer())
        .post(SIGNUP_URL)
        .send(signupUserDto)
        .expect(400);
      expect(body.error).toBe('Bad Request');
      expect(body.message).toEqual([
        'email must be an email',
        'firstName should not be empty',
        'firstName must be a string',
        'lastName should not be empty',
        'lastName must be a string',
        'Password must include at-least 1 uppercase, 1 lowercase, 1 number, and 1 special character.',
        'password must be shorter than or equal to 35 characters',
        'password must be longer than or equal to 8 characters',
        'confirmPassword should not be empty',
        'confirmPassword must be a string',
      ]);
    });

    it('throws an error if passwords dont match', async () => {
      const signupUserDto = {
        email: 't@t.com',
        password: 'Pa$$1234',
        confirmPassword: 'not-matching',
        firstName: 'Test',
        lastName: 'Name',
      };

      const { body } = await request(app.getHttpServer())
        .post(SIGNUP_URL)
        .send(signupUserDto)
        .expect(400);
      expect(body.message).toBe(`Passwords don't match; aborting user signup`);
    });

    it('throws an error if email address already in use', async () => {
      const signupUserDto = {
        email: 't@t.com',
        password: 'Pa$$1234',
        confirmPassword: 'Pa$$1234',
        firstName: 'Test',
        lastName: 'Name',
      };

      // Signup a new user
      await request(app.getHttpServer()).post(SIGNUP_URL).send(signupUserDto);

      // Signup the same user again
      const { body } = await request(app.getHttpServer())
        .post(SIGNUP_URL)
        .send(signupUserDto)
        .expect(409);
      expect(body.message).toBe(
        `Email "${signupUserDto.email}" already in use; please login instead`,
      );
    });

    it('successfully signs up a new user', async () => {
      const signupUserDto = {
        email: 't@t.com',
        password: 'Pa$$1234',
        confirmPassword: 'Pa$$1234',
        firstName: 'Test',
        lastName: 'Name',
      };

      const { body } = await request(app.getHttpServer())
        .post(SIGNUP_URL)
        .send(signupUserDto)
        .expect(201);
      expect(body.email).toBe(signupUserDto.email);
      expect(body.firstName).toBe(signupUserDto.firstName);
      expect(body.lastName).toBe(signupUserDto.lastName);
      expect(body.id).toBeDefined();
    });

    it('should not return the password in the response', async () => {
      const signupUserDto = {
        email: 't@t.com',
        password: 'Pa$$1234',
        confirmPassword: 'Pa$$1234',
        firstName: 'Test',
        lastName: 'Name',
      };

      const { body } = await request(app.getHttpServer())
        .post(SIGNUP_URL)
        .send(signupUserDto)
        .expect(201);
      expect(body.password).not.toBeDefined();
    });
  });
});
