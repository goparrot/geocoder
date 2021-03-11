/**
 * How to install and use
 * @link {https://www.arden.nl/setting-up-a-gatsby-js-starter-with-type-script-es-lint-prettier-and-pre-commit-hooks}
 *
 * One rule documentation
 * @link {https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-var-requires.md}
 */
module.exports = {
    root: true,
    env: {
        node: true,
        es6: true,
        mocha: true, // if you use it
        // 'jest/globals': true, // if you use it
    },
    // to ignore custom directories and files, please use the .eslintignore file
    ignorePatterns: [
        // eslint by default ignores '/**/node_modules/*', but it's a little stupid, because it starts checking all the first level folders inside node_modules
        'node_modules',
        // eslint by default ignores all hidden directories and files
        // don't ignore hidden files in the root directory (for example: .commitlintrc.js, .prettierrc.json)
        '!.*.js',
        '!.*.json',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: 'tsconfig.eslint.json',
    },
    settings: {
        'import/parsers': {
            '@typescript-eslint/parser': ['.ts', '.tsx'],
        },
        'import/resolver': { 'eslint-import-resolver-typescript': true },
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:prettier/recommended',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript',
        'prettier',
    ],
    plugins: ['@typescript-eslint', 'import', 'prettier'],
    rules: {
        'no-empty': 'off',
        'no-unused-vars': 'off',
        'no-constant-condition': 'off',
        'prettier/prettier': 'error',
        'import/no-deprecated': ['error'],
        '@typescript-eslint/explicit-function-return-type': ['error'],
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-inferrable-types': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/no-require-imports': ['error'],
        '@typescript-eslint/no-use-before-define': ['error'],
        '@typescript-eslint/consistent-type-imports': ['error'],
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/camelcase': 'off',
        '@typescript-eslint/ban-ts-ignore': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/require-await': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/restrict-template-expressions': 'off',
        // @todo fix
        '@typescript-eslint/no-unsafe-call': 'off',
        'import/order': ['error', { groups: ['builtin', 'external', 'parent', 'sibling', 'index'] }],
        '@typescript-eslint/explicit-member-accessibility': ['error', { accessibility: 'no-public' }],
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', ignoreRestSiblings: true, args: 'after-used' }],
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
