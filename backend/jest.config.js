/**
 * Backend-specific Jest configuration
 * This file references the root config and adjusts paths for backend execution
 */
const rootConfig = require('../jest.config.js');

module.exports = {
  ...rootConfig,
  // Override roots to work from backend directory
  roots: ['<rootDir>/src'],
};
