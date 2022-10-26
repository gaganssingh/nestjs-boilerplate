import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { AppModule } from 'src/app.module';
import * as request from 'supertest';
import createTestApp from '../app';
import { SIGNUP_URL, USERS_URL } from '../constants';

describe('[Find user by id] (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await createTestApp();
  });

  it('throws an error if supplied id is not a UUID', async () => {
    const { body } = await request(app.getHttpServer())
      .get(`${USERS_URL}/not-a-uuid`)
      .expect(400);

    expect(body.message).toBe(`Validation failed (uuid is expected)`);
    expect(body.error).toBe('Bad Request');
  });

  it('returns an empty object if user not found', async () => {
    const { body } = await request(app.getHttpServer())
      .get(`${USERS_URL}/${randomUUID()}`)
      .expect(200);

    expect(body).toEqual({});
  });

  it('successfully returns a user if supplied id is valid', async () => {
    const signupUserDto = {
      email: 't@t.com',
      password: 'Pa$$1234',
      confirmPassword: 'Pa$$1234',
      firstName: 'Test',
      lastName: 'Name',
    };

    const { body: user } = await request(app.getHttpServer())
      .post(SIGNUP_URL)
      .send(signupUserDto)
      .expect(201);

    const { body } = await request(app.getHttpServer())
      .get(`${USERS_URL}/${user.id}`)
      .expect(200);

    expect(body.id).toBe(user.id);
  });
});
