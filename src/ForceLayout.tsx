// lib
import * as React from 'react'
import * as d3 from 'd3'
import * as cola from 'webcola'
const myWorker = new Worker('./LayoutWorker.js') // relative path to the source file, not the public URL
import { Spring, animated, config } from 'react-spring/renderprops'
// custom
import { DivStage } from './DivStage'
import throttle from 'lodash/throttle'

const makeGraph = () => {
  const nodeNumbers = d3.range(0, 300, 1)
  const nodes = nodeNumbers.map(num => {
    return { x: 500, y: 500, width: 30, height: 30 }
  })
  const linkNumbers = d3.range(0, 50)
  const links = linkNumbers.map(num => {
    return {
      source: Math.round(Math.random() * Math.max(...nodeNumbers)),
      target: Math.round(Math.random() * Math.max(...nodeNumbers)),
      value: Math.random() * 100,
    }
  })
  return { nodes, links }
}

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
  }

  componentWillUnmount() {
    myWorker.terminate()
  }
  log = () => console.log(!!this.state.nodes)

  render() {
    return (
      <DivStage ref={this.stage}>
        {/* <div>{this.state.alpha}</div> */}
        {this.state.nodes && (
          <Spring
            native
            to={{ nodes: this.state.nodes }}
            config={{duration: 50}}
          >
            {({ nodes }) =>
              this.state.nodes.map((node, ix) => {
                const left = node.x - node.width / 2
                const top = node.y - node.height / 2
                return (
                  <animated.div
                    key={ix}
                    style={{
                      position: 'absolute',
                      transform: `translate3d(${left}px, ${top}px, 0px)`,
                      width: node.width,
                      height: node.height,
                      border: '2px solid black',
                    }}
                  />
                )
              })
            }
          </Spring>
        )}
      </DivStage>
    )
  }
}
