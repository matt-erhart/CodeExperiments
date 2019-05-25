import * as React from 'react'
import { useEffect, useRef, useState } from 'react'
import { DragTestLeftTop, DragTestDraw } from './dragUtils/DragTest'
import { BoxesProvider } from './dragUtils/DragTest'
const logit = e => {
  console.log('event:', e)
}

// export const App = () => <DragTestLeftTop />
// export const App = () => {
//   return (
//     <BoxesProvider>
//       <DragTestDraw />
//     </BoxesProvider>
//   )
// }
/**
 * const transed =  Math.round((e.clientX - bbox.left) / scale);
 */

// coordinates test
export const App = () => {
  const ref = useRef(null)
  const [coords, setCoords] = useState({ left: 0, top: 0 })
  const scale = 1.2
  return (
    <div>
      <div
        ref={ref}
        style={{
          position: 'absolute',
          left: '10px',
          top: '10px',
          margin: '10px',
          width: '1000px',
          height: '1000px',
          outline: '1px solid black',
          transform: `scale(${scale})`,
        }}
        onMouseDown={e => {
          const bbox = ref.current.getBoundingClientRect()
          const browserZoom =
            Math.round((window.outerWidth / window.innerWidth) * 100) / 100
          const transedX = Math.round((e.clientX - bbox.left) / scale)
          const transedY = Math.round((e.clientY - bbox.top) / scale)
          setCoords({left: transedX, top: transedY})
          console.log('e.clientX-e.offsetX: ', transedX - e.nativeEvent.offsetX)
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
  )
}
