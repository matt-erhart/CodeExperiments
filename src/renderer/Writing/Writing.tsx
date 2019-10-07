import Plain from "slate-plain-serializer";
import { Editor } from "slate-react";
import * as React from "react";
import { TextEditorOuter } from "../StyledComponents";
const initialValue = Plain.deserialize("Write your answer here.");
import styled from "styled-components";

const Tooltip = styled.div`
  margin-right: 5px;
  cursor: pointer;
  div {
    position: absolute;
    visibility: hidden;
  }

  :hover {
    div {
      visibility: visible;
    }
  }
`;

const Poverty = () => (
  <Tooltip>
    Poverty{" "}
    <div>
      the gap between one’s needs and the resources available to fulfill them
    </div>
  </Tooltip>
);

const Impedes = () => (
  <Tooltip>
    Impedes <div> limits </div>
  </Tooltip>
);

const CognitiveFunction = () => (
  <Tooltip>
    Cognitive Function <div> Raven's + Stroop </div>
  </Tooltip>
);

export function Writing() {
  return (
    <TextEditorOuter>
      <Poverty /> <Impedes /> <CognitiveFunction />
    </TextEditorOuter>
  );
}

export default Writing;
