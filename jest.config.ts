module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1'
    },
    testMatch: [
        '**/test/**/*.test.ts'
    ],
    collectCoverage: true,
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
        'src/**/*.ts'
    ],
    coveragePathIgnorePatterns: [
        '/node_modules/',
        'index.ts'
    ],
    transformIgnorePatterns: [
        '/node_modules/',
        'index.ts'
    ]
};
