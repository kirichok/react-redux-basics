module.exports = {
  extends: 'airbnb',
  parser: 'babel-eslint',
  plugins: ['babel'],
  env: {
    browser: true,
    es6: true,
  },
  rules: {
    'no-use-before-define': [2, { functions: false }],
    'no-plusplus': [2, { 'allowForLoopAfterthoughts': true }],
    'camelcase': [2, { properties: 'never' }],
    'no-return-await': 0,
    'no-await-in-loop': 0,
    'no-param-reassign': 0,
    'consistent-return': 0,
    'default-case': 0,
    'no-prototype-builtins': 0,
    'prefer-template': 0,
    'class-methods-use-this': 0,
    'arrow-body-style': 0,
    'max-len': 1,
    'react/jsx-filename-extension': [1, { 'extensions': ['.js'] }],
    'react/prop-types': 1,
    'react/forbid-prop-types': 0,
    'import/prefer-default-export': 1,
    'object-curly-newline': 0,
    'react/require-default-props': 0,
    'jsx-a11y/anchor-is-valid': ['error', {
      'specialLink': ['hrefLeft', 'hrefRight'],
      'aspects': ['noHref', 'invalidHref', 'preferButton']
    }],
  }
};
