import * as React from 'react'
import { useState, useRef, useCallback, useEffect } from 'react'
import { useDrag } from './rx'
import { getEdgeHoverData, hoverInfo } from './getEdgeHoverData'
import styled from 'styled-components'
import { useDragPoints } from './BoxContextHooks'
import {
  boxToEdges,
  edgesToBox,
  pointsToBox,
  Box,
  BoxEdges,
  Point2d,
} from './geometry'

const StyledDiv = styled.div<{ cursor?: React.CSSProperties['cursor'] }>`
  position: absolute;
  border: 1px solid hsl(220, 82%, 66%);
  padding: 15px;
  cursor: ${props => !!props.cursor && props.cursor};
  display: flex;
`

const resize = (
  box: Box,
  movement: { x: number; y: number },
  location: string
) => {
  if (!box || !movement || !location) return null

  const { x: moveX, y: moveY } = movement
  const { left, top, width, height } = box

  // use this as a switch statement, but corner updates need this too
  const updateSides = {
    right: { width: width + moveX },
    bottom: { height: height + moveY },
    top: { top: top + moveY, height: height - moveY },
    left: { left: left + moveX, width: width - moveX },
  }

  // just like a switch statement
  const update = {
    ...updateSides, // right, bottom, top, left
    topLeft: { ...updateSides.top, ...updateSides.left },
    topRight: { ...updateSides.top, ...updateSides.right },
    bottomRight: { ...updateSides.bottom, ...updateSides.right },
    bottomLeft: { ...updateSides.bottom, ...updateSides.left },
  }

  const newBox = { ...box, ...update[location] }
  return newBox
}

export const DivDraggablePadding = React.memo<{ onResize } & any>(props => {
  const [edgeData, setEdgeData] = useState({
    cursor: 'default',
    location: 'default',
  } as ReturnType<typeof getEdgeHoverData>)

  const [mouseDownLocation, setMouseDownLocation] = useState('' as ReturnType<
    typeof getEdgeHoverData
  >['location'])

  const divRef = useRef(null)
  const drag = useDrag(divRef)
  const points = useDragPoints(drag, divRef)
  let preventDefault = useCallback(e => e.preventDefault(), []) // todo usePreventDef

  // for cursor changes
  const onHover = useCallback(
    e => {
      const newEdgeData = getEdgeHoverData(e)
      if (newEdgeData.cursor !== edgeData.cursor) {
        setEdgeData(newEdgeData)
      }
    },
    [edgeData.cursor]
  )

  // for resizing
  const onMouseDown = useCallback(
    e => {
      const { location } = getEdgeHoverData(e)
      if (mouseDownLocation !== location) {
        setMouseDownLocation(location)
      }
    },
    [mouseDownLocation]
  )

  useEffect(() => {
    const newBox = resize(props.style, points.movement, mouseDownLocation)
    if (newBox && !!props.onResize) {
      
      props.onResize({ id: props.id, ...newBox })
    }
  }, [points.movement, mouseDownLocation])

  return (
    <StyledDiv
      ref={divRef}
      draggable={false}
      onDrag={preventDefault}
      onMouseMove={onHover}
      cursor={edgeData.cursor}
      onMouseDown={onMouseDown}
      {...props}
    >
      {props.children}
    </StyledDiv>
  )
})
