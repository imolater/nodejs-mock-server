module.exports = {
    env: {
        node: true,
        es2021: true,
    },
    extends: [
        'standard',
    ],
    parser: 'babel-eslint',
    parserOptions: {
        sourceType: 'module',
    },
    rules: {
        'no-console': 'off',
        indent: 'off',
        'indent-legacy': [
            'error', 4, {
                SwitchCase: 1,
            },
        ],
        semi: [ 'error', 'always' ],
        'comma-dangle': [ 'error', 'always-multiline' ],
        'space-before-function-paren': [ 'error', 'never' ],
        'space-in-parens': [ 'error', 'always' ],
        'no-multi-spaces': [
            'error', {
                exceptions: {
                    VariableDeclarator: true,
                    ImportDeclaration: true,
                    ExportNamedDeclaration: true,
                },
            },
        ],
        'eol-last': 'off',
        'no-multiple-empty-lines': [
            'error',
            {
                max: 2,
                maxEOF: 1,
                maxBOF: 0,
            },
        ],
        curly: [ 'error', 'multi-line' ],
        quotes: 'off',
        'no-trailing-spaces': [
            'error', {
                ignoreComments: true,
                skipBlankLines: true,
            },
        ],
        'arrow-parens': [ 'error', 'as-needed' ],
        'template-curly-spacing': [ 'error', 'always' ],
        'array-bracket-spacing': [ 'error', 'always' ],
    },
};
