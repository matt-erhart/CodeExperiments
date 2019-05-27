import * as React from 'react'
import { DragTestDraw } from './dragUtils/DragTest'
import { BoxesProvider } from './dragUtils/BoxContextHooks'

export const App = () => {
  return (
    <BoxesProvider>
      <DragTestDraw />
    </BoxesProvider>
  )
}
