import { rm } from 'fs/promises';
import { join } from 'path';

global.beforeEach(async () => {
  try {
    // trycatch as rm() will throw an error if the file doesn't exist
    // e.g. when running the test for the first time
    await rm(join(__dirname, '../test.sqlite'));
  } catch (error) {
    // No need to handle the the error - IDC if there is an error
  }
});
