// const browserify = require("@cypress/browserify-preprocessor");
// const presetTs = require.resolve("@babel/preset-typescript")
// module.exports = on => {
//   // const options = browserify.defaultOptions
//   // options.browserifyOptions.transform[1][1].presets.push(presetTs)
//   // console.log(options.browserifyOptions.transform[1][1].presets)
//   // on("file:preprocessor", browserify(options));
// };

const watchApp = require("cypress-app-watcher-preprocessor");
module.exports = (on, config) => {
  on("file:preprocessor", watchApp());
};
