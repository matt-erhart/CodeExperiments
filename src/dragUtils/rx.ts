// if we need touch screens: https://varun.ca/drag-with-rxjs/
import { fromEvent, merge } from 'rxjs'
import {
  startWith,
  takeWhile,
  exhaustMap as mapUntilInnerDone,
  filter,
} from 'rxjs/operators'
/**
 *
 * @param mouseDown : e.g. pass in an event from a react event handler
 * movementX, movementY, type are particularly useful for dragging
 */
export const dragData = (el: HTMLElement) => {
  if (!el) return null

  const mousedown = fromEvent<MouseEvent>(el, 'mousedown')

  const mousemove = fromEvent<MouseEvent>(
    document, // not el because we'll mouse over multiple els
    'mousemove'
  )

  const mouseup = fromEvent<MouseEvent>(document, 'mouseup')
  const moveOrUp = merge(mousemove, mouseup)

  return mousedown.pipe(
    mapUntilInnerDone(down => {
      return moveOrUp.pipe(
        startWith(down),
        takeWhile(moveOrUp => moveOrUp.type !== 'mouseup', true)
      )
    })
  )
}

// rx + react
import { useState, useRef, useEffect } from 'react'

export const useDrag = (reactRef: React.RefObject<HTMLElement>) => {
  if (!reactRef) return undefined
  const [mouseDrag, setMouseDrag] = useState(null as MouseEvent)
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
