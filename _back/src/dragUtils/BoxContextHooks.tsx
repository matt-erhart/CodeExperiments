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
import {} from './BoxContextHooks'
import { useImmer } from 'use-immer'

export function useDragPoints(
  drag: ReturnType<typeof useDrag>,
  el: React.RefObject<HTMLElement> //todo infer from linage
) {
  const [points, setPoints] = useState({
    first: { x: 0, y: 0, type: '', id: '' },
    second: { x: 0, y: 0, type: '', id: '' },
    movement: { x: 0, y: 0 },
    isDragging: false,
  })

  useEffect(() => {
    if (!drag) return undefined
    // important note: offsetX + offsetY handles zoom right, but not multiple els
    const browserZoom = getBrowserZoom()

    // x,y could be scaled differently, need
    const { type, movementX, movementY, clientX, clientY, target } = drag
    const { second } = points
    const { x, y, scaleX, scaleY } = getPointInElement(el.current, {
      clientX,
      clientY,
    })

    switch (type) {
      case 'mousedown':
        // valid start component
        const point = {
          x,
          y,
          type,
          id: (target as HTMLElement).id,
        }

        setPoints({
          ...points,
          first: point,
          second: point,
          movement: { x: 0, y: 0 },
          isDragging: true,
        })
        break

      case 'mousemove':
        setPoints({
          ...points,
          second: {
            x,
            y,
            type,
            id: (target as HTMLElement).id,
          },
          movement: {
            x: movementX / scaleX / browserZoom,
            y: movementY / scaleY / browserZoom,
          },
          isDragging: true,
        })
        break
      case 'mouseup':
        setPoints({
          ...points,
          second: {
            x,
            y,
            type,
            id: (target as HTMLElement).id,
          },
          movement: {
            x: 0,
            y: 0,
          },
          isDragging: false,
        })
        break
      default:
        return undefined
    }
  }, [drag])
  return points
}

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
    (points: ReturnType<typeof useDragPoints>) => {
      setBoxes(boxes => {
        // todo immer
        return boxes.map(box => {
          if (selectedIds.includes(box.id)) {
            return {
              ...box,
              left: box.left + points.movement.x,
              top: box.top + points.movement.y,
            }
          } else {
            return box
          }
        })
      })
    },
    [setBoxes, selectedIds]
  )

  const resizeBox = React.useCallback(
    (newBox: Box) => {
      const {id, left, top, width, height} = newBox
      setBoxes(boxes => {
        return boxes.map(box => {
          if (id === box.id) {
            return {id, left, top, width, height}
          } else {
            return box
          }
        })
      })
    },
    [setBoxes]
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
    resizeBox
  }
}
export { BoxesProvider, useBoxes }
