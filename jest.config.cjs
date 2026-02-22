/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom', '<rootDir>/src/__tests__/setupTests.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/__mocks__/fileMock.js',
    '^mermaid$': '<rootDir>/__mocks__/mermaid.ts'
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest'
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(ccount|trough|react-markdown|remark-|rehype-|unist-|mdast-|hast-|hastscript|web-namespaces|micromark|decode-named-character-reference|character-entities|zwitch|longest-streak|lowlight|parse-entities|katex|devlop|comma-separated-tokens|estree-util-is-identifier-name|space-separated-tokens|vfile|vfile-message|html-url-attributes|property-information|bail|is-plain-obj|unified|trim-lines|escape-string-regexp|markdown-table|mdast-util-find-and-replace|trough|mermaid|d3-|dagre-d3-|lodash-es|plantuml-encoder))'
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  testPathIgnorePatterns: ['node_modules'],
  coveragePathIgnorePatterns: ['node_modules', 'src/__tests__/'],
  moduleDirectories: ['node_modules', 'src'],
  roots: ['<rootDir>'],
  modulePaths: ['<rootDir>/src']
}

module.exports = config
