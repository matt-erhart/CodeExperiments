import Plain from "slate-plain-serializer";
import { Editor } from "slate-react";
import * as React from "react";
import { TextEditorOuter } from "../StyledComponents";
const initialValue = Plain.deserialize("Write your answer here.");

export class TextEditor extends React.Component {
  render() {
    return (
      <TextEditorOuter>
        <Editor
          placeholder="Enter some plain text..."
          defaultValue={initialValue}
          style={{
            flex: 1,
            fontSize: 22,
            margin: 30,
            padding: 30,
            border: "1px solid lightgrey",
            overflow: 'scroll',
            maxHeight: '30vh'
          }}
        />
      </TextEditorOuter>
    );
  }
}

export default TextEditor;
