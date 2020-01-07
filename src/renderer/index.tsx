import * as React from "react";
import * as ReactDOM from "react-dom";

import Router from "./router";

const render = Component => {
  ReactDOM.render(<Component />, document.getElementById("root"));
};

render(Router);

const { shell, desktopCapturer, screen } = window.require("electron");
const fs = window.require("fs");

function getScreenShot() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const pixRatio = window.devicePixelRatio;
  const thumbnailSize = { width: width * pixRatio, height: height * pixRatio };
  desktopCapturer.getSources(
    { types: ["screen"], thumbnailSize },
    (error, sources) => {
      const filePath = "C:\\Users\\mattj\\Desktop\\test.png";
      for (const source of sources) {
        if (source.name === "Entire Screen") {
          fs.writeFile(filePath, source.thumbnail.toPNG(), err => {});
        }
      }
    }
  );
}
getScreenShot();
