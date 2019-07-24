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
import { useImmer } from 'use-immer'
import interact from 'interactjs'
import '@interactjs/types'
import { PageText } from './pdfText/PageText'
import * as d3 from 'd3'

export const dispatchLog = (detail) => {
  // takes about .22-.5 ms
  const logEvent = new CustomEvent('log', {detail})
  window.dispatchEvent(logEvent)
}

export const logCallback = e => {
  console.log(e.detail);
}

export const useLogHook = () => useEffect(()=> {
  window.addEventListener('log', logCallback)
  return window.removeEventListener('log', logCallback)
},[])

export const App = () => {
  const [transStr, setTransString] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const d3Ref = d3.select(ref.current)
    d3Ref.call(
      d3
        .zoom<HTMLDivElement, any>()
        .scaleExtent([0.5, 5])
        .on('zoom', () => {
          var transform = d3.zoomTransform(d3Ref.node())
          const { k, x, y } = transform
          dispatchLog(0)

          setTransString(trans => {
            const newStr = `scale(${k}) translate(${x}px,${y}px)`
            return newStr
          })

        })
    )
  }, [setTransString])

  useEffect(()=> {
    window.addEventListener('log', logCallback)
    // DispatchLog()

    return () => window.removeEventListener('log', logCallback)
  },[])

  return (
    <div
      ref={ref}
      style={{ width: 700, height: 700, border: '1px solid green' }}
    >
      <div
        style={{
          width: 700,
          height: 700,
          transform: transStr,
          transformOrigin: 'top left',
          background:
            'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%)',
        }}
      >
        <div
          className="box"
          style={{
            position: 'absolute',
            left: 50,
            top: 50,
            width: 50,
            height: 50,
            border: '1px solid black',
          }}
        />
      </div>
    </div>
  )
}
console.log(1)
export default App
import * as use from '@tensorflow-models/universal-sentence-encoder';
use.load().then(model => {
    // Embed an array of sentences.
    const sentences = [
      'Hello.',
      'How are you?'
    ];
    model.embed(sentences).then(embeddings => {
      // `embeddings` is a 2D tensor consisting of the 512-dimensional embeddings for each sentence.
      // So in this example `embeddings` has the shape [2, 512].
      embeddings.print(true /* verbose */);
    });
  });