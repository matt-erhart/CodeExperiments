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

export type BoxLTWH = {
  // ltwb = left, top, width, height
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

export const boxLTHWToBoxEdges = (box: BoxLTWH): BoxEdges => {
  const { left, top, width, height } = box
  return {
    minX: left,
    minY: top,
    maxX: left + width,
    maxY: top + height,
  }
}

export const boxEdgesToBoxLTHW = (edges: BoxEdges): BoxLTWH => {
  const { minX, maxX, minY, maxY } = edges
  return {
    left: minX,
    top: minY,
    width: maxX - minX,
    height: maxY - minY,
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
  const [minX, maxX] = [xys.x1, xys.x2].sort()
  const [minY, maxY] = [xys.y1, xys.y2].sort()

  return boxEdgesToBoxLTHW({ minX, maxX, minY, maxY })
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
  console.log('drag: ', drag)
  const ltwh = useDragRect(drag)
  console.log('ltwh: ', ltwh)

  return (
    <Div100vh ref={divRef}>
      <DivRect style={{ ...ltwh }} />
    </Div100vh>
  )
}
