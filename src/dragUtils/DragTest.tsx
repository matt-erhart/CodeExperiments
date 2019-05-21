import * as React from 'react'
import { useState, useRef, useCallback, useEffect } from 'react'
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

function useDragRect(drag: ReturnType<typeof useDrag>) {
  const [xys, setXys] = useState({ x1: 0, y1: 0, x2: 0, y2: 0 })
  useEffect(() => {
    if (!drag) return undefined
    const { type, movementX, movementY, clientX, clientY } = drag
    const { x1, y1, x2, y2 } = xys
    switch (type) {
      case 'mousedown':
        setXys({ ...xys, x1: clientX, y1: clientY, x2: clientX, y2: clientY })
        break
      case 'mousemove':
      case 'mouseup':
        setXys({
          ...xys,
          x2: x2 + movementX,
          y2: y2 + movementY,
        })
        break
      default:
        return undefined
    }
  }, [drag])
  const [minX, maxX] = [Math.min(xys.x1, xys.x2), Math.max(xys.x1, xys.x2)]
  const [minY, maxY] = [Math.min(xys.y1, xys.y2), Math.max(xys.y1, xys.y2)]

  return edgesToBox({ minX, maxX, minY, maxY })
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
  const divRef = useRef(null)
  const drag = useDrag(divRef)

  const ltwh = useDragRect(drag)

  return (
    <Div100vh ref={divRef}>
      <DivRect style={{ ...ltwh }} />
    </Div100vh>
  )
}
