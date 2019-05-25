import * as React from 'react'
import { useEffect, useRef, useState } from 'react'
import { DragTestLeftTop, DragTestDraw } from './dragUtils/DragTest'
import { BoxesProvider } from './dragUtils/DragTest'
const logit = e => {
  console.log('event:', e)
}

// export const App = () => <DragTestLeftTop />
export const App = () => {
  return (
    <BoxesProvider>
      <DragTestDraw />
    </BoxesProvider>
  )
}
/**
 * const transed =  Math.round((e.clientX - bbox.left) / scale);
 */

// coordinates test
export const _App = () => {
  const ref = useRef(null)
  const [coords, setCoords] = useState({ left: 0, top: 0 })
  const scale = 1.1
  return (
    <div style={{ transform: `scale(${scale})` }}>
      <div style={{ transform: `scale(${scale})` }}>
        <div style={{ height: '100px' }}>style</div>
        <div
          ref={ref}
          style={{
            position: 'absolute',
            left: '10px',
            top: '10px',
            margin: '10px',
            width: '50vh',
            height: '50vh',
            outline: '1px solid black',
            transform: `scale(${scale}) translateX(100px)`,
            transformOrigin: 'bottom',
          }}
          onMouseDown={e => {
            const bbox = ref.current.getBoundingClientRect()
            const { offsetWidth, offsetHeight } = ref.current

            // DND MAGIC
            const effectiveScaleX = bbox.width / ref.current.offsetWidth || 1
            const effectiveScaleY = bbox.height / ref.current.offsetHeight || 1

            const browserZoom =
              Math.round((window.outerWidth / window.innerWidth) * 100) / 100
            // x,y could be scaled differently, need two numbers

            const transedX = Math.round(
              (e.clientX - bbox.left) / effectiveScaleX
            )
            const transedY = Math.round(
              (e.clientY - bbox.top) / effectiveScaleY
            )
            setCoords({ left: transedX, top: transedY })
            console.log(
              'e.clientX-e.offsetX: ',
              transedX - e.nativeEvent.offsetX
            )
          }}
        >
          <div
            style={{
              outline: '1px solid blue',
              position: 'absolute',
              left: coords.left,
              top: coords.top,
            }}
          />
        </div>
      </div>
    </div>
  )
}
