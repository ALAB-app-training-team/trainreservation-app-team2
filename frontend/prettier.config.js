/**
 * @see https://prettier.dokyumento.jp/docs/en/configuration.html
 * @type {import("prettier").Config}
 */

const config = {
  semi: true,
  singleQuote: true,
  tabWidth: 4,
  trailingComma: "all",
  endOfLine: "lf",

  plugins: ["prettier-plugin-tailwindcss"],
};

export default config;
