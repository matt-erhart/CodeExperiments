import * as React from 'react'
import { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import { dragData } from './rx'
import { Div100vh, DivRect } from '../Custom'
const hyperid = require('hyperid')
const makeUid = hyperid()
const memoize = require('fast-memoize')

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
  id?: string
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

export const movementZoomAdjust = (
  movement: { movementX: number; movementY: number },
  zooms: number[]
) => {
  const browserZoom =
    Math.round((window.outerWidth / window.innerWidth) * 100) / 100

  if (!movement) return { movementX: 0, movementY: 0 }

  const { movementX, movementY } = movement

  return {
    movementX: movementX / browserZoom,
    movementY: movementY / browserZoom,
  }
}

function useDragPoints(drag: ReturnType<typeof useDrag>) {
  const [points, setPoints] = useState({
    first: { x: 0, y: 0, type: '', id: '' },
    second: { x: 0, y: 0, type: '', id: '' },
  })
  useEffect(() => {
    if (!drag) return undefined
    const {
      type,
      movementX: _moveX,
      movementY: _moveY,
      clientX,
      clientY,
      target,
    } = drag
    const { movementX, movementY } = movementZoomAdjust(
      { movementX: _moveX, movementY: _moveY },
      []
    )
    const { second } = points
    switch (type) {
      case 'mousedown':
        const point = {
          x: clientX,
          y: clientY,
          type,
          id: (target as HTMLElement).id,
        }
        setPoints({
          ...points,
          first: point,
          second: point,
        })
        break
      case 'mousemove':
      case 'mouseup':
        setPoints({
          ...points,
          second: {
            x: second.x + movementX,
            y: second.y + movementY,
            type,
            id: (target as HTMLElement).id,
          },
        })
        break
      default:
        return undefined
    }
  }, [drag])
  return points
}

export const DragTestLeftTop = props => {
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
      {props.children}
    </div>
  )
}

export const DragTestDraw = () => {
  const [mode, setMode] = useState('')
  const divRef = useRef(null)
  const drag = useDrag(divRef)
  const points = useDragPoints(drag)

  const box = pointsToBox(points)
  const {
    boxes,
    addBox,
    addId,
    selectedIds,
    selectOneId,
    moveSelectedBoxes,
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
      points.first.id !== 'container'
    ) {
      const { movementX, movementY } = drag
      // apply zoom at root data
      moveSelectedBoxes({ movementX, movementY })
      // setBoxes([...boxes, { id, ...box }])
    }
  }, [points])

  let selectOneIdMemo = useRef(
    memoize((id: string) => e => {
      selectOneId(id)
    })
  )

  let preventDefault = useCallback(e => e.preventDefault(), [])

  const showSelectorBox = points.first.id === 'container' //(drag.target as HTMLElement).id === 'container'
  const SelectorBox = showSelectorBox
    ? () => <DivRect draggable={false} style={box} />
    : () => null

  return (
    // userSelect: none or it'll do a drag event which will break everything
    <Div100vh
      id={'container'}
      style={{ userSelect: 'none', transform: 'scale(1)' }}
      ref={divRef}
    >
      <SelectorBox />
      {boxes.length > 0 &&
        boxes.map((b, ix) => {
          const isSelected = selectedIds.includes(b.id)
          return (
            <DivRect
              draggable={false}
              onDrag={preventDefault}
              key={b.id}
              id={b.id}
              style={b}
              isSelected={isSelected}
              onMouseDown={selectOneIdMemo.current(b.id)}
            />
          )
        })}
    </Div100vh>
  )
}

// CONTEXT /////////////////////////////////////////////////////
type BoxesContextValue = {
  boxes: Box[]
  setBoxes: React.Dispatch<React.SetStateAction<Box[]>>
  selectedIds: string[]
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>
}

const BoxContext = React.createContext<BoxesContextValue | undefined>(undefined)

type BoxProviderProps = {
  value?: BoxesContextValue
  children: React.ReactNode
}

function BoxesProvider(props: BoxProviderProps) {
  const [boxes, setBoxes] = useState(() => [])
  const [selectedIds, setSelectedIds] = useState(() => [])

  const value = React.useMemo(() => {
    return {
      boxes,
      setBoxes,
      selectedIds,
      setSelectedIds,
    }
  }, [boxes, selectedIds])
  return <BoxContext.Provider value={value} {...props} />
}

// useBoxes() /////////////////////////////////////////////////////
function useBoxes() {
  const context = React.useContext(BoxContext)

  if (!context) {
    throw new Error('useBoxes must be used within a BoxesProvider')
  }

  const { boxes, setBoxes, selectedIds, setSelectedIds } = context
  const addBox = React.useCallback(box => setBoxes(boxes => [...boxes, box]), [
    setBoxes,
  ])

  const moveSelectedBoxes = React.useCallback(
    (movement: { movementX: number; movementY: number }) => {
      const { movementX, movementY } = movement
      setBoxes(boxes => {
        // todo immer
        return boxes.map(box => {
          
          if (selectedIds.includes(box.id)) {
            return {
              ...box,
              left: box.left + movementX,
              top: box.top + movementY,
            }
          } else {
            return box
          }
        })
      })
    },
    [setBoxes, selectedIds]
  )

  const addId = React.useCallback(
    (id: string) => setSelectedIds(ids => [...ids, id]),
    [setSelectedIds]
  )
  const selectOneId = React.useCallback((id: string) => setSelectedIds([id]), [
    setSelectedIds,
  ])
  // move many
  // add many
  return {
    boxes,
    addBox,
    selectedIds,
    addId,
    selectOneId,
    moveSelectedBoxes,
  }
}
export { BoxesProvider, useBoxes }
