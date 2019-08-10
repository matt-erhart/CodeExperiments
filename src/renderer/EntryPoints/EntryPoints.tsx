import * as React from "react";
import {
  useState,
  useRef,
  useCallback,
  useEffect,
  useLayoutEffect
} from "react";
import electronState from "./state.json";

import { get, updateArrayIndex } from "./utils";
import { GraphNode, getNeighborhood } from "./graphUtils";
import {
  NeighborLink,
  EntryPointText,
  EntryPointOuter,
  NodeItem,
  NeighborOuter
} from "./styled";

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
  )
    .nodes.filter(node => node.data.type !== "pdf.publication")
    .map(node => node.id);
};

const getNodeType = id => {
  const nodeType = electronState.graph.nodes[id].data.type;
  const isEntryPoint = get(
    electronState.graph.nodes[id].data,
    data => data.isEntryPoint,
    false
  );
  return isEntryPoint ? "Entry Point" : nodeType;
};

const getText = id => {
  return get(electronState.graph.nodes[id], node => node.data.text, "");
};

const getNodeContext = id => {
  const nodeType = getNodeType(id);
  if (["Entry Point", "userDoc"].includes(nodeType)) {
    return electronState.graph.nodes[id].data.text;
  } else {
    return "render a box";
  }
};
const pathTest = {
  "1085e040-ba2b-11e9-8c37-b1ed03acfdd9": [
    "f9f23c00-ba2c-11e9-9650-293398fcda5b",
    "b5d0fc00-bae5-11e9-9d11-ad62e87aca06",
    "f9f23c00-ba2c-11e9-9650-293398fcda5b"
  ],
  "05fa9140-ba2e-11e9-9650-293398fcda5b": [
    "af0e9060-ba2e-11e9-9650-293398fcda5b",
    "d6ffdb80-bae5-11e9-9d11-ad62e87aca06"
  ]
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
      pathTest
      // entryNodeIds.reduce((state, id, ix) => {
      //   // initialize to empty
      //   return { ...state, [id]: [] };
      // }, {})
    );

    const nodeNeighbors = entryNodeIds.reduce((state, id, ix) => {
      const nearestNeighbors = getNeighborNodeIds(id);
      return { ...state, [id]: nearestNeighbors };
    }, {});

    setNodeToNeighbors(nodeNeighbors);
    setEntryIds(entryNodeIds);
  }, []);

  const makeNeighborLinks = (entryId, nodeId = "", depth = -1) => {
    let neighborIds = [] as string[];
    if (!nodeToNeighbors.hasOwnProperty(nodeId)) {
      // make it if we need it
      neighborIds = getNeighborNodeIds(nodeId);
      setNodeToNeighbors(state => ({ ...state, [nodeId]: neighborIds }));
    } else {
      // cache hit
      neighborIds = nodeToNeighbors[nodeId];
    }

    const NeighborLinks = neighborIds.map(neighborId => {
      return (
        <NeighborLink
          key={neighborId}
          style={{
            color:
              selectedNodePaths[entryId][depth] === neighborId
                ? "blue"
                : "black"
          }}
          onDoubleClick={e => {
            e.preventDefault();
          }}
          onClick={e =>
            setSelectedNodePaths(state => {
              let newPath = updateArrayIndex(
                state[entryId],
                depth,
                neighborId
              ).slice(0, depth + 1);
              newPath;
              if (neighborId === state[entryId][newPath.length - 1]) {
                // console.log(neighborId, newPath[newPath.length - 1]);
                newPath = newPath.splice(0, newPath.length - 1);
              }

              const newState = {
                ...state,
                [entryId]: newPath
              };

              return newState;
            })
          }
        >
          {getNodeType(neighborId)}
        </NeighborLink>
      );
    });

    return <NeighborOuter>{NeighborLinks}</NeighborOuter>;
  };

  return (
    <div>
      {entryIds.map(entryId => {
        return (
          <EntryPointOuter key={entryId}>
            <EntryPointText style={{ fontWeight: "bold" }}>
              {getText(entryId)}
              <>{makeNeighborLinks(entryId, entryId, 0)}</>
            </EntryPointText>
            {selectedNodePaths[entryId].map((activeTabId, depth) => {
              return (
                <EntryPointText
                  key={activeTabId + depth}
                  style={{ marginLeft: (depth*10) + 5}}
                >
                  {getNodeContext(activeTabId)}
                  <>{makeNeighborLinks(entryId, activeTabId, depth + 1)}</>
                </EntryPointText>
              );
            })}
          </EntryPointOuter>
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
