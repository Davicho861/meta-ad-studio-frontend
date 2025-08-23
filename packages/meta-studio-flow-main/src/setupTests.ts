require('dotenv').config();

global.import = {
  meta: {
    env: process.env,
  },
};
import '@testing-library/jest-dom';
