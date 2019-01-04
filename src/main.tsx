import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Spring, animated, interpolate } from "react-spring";
import {dnd} from './rx'

const ASpan = props => {
  return (
    <span css={{ color: "green", "&:hover": { color: "blue" } }} {...props}>
      {props.children}
    </span>
  );
};
const TRIANGLE = "M20,380 L380,380 L380,380 L200,20 L20,380 Z";
const RECTANGLE = "M20,20 L20,380 L380,380 L380,20 L20,20 Z";
const styles = {
  container: {
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    willChange: "background"
  },
  shape: { width: 300, height: 300, willChange: "transform" }
};

const color = "white";
class SpringExample extends React.Component<any, any> {
  static defaultProps = {
    coords: [0,0]
  }
  state = { toggle: true };
  toggle = () => this.setState(state => ({ toggle: !state.toggle }));
  
  
  render() {
    const toggle = this.state.toggle;
    return (
      <Spring
        from={{ color: color }}
        to={{
          coords: this.props.coords,
          color: toggle ? color : "black",
          start: toggle ? "#B2DBBF" : "#B2DBBF",
          end: toggle ? "#247BA0" : "#F3FFBD",
          scale: toggle ? 0.3 : 0.4,
          shape: toggle ? TRIANGLE : RECTANGLE,
          stop: toggle ? "0%" : "50%",
          rotation: toggle ? "0deg" : "45deg"
        }}
      >
        {({
          color,
          scale,
          shape,
          start,
          end,
          stop,
          rotation,
          coords,
          ...rest
        }) => (
          <div
            style={{
              ...styles.container,
              background: `linear-gradient(to bottom,
                 ${start} ${stop}, ${end} 100%)`,
              ...rest
            }}
          >
            <svg
              style={{
                ...styles.shape,
                transform: `scale3d(${scale}, ${scale}, 
                  ${scale}) rotate(${rotation}) translate3d(${
                  coords[0]
                }px,${coords[1]}px,0)`
              }}
              version="1.1"
              viewBox="0 0 400 400"
            >
              <g
                data-testid="b"
                style={{ cursor: "pointer" }}
                fill={color}
                fillRule="evenodd"
                onClick={this.toggle}
              >
                <path id="path-1" d={shape} />
              </g>
            </svg>
          </div>
        )}
      </Spring>
    );
  }
}

class App extends React.Component<any, any> {
  state = {
    coords: [0,0]
  }
  unsub
  componentDidMount(){
    this.unsub = dnd.subscribe(coords => this.setState({coords}))
  }

  componentWillUnmount(){
    this.unsub()
  }

  render() {
    return (
      <Router>
        <Switch>
          <Route path="/" exact>
            <ASpan data-testid="a">asdf</ASpan>
          </Route>
          <Route path="/b">
            <SpringExample coords={this.state.coords}/>
          </Route>
        </Switch>
      </Router>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
