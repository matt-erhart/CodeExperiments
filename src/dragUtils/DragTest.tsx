import * as React from 'react'
import { useState, useRef, useCallback, useEffect } from 'react'
import { dragData } from './rx'

function useDragData(reactRef: React.RefObject<HTMLElement>) {
  if (!reactRef) return undefined
  const [drag, setDrag] = useState({ type: '', movementX: 0, movementY: 0 })
  const sub = useRef(null)
  useEffect(() => {
    sub.current = dragData(reactRef.current).subscribe(event => {
      const { type, movementX, movementY } = event
      setDrag({ type, movementX, movementY })
    })
    return () => {
      !!sub && sub.current.unsubscribe()
    }
  }, [])

  return drag
}

function useDragLeftTop(drag, _leftTop = { left: 0, top: 0 }) {
  const [leftTop, setLeftTop] = useState(_leftTop)
  useEffect(() => {
    const { type, movementX, movementY } = drag
    const { left, top } = leftTop
    setLeftTop({ left: left + movementX, top: top + movementY })
  }, [drag])
  return leftTop
}

export const DragTest = () => {
  const divRef = useRef(null)
  const drag = useDragData(divRef)
  const leftTop = useDragLeftTop(drag)
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
