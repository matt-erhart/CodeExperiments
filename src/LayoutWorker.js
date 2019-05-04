import * as cola from 'webcola'
let layout = new cola.Layout()

addEventListener('message', ({ data, timeStamp }) => {
  const { graph, width, height } = data
  layout
    .size([width, height])
    .nodes(graph.nodes)
    .links(graph.links)
    .convergenceThreshold(0.01)
    .handleDisconnected(false) // handle disconnected repacks the components which would hide any drift
    .avoidOverlaps(true)
    .jaccardLinkLengths(20, 5)
    .on(cola.EventType.start, e => {
      // this.setState({ nodes: [...this.layout.nodes()] })
    })
    .on(cola.EventType.end, e => {
      // this.setState({ nodes: [...this.layout.nodes()] })
      // console.log(e)
    })
    .on('tick', e => {
      postMessage(layout.nodes()) // send back result

      // this.setState({ nodes: [...this.layout.nodes()], alpha: e.alpha }, () =>
      //   console.log('SETSTATE')
      // )
      // this.forceUpdate()
      // console.log(e)
    })
    .start()
})

