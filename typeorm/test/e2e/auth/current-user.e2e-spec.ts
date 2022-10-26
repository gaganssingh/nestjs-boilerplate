import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import createTestApp from '../app';
import { CURRENT_USER_URL, LOGIN_URL, SIGNUP_URL } from '../constants';

describe('[Current User] (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await createTestApp();
  });

  it(`throws 401 Unauthorized if JWT invalid`, async () => {
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

    await request(app.getHttpServer())
      .post(LOGIN_URL)
      .send(loginUserDto)
      .expect(200);

    const { body } = await request(app.getHttpServer())
      .get(CURRENT_USER_URL)
      .set('Authorization', `Bearer invalid-jwt`)
      .expect(401);

    expect(body.message).toBe('Unauthorized');
  });

  it(`returns the currently logged in user`, async () => {
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

    const response = await request(app.getHttpServer())
      .get(CURRENT_USER_URL)
      .set('Authorization', `Bearer ${body.accessToken}`);
    expect(response.body).toBeDefined();
    expect(response.body.iat).toBeDefined();
    expect(response.body.exp).toBeDefined();
    expect(response.body.email).toBe(loginUserDto.email);
    expect(response.body.password).not.toBeDefined();
  });
});
