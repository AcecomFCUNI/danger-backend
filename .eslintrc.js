module.exports = {
  env: {
    node: true,
    es6: true
  },
  extends: ['eslint:recommended', 'plugin:react/recommended'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  plugins: ['react'],
  rules: {
    'no-var': 'error',
    curly: [
      'error',
      'multi'
    ],
    'sort-keys': 'error',
    'no-trailing-spaces': 'error',
    'comma-dangle': [
      'error',
      'never'
    ],
    'max-len': [
      'error',
      {
        'code': 80
      }
    ],
    'key-spacing': [
      2, 
      {
        'align': 'colon' 
      }
    ],
    'keyword-spacing': [
      'error', {
        'overrides': {
          'if': { 'after': false },
          'for': { 'after': false },
          'while': { 'after': false }
        }
      }
    ],
    'semi': [
      2,
      'never'],
    'react/no-unescaped-entities': 0,
    'react/prop-types': 0,
    'space-before-function-paren': [
      'error', {
        'anonymous': 'always',
        'named': 'always',
        'asyncArrow': 'always'
      }
    ]
  }
}
