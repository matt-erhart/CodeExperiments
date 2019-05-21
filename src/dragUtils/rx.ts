// if we need touch screens: https://varun.ca/drag-with-rxjs/
import { fromEvent, Observable, merge } from "rxjs";
import {
  startWith,
  map,
  takeWhile,
  exhaustMap as mapUntilInnerDone
} from "rxjs/operators";
/**
 *
 * @param mouseDown : e.g. pass in an event from a react event handler
 * movementX, movementY, type are particularly useful for dragging
 */
export const dragData = (el: HTMLElement) => {
  if (!el) return null
  const mousedown = fromEvent<React.MouseEvent<HTMLElement, MouseEvent>>(
    el,
    "mousedown"
  );
  const mousemove = fromEvent<React.MouseEvent<HTMLElement, MouseEvent>>(
    document,
    "mousemove"
  );
  const mouseup = fromEvent<React.MouseEvent<HTMLElement, MouseEvent>>(
    document,
    "mouseup"
  );

  const moveOrUp = merge(mousemove, mouseup);

  return mousedown.pipe(
    mapUntilInnerDone(down => {
      return moveOrUp.pipe(
        startWith(down),
        takeWhile(moveOrUp => moveOrUp.type !== "mouseup", true)
      );
    })
  );
};
