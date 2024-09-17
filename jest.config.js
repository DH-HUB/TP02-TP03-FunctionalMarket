module.exports = {
  preset: 'ts-jest', 
  testEnvironment: 'node', 
  transform: {
    '^.+\\.ts?$': 'ts-jest', 
  },
  moduleFileExtensions: ['ts', 'js'], 
  testMatch: ['**/?(*.)+(spec|test).ts'], 
};
