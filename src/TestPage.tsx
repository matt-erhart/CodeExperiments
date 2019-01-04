import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";

const ASpan = props => {
  return (
    <span css={{ color: "green", "&:hover": { color: "blue" } }} {...props}>
      {props.children}
    </span>
  );
};
