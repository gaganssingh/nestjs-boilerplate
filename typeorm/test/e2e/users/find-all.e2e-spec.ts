import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import createTestApp from '../app';
import { SIGNUP_URL, USERS_URL } from '../constants';

describe('[Find all users] (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await createTestApp();
  });

  it('returns an empty array if no users in the db', async () => {
    const { body } = await request(app.getHttpServer())
      .get(USERS_URL)
      .expect(200);

    expect(body).toEqual([]);
  });

  it('returns all users from the db', async () => {
    const signupUserDtoArray = [
      {
        email: 't@t.com',
        password: 'Pa$$1234',
        confirmPassword: 'Pa$$1234',
        firstName: 'Test',
        lastName: 'Name',
      },
      {
        email: 't2@t.com',
        password: 'Pa$$1234',
        confirmPassword: 'Pa$$1234',
        firstName: 'Test',
        lastName: 'Name',
      },
    ];

    // Signup new users
    await request(app.getHttpServer())
      .post(SIGNUP_URL)
      .send(signupUserDtoArray[0])
      .expect(201);
    await request(app.getHttpServer())
      .post(SIGNUP_URL)
      .send(signupUserDtoArray[1])
      .expect(201);

    const { body } = await request(app.getHttpServer())
      .get(USERS_URL)
      .expect(200);

    expect(body.length).toEqual(2);
    expect(body[0].email).toEqual(signupUserDtoArray[0].email);
    expect(body[0].firstName).toEqual(signupUserDtoArray[0].firstName);
    expect(body[0].lastName).toEqual(signupUserDtoArray[0].lastName);
    expect(body[0].role).toEqual('USER');

    expect(body[1].email).toEqual(signupUserDtoArray[1].email);
    expect(body[1].firstName).toEqual(signupUserDtoArray[1].firstName);
    expect(body[1].lastName).toEqual(signupUserDtoArray[1].lastName);
    expect(body[1].role).toEqual('USER');
  });

  it('excludes user passwords in the response object', async () => {
    const signupUserDto = {
      email: 't@t.com',
      password: 'Pa$$1234',
      confirmPassword: 'Pa$$1234',
      firstName: 'Test',
      lastName: 'Name',
    };

    // Signup a new user
    const { body } = await request(app.getHttpServer())
      .post(SIGNUP_URL)
      .send(signupUserDto)
      .expect(201);

    expect(body.email).toBe(signupUserDto.email);
    expect(body.password).not.toBeDefined();
  });
});
