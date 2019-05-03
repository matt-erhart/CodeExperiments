// lib
import * as React from 'react'
import * as d3 from 'd3'
import * as cola from 'webcola'

// custom
import { DivStage } from './DivStage'

const graph = {
  nodes: [
    { width: 101, height: 101 },
    { width: 10, height: 10 },
    { width: 10, height: 101 },
    { width: 101, height: 110 },
    { width: 10, height: 10 },
    { width: 10, height: 110 },
    { width: 110, height: 110 },
    { width: 110, height: 110 },
  ],
  links: [
    { source: 1, target: 2, value: 1 },
    { source: 2, target: 4, value: 8 },
    { source: 7, target: 5, value: 10 },
    { source: 5, target: 2, value: 6 },
  ],
}

/**
 * @class **ForceLayout**
 */
const ForceLayoutDefaults = {
  props: {},
  state: { nodes: undefined as cola.Node[] },
}
export class ForceLayout extends React.Component<
  typeof ForceLayoutDefaults.props,
  typeof ForceLayoutDefaults.state
> {
  static defaultProps = ForceLayoutDefaults.props
  state = ForceLayoutDefaults.state
  private stage = React.createRef<HTMLDivElement>()
  private layout = new cola.Layout()

  componentDidMount() {
    console.log('mount')
    const { width, height } = this.stage.current.getBoundingClientRect()
    console.log('width, height: ', width, height)
    this.layout
      .flowLayout('y', 30)
      .jaccardLinkLengths(50, 5)
      .size([width, height])
      .nodes(graph.nodes)
      .links(graph.links)
      .handleDisconnected(false) // handle disconnected repacks the components which would hide any drift
      .avoidOverlaps(true)
      .on(cola.EventType.tick, () => {
        this.setState({ nodes: this.layout.nodes() })
      })
      // .on(cola.EventType.end, () => {
      //   console.log('END')
      //   this.setState({ nodes: this.layout.nodes() })
      // })
      .start(30, 10, 301, 111)
  }

  render() {
    return (
      <DivStage ref={this.stage}>
        {this.state.nodes &&
          this.state.nodes.map((node, ix) => {
            return (
              <div
                key={ix}
                style={{
                  position: 'absolute',
                  transform: `translate(${node.x - node.width / 2}px, ${node.y -
                    node.height / 2}px)`,
                  width: node.width,
                  height: node.height,
                  border: '1px solid black',
                }}
              />
            )
          })}
      </DivStage>
    )
  }
}
