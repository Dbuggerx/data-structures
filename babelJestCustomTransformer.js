module.exports = require("babel-jest").createTransformer({
  plugins: [["@babel/transform-runtime"]],
  presets: [
    [
      "@babel/preset-env",
      {
        modules: "commonjs",
      },
    ],
    "@babel/preset-typescript",
  ],
});
