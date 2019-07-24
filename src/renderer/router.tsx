import * as React from "react";
import { HashRouter, Route, Switch, Link } from "react-router-dom";

import { Start } from "./Start";
import { FreeformCanvas } from "./FreeformCanvas";
export default () => {
  return (
    <HashRouter hashType="noslash">
      <Link to="/">hey</Link>
      <Switch>
        <Route exact path="/" component={FreeformCanvas} />
        <Route exact path="/start" component={Start} />
        <Route component={() => <h1>No Content</h1>} />
      </Switch>
    </HashRouter>
  );
};
