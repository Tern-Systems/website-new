module.exports = {
    displayName: 'Website',
    rootDir: '.',
    moduleDirectories: ['node_modules/', 'src/'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    moduleNameMapper: {
        '.+\\.(svg|png|jpg|gif)$': 'jest-transform-stub',
        '^@/tests/(.+)': '<rootDir>/tests/$1',
        '^@/(.+)': '<rootDir>/src/$1',
    },
    testRegex: '.*\\.(e2e-)?(int-)?(reg-)?spec\\.tsx?$',
    transform: {
        '^.+\\.tsx?$': 'babel-jest',
        '^.+\\.module.css$': 'jest-css-modules-transform',
    },
    collectCoverageFrom: ['src/**/*.tsx', 'src/**/*.ts'],
    coverageDirectory: 'coverage/',
    verbose: true,
    clearMocks: true,
    setupFiles: ['<rootDir>/jest.setup.env.cjs'],
    setupFilesAfterEnv: ['<rootDir>/jest.setup.base.cjs'],
};
