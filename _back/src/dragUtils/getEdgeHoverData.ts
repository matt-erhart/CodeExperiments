import { get } from './utils'
import { getPointInElement } from './geometryFromHtml'

type loc =
  | 'left'
  | 'top'
  | 'right'
  | 'bottom'
  | 'topLeft'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomRight'
  | 'default'

type cursor =
  | 'nwse-resize'
  | 'nesw-resize'
  | 'ew-resize'
  | 'ns-resize'
  | 'move'
  | 'default'

export type hoverInfo = { location: loc; cursor: cursor }

export const getEdgeHoverData = (
  e: React.MouseEvent<HTMLElement, MouseEvent>
): hoverInfo => {
  if (!e) return { location: 'default', cursor: 'default' }

  // edge or corner locations with matching cursors
  let element = e.nativeEvent.target as HTMLDivElement
  var style = window.getComputedStyle(element, null)
  var padTop = parseInt(style.getPropertyValue('padding-top'))
  
  var padRight = parseFloat(style.getPropertyValue('padding-right'))
  var padLeft = parseFloat(style.getPropertyValue('padding-left'))
  var padBottom = parseFloat(style.getPropertyValue('padding-bottom'))
  var width = element.offsetWidth
  var height = element.offsetHeight
  var mouseX = e.nativeEvent.offsetX
  var mouseY = e.nativeEvent.offsetY
  const isLeft = mouseX < padLeft
  const isRight = mouseX > width - padRight
  const isTop = mouseY < padTop
  const isBottom = mouseY > height - padBottom
  const isTopLeft = isLeft && isTop
  const isTopRight = isRight && isTop
  const isBottomLeft = isLeft && isBottom
  const isBottomRight = isRight && isBottom

  // check corners first
  if (isTopLeft) return { location: 'topLeft', cursor: 'nwse-resize' }
  if (isBottomRight) return { location: 'bottomRight', cursor: 'nwse-resize' }
  if (isBottomLeft) return { location: 'bottomLeft', cursor: 'nesw-resize' }
  if (isTopRight) return { location: 'topRight', cursor: 'nesw-resize' }

  // else edge
  if (isLeft) return { location: 'left', cursor: 'ew-resize' }
  if (isRight) return { location: 'right', cursor: 'ew-resize' }
  if (isTop) return { location: 'top', cursor: 'ns-resize' }
  if (isBottom) return { location: 'bottom', cursor: 'ns-resize' }
  
  return { location: 'default', cursor: 'default' }
}
