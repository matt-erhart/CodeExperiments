export const getElementScale = (element: HTMLElement) => {
    // from leaflet utils
    // use this or you'll need to track n-levels of zoom to correct drag movement
    const elementRect = element.getBoundingClientRect() 
    const scaleX = elementRect.width / element.offsetWidth || 1
    const scaleY = elementRect.height / element.offsetHeight || 1
  
    return { scaleX, scaleY, elementRect }
  }