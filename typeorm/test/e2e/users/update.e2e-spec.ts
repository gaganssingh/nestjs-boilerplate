import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { AppModule } from 'src/app.module';
import * as request from 'supertest';
import createTestApp from '../app';
import { SIGNUP_URL, USERS_URL } from '../constants';

describe('[Update user] (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await createTestApp();
  });

  it('throws an error if supplied id is not a UUID', async () => {
    const { body } = await request(app.getHttpServer())
      .patch(`${USERS_URL}/not-a-uuid`)
      .expect(400);

    expect(body.message).toBe(`Validation failed (uuid is expected)`);
    expect(body.error).toBe('Bad Request');
  });

  it('throws an error if user not found', async () => {
    const USER_ID = randomUUID();

    const { body } = await request(app.getHttpServer())
      .patch(`${USERS_URL}/${USER_ID}`)
      .expect(404);

    expect(body.message).toBe(
      `Could not find user with id "${USER_ID}"; update failed`,
    );
    expect(body.error).toBe('Not Found');
  });

  it('successfully updates the user when supplied a valid id', async () => {
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

    const updatedUser = {
      email: 'updated@email.com',
      firstName: 'Updated',
    };

    const { body } = await request(app.getHttpServer())
      .patch(`${USERS_URL}/${user.id}`)
      .send(updatedUser)
      .expect(200);

    expect(body.email).toBe(updatedUser.email);
    expect(body.firstName).toBe(updatedUser.firstName);
    expect(body.lastName).toBe(signupUserDto.lastName);
  });
});
