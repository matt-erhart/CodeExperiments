import * as React from "react";
import { Entry1 } from "../EntryPoints/EntryPoints";
import { TextEditor} from "../TextEditing/TextEditor";
import { PanelsOuter, Panel, Instructions } from "../StyledComponents";
export const ExperimentPanels = () => {
  return (
    <PanelsOuter>
      <Panel style={{flex: 3}}>
        <Entry1 />
      </Panel>
      <Panel>
        <Instructions>
          Imagine you are proposing the most valuable next question to ask to
          improve our knowledge of group creativity. 
        </Instructions>
        <TextEditor />
      </Panel>
    </PanelsOuter>
  );
};
