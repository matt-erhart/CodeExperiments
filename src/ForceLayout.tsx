// lib
import * as React from 'react'
import * as d3 from 'd3'
import * as cola from 'webcola'
const myWorker = new Worker('./LayoutWorker.js') // relative path to the source file, not the public URL

// custom
import { DivStage } from './DivStage'

const makeGraph = () => {
  const nodeNumbers = d3.range(0, 100, 1)
  const nodes = nodeNumbers.map(num => {
    return { x: 300, y: 300, width: 10, height: 10 }
  })
  const linkNumbers = d3.range(0, 100)
  const links = linkNumbers.map(num => {
    return {
      source: Math.round(Math.random() * Math.max(...nodeNumbers)),
      target: Math.round(Math.random() * Math.max(...nodeNumbers)),
      value: 2,
    }
  })
  return { nodes, links }
}

// const graph = {
//   nodes: [
//     { x: 350, y: 350, width: 101, height: 101 },
//     { x: 350, y: 350, width: 10, height: 10 },
//     { x: 350, y: 100, width: 10, height: 101 },
//     { x: 350, y: 350, width: 101, height: 110 },
//     { x: 350, y: 350, width: 10, height: 10 },
//     { x: 350, y: 350, width: 10, height: 110 },
//     { x: 350, y: 350, width: 110, height: 110 },
//     { x: 350, y: 350, width: 110, height: 110 },
//   ],
//   links: [
//     { source: 1, target: 2, value: 1 },
//     { source: 2, target: 4, value: 8 },
//     { source: 7, target: 5, value: 10 },
//     { source: 5, target: 2, value: 6 },
//   ],
// }

let graph = makeGraph()

/**
 * @class **ForceLayout**
 */
const ForceLayoutDefaults = {
  props: {},
  state: { nodes: undefined as cola.Node[], alpha: 0 },
}
export class ForceLayout extends React.Component<
  typeof ForceLayoutDefaults.props,
  typeof ForceLayoutDefaults.state
> {
  static defaultProps = ForceLayoutDefaults.props
  state = ForceLayoutDefaults.state
  private stage = React.createRef<HTMLDivElement>()

  async componentDidMount() {
    const { width, height } = this.stage.current.getBoundingClientRect()
    myWorker.postMessage({ width, height, graph })
    myWorker.onmessage = ({ data }) => {
      this.setState({ nodes: data })
    }
    console.log('width, height: ', width, height)
  }
  
  componentWillUnmount() {
    // myWorker.terminate()
  }

  render() {
    return (
      <DivStage ref={this.stage}>
        {/* <div>{this.state.alpha}</div> */}
        {this.state.nodes &&
          this.state.nodes.map((node, ix) => {
            const left = node.x - node.width / 2
            const top = node.y - node.height / 2
            return (
              <div
                key={ix}
                style={{
                  position: 'absolute',
                  transform: `translate(${left}px, ${top}px)`,
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

async function test () {
    
}