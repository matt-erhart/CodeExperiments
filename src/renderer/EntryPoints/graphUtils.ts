export interface GraphNode {
  id: string;
  data: {
      isEntryPoint: boolean;
      text: string;
      type: string;
  }
}

export interface GraphLink {
  id: string;
  source: string;
  target: string;
}

export interface Nodes {
    [id: string]: GraphNode
}

export interface Links {
    [id: string]: GraphLink
}

export const getNeighborhood = (
  nodeIds: string[],
  nodes: Nodes,
  links: Links
): { links: GraphLink[]; nodes: GraphNode[] } => {
  let res = { links: [], nodes: [] };
  Object.values(links).forEach((link: GraphLink) => {
    const sourceMatches = nodeIds.includes(link.source);
    const targetMatches = nodeIds.includes(link.target);
    if (sourceMatches || targetMatches) {
      res.links.push(link);
    }
    if (sourceMatches) res.nodes.push(nodes[link.target]);
    if (targetMatches) res.nodes.push(nodes[link.source]);
  });
  //   res.nodes = unique(res.nodes);
  return res;
};
