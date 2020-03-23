/**
 * How to install and use
 * @link {https://www.arden.nl/setting-up-a-gatsby-js-starter-with-type-script-es-lint-prettier-and-pre-commit-hooks}
 *
 * Rule documentation
 * @link {https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-var-requires.md}
 */
module.exports = {
    root: true,
    env: {
        browser: true,
        node: true,
        es6: true,
        mocha: true,
    },
    parser: '@typescript-eslint/parser',
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:prettier/recommended',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript',
        'prettier',
        'prettier/@typescript-eslint',
    ],
    settings: {
        'import/parsers': {
            '@typescript-eslint/parser': ['.ts', '.tsx'],
        },
    },
    parserOptions: {
        project: 'tsconfig.eslint.json',
    },
    plugins: ['@typescript-eslint', 'import', 'prettier'],
    rules: {
        'prettier/prettier': 'error',
        'import/no-deprecated': ['error'],
        'import/order': ['error', { groups: ['builtin', 'external', 'parent', 'sibling', 'index'] }],
        '@typescript-eslint/explicit-member-accessibility': ['error', { accessibility: 'no-public' }],
        '@typescript-eslint/explicit-function-return-type': ['error'],
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-inferrable-types': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/no-require-imports': ['error'],
        '@typescript-eslint/no-use-before-define': ['error'],
        '@typescript-eslint/camelcase': 'off',
        '@typescript-eslint/ban-ts-ignore': 'off',
        '@typescript-eslint/require-await': 'off',
        '@typescript-eslint/promise-function-async': [
            'error',
            {
                allowAny: true,
            },
        ],
        '@typescript-eslint/ban-types': [
            'error',
            {
                types: {
                    Number: {
                        message: 'Use number instead',
                        fixWith: 'number',
                    },
                    Function: {
                        message: 'Use () => void instead',
                        fixWith: '() => void',
                    },
                    Object: {
                        message: 'Use object instead',
                        fixWith: 'object',
                    },
                    String: {
                        message: 'Use string instead',
                        fixWith: 'string',
                    },
                },
            },
        ],
    },
    overrides: [
        {
            files: ['*.js', '*.jsx'],
            rules: {
                '@typescript-eslint/no-require-imports': 'off',
                '@typescript-eslint/no-var-requires': 'off',
                '@typescript-eslint/explicit-function-return-type': 'off',
            },
        },
    ],
};
