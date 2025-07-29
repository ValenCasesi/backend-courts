// jest.config.ts
import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['<rootDir>/src/**/*.test.ts'],
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
    setupFiles: ['<rootDir>/setupTests.js'],
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
    // opcional: si quisieras que Jest transforme también JS de node_modules:
    // transformIgnorePatterns: ['<rootDir>/node_modules/'],
};

export default config;
