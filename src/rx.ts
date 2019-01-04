import { fromEvent } from "rxjs";
import {
  exhaustMap as mapIgnoreOuterUntilInnerDone,
  takeUntil,
  tap,
  startWith,
  map
} from "rxjs/operators";

const mouseMap = (e: MouseEvent) => ({
  type: e.type,
  x: e.clientX,
  y: e.clientY
});

//create observable that emits click events
const mousedown = fromEvent(document, "mousedown").pipe(map(mouseMap));
const mouseup = fromEvent(document, "mouseup").pipe(map(mouseMap));
const mousemove = fromEvent(document, "mousemove").pipe(map(mouseMap));

const moveUntilDrop = mousedown => {
    
    return mousemove.pipe(
        map(xy => [xy.x, xy.y]),
        // map(move => ({dx: move.x - mousedown.x , dy: move.y - mousedown.y})),
        takeUntil(mouseup)
      );
}
  

export const dnd = mousedown.pipe(mapIgnoreOuterUntilInnerDone(moveUntilDrop));
