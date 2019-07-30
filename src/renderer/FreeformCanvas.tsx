import * as React from "react";
import { useDrag } from "react-use-gesture";
import { useSpring, animated } from "react-spring";

export const FreeformCanvas = () => {
  const [{ local }, set] = useSpring(() => ({ local: [0, 0] }));
  const bind = useDrag(state => {
      console.log('state: ', state);

    set({ local: state.local });
  });
  return (
    <animated.div
      {...bind()}
      style={{
        width: 100,
        height: 100,
        background: "lightgrey",
        transform: local.interpolate((x, y) => `translate3d(${x}px,${y}px,0)`)
      }}
    />
  );
};
