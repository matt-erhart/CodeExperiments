import * as React from "react";
import styled from "styled-components";


export const NeighborOuter = styled.div`
  /* display: inline-block; */
  margin: 5px;
  padding: 5px;
  font-size: 18px;
  display: inline-block;
`;

export const NeighborLink = styled.span`
  margin: 5px;
  padding: 5px;
  border: 1px solid lightblue;
  white-space: nowrap;
  font-weight: normal;
  cursor: pointer;
`;

export const EntryPointOuter = styled.div`
  margin: 25px;
  padding: 15px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
`;

export const EntryPointText = styled.div`
  font-size: 22px;
  padding-top: 5px;
  padding-bottom: 5px;
  flex: 1;
  &:not(:last-child) {
    border-bottom: 1px solid lightgrey;
  }
`;

export const NodeItem = styled.span`
  margin: 25px;
  padding: 15px;
  border: 1px solid grey;
`;
