import * as React from 'react'
import { DragTestDraw } from './dragUtils/DragTest'
import { BoxesProvider } from './dragUtils/BoxContextHooks'
import { getElementScale, getBrowserZoom } from './dragUtils/geometryFromHtml'
import { Div100vh } from './Custom'
import {
  useState,
  useRef,
  useCallback,
  useEffect,
  useLayoutEffect,
} from 'react'
import { useImmer } from "use-immer";
import interact from 'interactjs'
import '@interactjs/types'

export const _App = () => {
  return (
    <BoxesProvider>
      <DragTestDraw />
    </BoxesProvider>
  )
}

export const App = () => {
  const divRef = useRef(null)
  const [box, setBox] = useImmer({ left: 50, top: 50, width: 100, height: 100 })

  useLayoutEffect(() => {
    interact(divRef.current)
      .draggable(true)
      .resizable({
        edges: { left: true, right: true, bottom: true, top: true },
      })
      .on('dragmove', (e: Interact.DragEvent) => {
        const { scaleX, scaleY } = getElementScale(e.target as HTMLElement)
        const { dx, dy } = e
        setBox(box => ({
          ...box,
          left: box.left + dx / scaleX,
          top: box.top + dy / scaleY,
        }))
      })
      .on('resizemove' as Interact.OnEventName, (e: Interact.ResizeEvent) => {
        const { left, top, width, height } = e.deltaRect
        const { scaleX, scaleY } = getElementScale(e.target as HTMLElement)

        setBox(box => ({
          width: box.width + width / scaleX,
          height: box.height + height / scaleY,
          left: box.left + left / scaleX,
          top: box.top + top / scaleY,
        }))
      })
    return () => interact(divRef.current).unset()
  }, [])

  return (
    <Div100vh>
      <div
        ref={divRef}
        style={{ position: 'absolute', ...box, border: '1px solid green', padding: 5 }}
      >
        {' '}
        hey
      </div>
    </Div100vh>
  )
}
