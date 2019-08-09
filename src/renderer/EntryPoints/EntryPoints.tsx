import * as React from "react";
import {
  useState,
  useRef,
  useCallback,
  useEffect,
  useLayoutEffect
} from "react";
import electronState from "./state.json";
console.log("electronState: ", electronState);
import { get } from "./utils";
import { GraphNode, getNeighborhood } from "./graphUtils";
import { NeighborLink } from "./styled";

/**
 * tokenization
 * wanted to link into a figure
 * search for 'control'. a few are not what I want
 * see its stroop. search stroop
 * need better graph org rubric/heuristics. finacial stress - poverty - how they def. poverty
 * hard vs easy conditions: no one could know what that means
 */
/**
 * click entry2:userDoc
 * path: ['userDocId']
 * click entry2:userDoc:userDoc
 * path: ['userDocId', 'userDocId']
 * toggle by add delete from path
 */

const selectedNeighbors = [
  { nodeId: "id", neighbors: ["id", "id"], isVisable: true }
];
const getNeighborNodeIds = id => {
  return getNeighborhood(
    [id],
    electronState.graph.nodes,
    electronState.graph.links
  ).nodes.map(node => node.id);
};

const getNodeType = id => {
  const nodeType = electronState.graph.nodes[id].data.type;
  return nodeType;
};

const getText = id => {
  return get(electronState.graph.nodes[id], node => node.data.text, "");
};

const getNodeContext = id => {
  const nodeType = getNodeType(id);
};
const Entry1 = () => {
  const [entryIds, setEntryIds] = useState([] as string[]);
  const [nodeToNeighbors, setNodeToNeighbors] = useState({}); //id lookup
  const [selectedNodePaths, setSelectedNodePaths] = useState({}); //id lookup
  console.log("selectedNodePaths: ", selectedNodePaths);
  useEffect(() => {
    const nodeArr: GraphNode[] = Object.values(electronState.graph.nodes);
    const entryNodeIds = nodeArr
      .filter(node => {
        return get(node, n => n.data.isEntryPoint, false);
      })
      .map(n => n.id);

    setSelectedNodePaths(
      entryNodeIds.reduce((state, id, ix) => {
        // initialize to empty
        return { ...state, [id]: [] };
      }, {})
    );

    const nodeNeighbors = entryNodeIds.reduce((state, id, ix) => {
      const nearestNeighbors = getNeighborNodeIds(id);
      return { ...state, [id]: nearestNeighbors };
    }, {});

    setNodeToNeighbors(nodeNeighbors);
    setEntryIds(entryNodeIds);
  }, []);
  return (
    <div>
      {entryIds.map(entryId => {
        return (
          <div key={entryId}>
            <div>{getText(entryId)}</div>
            <div>
              {nodeToNeighbors[entryId].map(neighborId => {
                return (
                  <NeighborLink
                    key={neighborId}
                    style={{
                      color:
                        selectedNodePaths[entryId][0] === neighborId
                          ? "blue"
                          : "black"
                    }}
                    onClick={e =>
                      setSelectedNodePaths(state => {
                        return { ...state, [entryId]: [neighborId] };
                      })
                    }
                  >
                    {getNodeType(neighborId)}
                  </NeighborLink>
                );
              })}
            </div>
            {selectedNodePaths[entryId].map(x => {
              return <div key={x}>{x}</div>;
            })}
          </div>
        );
      })}
    </div>
  );
};

export const InfiniTab = () => {
  return (
    <div>
      <Entry1 />
    </div>
  );
};

const links = [
  { text: "Poverty", charIxs: [0, 7] },
  { text: "Impedes", charIxs: [8, 15] },
  { text: "Cognitive", charIxs: [16, 16 + 9] },
  { text: "Function", charIxs: [17 + 9] },
  { text: "Cognitive Function", charIxs: [16] }
];
