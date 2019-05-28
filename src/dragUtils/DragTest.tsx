import * as React from 'react'
import { useState, useRef, useCallback, useEffect } from 'react'
import { useDrag } from './rx'
import { Div100vh, DivRect } from '../Custom'
const hyperid = require('hyperid')
const makeUid = hyperid()
const memoize = require('fast-memoize')
import {
  boxToEdges,
  edgesToBox,
  pointsToBox,
  Box,
  BoxEdges,
  Point2d,
} from './geometry'
import { getBrowserZoom, getPointInElement } from './geometryFromHtml'
import { useBoxes, useDragPoints } from './BoxContextHooks'
import { getEdgeHoverData } from './getEdgeHoverData'
import { DivDraggablePadding } from './ResizableDiv'

export const DragTestDraw = () => {
  const [mode, setMode] = useState('')
  const divRef = useRef(null)
  const drag = useDrag(divRef)
  const points = useDragPoints(drag, divRef)
  console.log('points: ', points);

  const box = pointsToBox(points)
  const {
    boxes,
    addBox,
    addId,
    selectedIds,
    selectOneId,
    moveSelectedBoxes,
    resizeBox,
  } = useBoxes()

  useEffect(() => {
    if (
      !!points &&
      points.second.type === 'mouseup' &&
      points.first.id === 'container'
    ) {
      const id = boxes.length //makeUid()
      addBox({ id, ...box })
      // setBoxes([...boxes, { id, ...box }])
    }
    if (
      !!points &&
      points.second.type === 'mousemove' &&
      !['container', 'resizable'].includes(points.first.id)
    ) {
      // apply zoom at root data
      moveSelectedBoxes(points)
      // setBoxes([...boxes, { id, ...box }])
    }
  }, [points, selectedIds])

  let selectOneIdMemo = useRef(
    memoize((id: string) => e => {
      selectOneId(id)
    })
  )

  let preventDefault = useCallback(e => e.preventDefault(), [])

  const showSelectorBox = points.first.id === 'container' //(drag.target as HTMLElement).id === 'container'
  const SelectorBox = showSelectorBox
    ? () => <DivRect draggable={false} style={box} emitEvents={false} />
    : () => null

  return (
    // userSelect: none or it'll do a drag event which will break everything
    <>
      <div>hey</div>
      <Div100vh
        id={'container'}
        style={{ userSelect: 'none', transform: 'scale(.5)' }}
        ref={divRef}
      >
        <SelectorBox />
        {boxes.length > 0 &&
          boxes.map((b, ix) => {
            const isSelected = selectedIds.includes(b.id)
            return (
              // <DivRect
              //   draggable={false}
              //   onDrag={preventDefault}
              //   key={b.id}
              //   id={b.id}
              //   style={b}
              //   isSelected={isSelected}
              //   onMouseDown={selectOneIdMemo.current(b.id)}
              //   emitEvents={!points.isDragging}
              // />
              <DivDraggablePadding
                key={b.id}
                id={'resizable'}
                style={b}
                onResize={resizeBox}
              >
                <div id='drag-handle' onMouseDown={selectOneIdMemo.current(b.id)}>hey</div>
              </DivDraggablePadding>
            )
          })}
      </Div100vh>
    </>
  )
}
