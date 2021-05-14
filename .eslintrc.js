module.exports = {
    extends: ['@goparrot/eslint-config/recommended', '@goparrot/eslint-config/less-strict'],
    parserOptions: {
        project: './tsconfig.eslint.json',
    },
    rules: {
        // rules to override.
        // '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/restrict-template-expressions': 'off',
    },
};
