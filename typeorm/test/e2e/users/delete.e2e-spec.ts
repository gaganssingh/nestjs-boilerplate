import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { AppModule } from 'src/app.module';
import * as request from 'supertest';
import createTestApp from '../app';
import { SIGNUP_URL, USERS_URL } from '../constants';

describe('[Delete user] (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await createTestApp();
  });

  it('throws an error if supplied id is not a UUID', async () => {
    const { body } = await request(app.getHttpServer())
      .delete(`${USERS_URL}/not-a-uuid`)
      .expect(400);

    expect(body.message).toBe(`Validation failed (uuid is expected)`);
    expect(body.error).toBe('Bad Request');
  });

  it('throws an error if user not found', async () => {
    const USER_ID = randomUUID();

    const { body } = await request(app.getHttpServer())
      .delete(`${USERS_URL}/${USER_ID}`)
      .expect(404);

    expect(body.message).toBe(
      `Could not find user with id "${USER_ID}"; deletion failed`,
    );
    expect(body.error).toBe('Not Found');
  });

  it('successfully deletes the user when supplied a valid id', async () => {
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
    expect(user.email).toBe(signupUserDto.email);
    expect(user.firstName).toBe(signupUserDto.firstName);
    expect(user.lastName).toBe(signupUserDto.lastName);

    // Delete the user
    const { body } = await request(app.getHttpServer())
      .delete(`${USERS_URL}/${user.id}`)
      .expect(200);

    expect(body).toEqual({});

    // Perform a find-by-id lookup for the user
    const { body: deletedUser } = await request(app.getHttpServer())
      .get(`${USERS_URL}/${user.id}`)
      .expect(200);

    expect(deletedUser).toEqual({});
  });
});
