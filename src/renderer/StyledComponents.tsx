import * as React from "react";
import styled from "styled-components";

// so we can do flexbox / split panels with all the space
export const FullViewPort = styled.div`
  height: 100vh;
  width: 100vw;
  border: 2px solid black;
  display: flex;
  flex-direction: column;
  overflow: auto;
`;

export const ViewPortNav = styled.div`
  border: 2px solid grey;
  flex: 0;
  padding: 5px;

`;

export const ViewPortMainContent = styled.div`
  border: 2px solid blue;
  flex: 1;
  padding: 5px;
`;

export const PanelsOuter = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
`;

export const Panel = styled.div`
  flex: 1;
  border: 1px solid black;
  display: flex;
  flex-direction: column;
`;

export const Instructions = styled.h1`
  height: 100px;
  font-size: 30px;
  padding: 30px;
  flex: 0;
`;

export const TextEditorOuter = styled.div`
  flex: 1;
  display: flex;
  overflow: auto;
`;
