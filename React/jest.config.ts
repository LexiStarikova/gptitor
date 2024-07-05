import { Config } from '@jest/types';

const config: Config.InitialOptions = {
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$'
};

export default config;

