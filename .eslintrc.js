module.exports = {
    parser: 'babel-eslint',
    extends: ['airbnb', 'prettier', 'plugin:compat/recommended'],
    plugins: [
        "react-hooks"
    ],
    env: {
        browser: true,
        node: true,
        es6: true,
        mocha: true,
        jest: true,
        jasmine: true,
    },
    globals: {
        APP_TYPE: true,
    },
    rules: {
        'react/jsx-filename-extension': [1, { extensions: ['.js'] }],
        'react/jsx-wrap-multilines': 0,
        'react/prop-types': 0,
        'react/forbid-prop-types': 0,
        'react/jsx-one-expression-per-line': 0,
        'import/no-unresolved': [2, { ignore: ['^@/', '^umi/'] }],
        'import/no-extraneous-dependencies': [2, { optionalDependencies: true }],
        'jsx-a11y/no-noninteractive-element-interactions': 0,
        'jsx-a11y/click-events-have-key-events': 0,
        'jsx-a11y/no-static-element-interactions': 0,
        'jsx-a11y/anchor-is-valid': 0,
        'no-underscore-dangle': 0,
        "indent": ['error', 2, { "ignoredNodes": ["TemplateLiteral *"] }],
        "react-hooks/rules-of-hooks": "error", // 检查 Hook 的规则
        // "react-hooks/exhaustive-deps": "warn", // 检查 effect 的依赖
        "react/no-array-index-key": 0,
        'no-trailing-spaces': ["error", { "skipBlankLines": true }],
        "react/destructuring-assignment": 0,
        "comma-spacing": ["error", { "before": false, "after": true }],
        "object-curly-spacing": ["error", "always"],
        "no-multiple-empty-lines": ["error", { "max": 1, "maxEOF": 1 }],
        "global-require": 0
    },
    settings: {
        polyfills: ['fetch', 'promises', 'url'],
    },
};
