import * as React from "react";
import { HashRouter, Route, Switch, Link } from "react-router-dom";

import { Start } from "./Start";
import { FreeformCanvas } from "./FreeformCanvas";
import { ListWithGestures } from "./ListWithGestures";
import {
  FullViewPort,
  ViewPortMainContent,
  ViewPortNav
} from "./StyledComponents";

import { PageText } from "./pdfText/PageText";
import { InfiniTab } from "./EntryPoints/EntryPoints";
import { TextEditor } from "./TextEditing/TextEditor";
import { ExperimentPanels } from "./Experiment/Panels";
import { PdfReactViewer } from "./PdfReact/PdfReactViewer";
const linkRoute = [
  { to: "/", label: "PdfReact", component: PdfReactViewer },
  {
    to: "/ExperimentPanels",
    label: "ExperimentPanels",
    component: ExperimentPanels
  },
  { to: "/TextEditor", label: "TextEditor", component: TextEditor },
  { to: "/entryPoints", label: "entryPoints", component: InfiniTab },
  { to: "/pdftext", label: "pdftext", component: PageText },
  { to: "/GestureList", label: "GestureList", component: ListWithGestures },
  { to: "/freeform", label: "freeform", component: FreeformCanvas }
];

export default () => {
  return (
    <HashRouter hashType="noslash">
      <FullViewPort>
        <ViewPortNav>
          {linkRoute.map(lr => {
            return (
              <Link key={lr.label} to={lr.to} style={{ margin: 5 }}>
                {lr.label}
              </Link>
            );
          })}
        </ViewPortNav>
        <ViewPortMainContent>
          <Switch>
            {linkRoute.map(lr => {
              return (
                <Route
                  key={lr.label}
                  exact
                  path={lr.to}
                  component={lr.component}
                />
              );
            })}
            <Route component={() => <h1>No Content</h1>} />
          </Switch>
        </ViewPortMainContent>
      </FullViewPort>
    </HashRouter>
  );
};
