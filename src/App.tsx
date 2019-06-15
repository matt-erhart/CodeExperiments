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
import {PageText} from './pdfText/PageText'
export const App = () => {
  return (
    <PageText   />
  )
}

export default App

