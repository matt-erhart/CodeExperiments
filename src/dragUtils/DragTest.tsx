import * as React from 'react'
import { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import { dragData } from './rx'
import { Div100vh, DivRect } from '../Custom'

function useDrag(reactRef: React.RefObject<HTMLElement>) {
  if (!reactRef) return undefined
  const [mouseDrag, setMouseDrag] = useState(null as React.MouseEvent<
    HTMLElement,
    MouseEvent
  >)
  const sub = useRef(null)
  useEffect(() => {
    sub.current = dragData(reactRef.current).subscribe(event => {
      setMouseDrag(event)
    })
    return () => {
      !!sub && sub.current.unsubscribe()
    }
  }, [])
  return mouseDrag
}

function useDragLeftTop(
  drag: ReturnType<typeof useDrag>,
  lt = { left: 0, top: 0 }
) {
  const [leftTop, setLeftTop] = useState(lt)
  useEffect(() => {
    if (!drag || !lt) return undefined
    const { type, movementX, movementY } = drag
    const { left, top } = leftTop
    setLeftTop({ left: left + movementX, top: top + movementY })
  }, [drag])
  return leftTop
}

export type Box = {
  // absolute position of box with css
  left: number
  top: number
  width: number
  height: number
}

export type BoxEdges = {
  minX: number // left
  minY: number // top
  maxX: number // right
  maxY: number // bottom
}

export type Point = {
  x: number
  y: number
}

export const boxToEdges = (box: Box): BoxEdges => {
  const { left, top, width, height } = box
  return {
    minX: left,
    minY: top,
    maxX: left + width,
    maxY: top + height,
  }
}

export const edgesToBox = (edges: BoxEdges): Box => {
  const { minX, maxX, minY, maxY } = edges
  return {
    left: minX,
    top: minY,
    width: Math.abs(maxX - minX),
    height: Math.abs(maxY - minY),
  }
}

export const pointsToBox = (points: { first: Point; second: Point }): Box => {
  const { first, second } = points
  const [minX, maxX] = [
    Math.min(first.x, second.x),
    Math.max(first.x, second.x),
  ]
  const [minY, maxY] = [
    Math.min(first.y, second.y),
    Math.max(first.y, second.y),
  ]

  return edgesToBox({ minX, maxX, minY, maxY })
}

function useDragPoints(drag: ReturnType<typeof useDrag>) {
  const [points, setPoints] = useState({
    first: { x: 0, y: 0 },
    second: { x: 0, y: 0 },
  })
  useEffect(() => {
    if (!drag) return undefined
    const { type, movementX, movementY, clientX, clientY } = drag
    const { first, second } = points
    switch (type) {
      case 'mousedown':
        setPoints({
          ...points,
          first: { x: clientX, y: clientY },
          second: { x: clientX, y: clientY },
        })
        break
      case 'mousemove':
      case 'mouseup':
        setPoints({
          ...points,
          second: {
            x: second.x + movementX,
            y: second.y + movementY,
          },
        })
        break
      default:
        return undefined
    }
  }, [drag])
  return points
}

export const DragTestLeftTop = () => {
  const divRef = useRef(null)
  const drag = useDrag(divRef)
  const leftTop = useDragLeftTop(drag, { left: 0, top: 0 })
  return (
    <div
      ref={divRef}
      style={{
        outline: '1px solid black',
        display: 'inline-block',
        padding: 5,
        position: 'absolute',
        userSelect: 'none',
        ...leftTop,
      }}
    >
      hey
    </div>
  )
}

export const DragTestDraw = () => {
  const [boxes, setBoxes] = useState([])
  const divRef = useRef(null)
  const drag = useDrag(divRef)

  const points = useDragPoints(drag)
  const box = pointsToBox(points)
  useEffect(() => {
    if (!!drag && drag.type === 'mouseup') {
      const id = boxes.length + 1
      setBoxes([...boxes, { id, ...box }])
    }
  }, [drag, points])

  return (
    // userSelect: none or it'll do a drag event which will break everything
    <Div100vh style={{ userSelect: 'none' }} ref={divRef}>
      <DivRect draggable={false} style={{ ...box }} />
      {boxes.length > 0 &&
        boxes.map((b, ix) => {
          return (
            <DivRect
              draggable={false}
              onDrag={e => e.preventDefault()}
              key={b.id}
              style={b}
            />
          )
        })}
    </Div100vh>
  )
}
