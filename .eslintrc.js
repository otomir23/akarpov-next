const stylistic = require("@stylistic/eslint-plugin")

const customized = stylistic.configs.customize({
    indent: 4,
    quotes: "double",
    semi: false,
    jsx: true,
})

module.exports = {
    extends: "next/core-web-vitals",
    plugins: [
        "@stylistic",
    ],
    rules: {
        ...customized.rules,
        "@stylistic/jsx-one-expression-per-line": "off",
        "@stylistic/max-len": ["warn", 120],
        "@stylistic/no-trailing-spaces": ["error", { skipBlankLines: true }],
        "@stylistic/member-delimiter-style": ["error", {
            multiline: {
                delimiter: "comma",
                requireLast: true,
            },
            singleline: {
                delimiter: "comma",
                requireLast: false,
            },
        }],
        "@stylistic/multiline-ternary": "off",
        "@stylistic/brace-style": ["error", "1tbs", {
            allowSingleLine: true,
        }],
    },
}
