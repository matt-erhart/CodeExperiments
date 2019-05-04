import * as cola from 'webcola'
let layout = new cola.Layout()
import throttle from 'lodash/throttle'
const post = throttle(() => postMessage(layout.nodes()), 0) // send back result

addEventListener('message', ({ data, timeStamp }) => {
  const { graph, width, height } = data

  layout
    .size([width, height])
    .nodes(graph.nodes)
    .links(graph.links)
    .handleDisconnected(false) // handle disconnected repacks the components which would hide any drift
    .avoidOverlaps(true)
    .jaccardLinkLengths(10, 5)
    .on(cola.EventType.start, e => {
      // this.setState({ nodes: [...this.layout.nodes()] })
    })
    .on(cola.EventType.end, e => {
      // this.setState({ nodes: [...this.layout.nodes()] })
      // console.log(e)
    })
    .on('tick', e => {
      post()
      // this.setState({ nodes: [...this.layout.nodes()], alpha: e.alpha }, () =>
      //   console.log('SETSTATE')
      // )
      // this.forceUpdate()
      // console.log(e)
    })
    .start(20, 0, 20)
})
