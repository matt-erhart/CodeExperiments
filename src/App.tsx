import * as React from 'react'
import { useEffect } from 'react'
import { DragTestLeftTop, DragTestDraw } from './dragUtils/DragTest'
import { BoxesProvider } from './dragUtils/DragTest'
const logit = e => {
  console.log('event:', e)
}

// export const App = () => <DragTestLeftTop />
export const App = () => {
  useEffect(() => {
    window.addEventListener('drag', logit)
    return () => window.removeEventListener('drag', logit)
  }, [])
  return (
    <BoxesProvider>
      <DragTestDraw />
    </BoxesProvider>
  )
}
