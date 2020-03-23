module.exports = {
    extends: ['@commitlint/config-conventional'],
    scopes: [{ name: 'geocoder' }, { name: 'provider' }, { name: 'tutorial' }],
    scopeOverrides: {
        fix: [{ name: 'style' }, { name: 'unit' }, { name: 'e2e' }, { name: 'integration' }],
    },
    allowCustomScopes: true,
};
