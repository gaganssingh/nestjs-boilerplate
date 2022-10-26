import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import * as request from 'supertest';
import createTestApp from '../app';

describe('[Find all users] (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await createTestApp();
  });

  describe('[E2E]', () => {
    it('app successfully bootstrapped for e2e testing', () => {
      expect(true).toBe(true);
    });
  });
});
