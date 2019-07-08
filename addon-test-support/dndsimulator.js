import hasEmberVersion from "ember-test-helpers/has-ember-version";

function createEvent (eventName, options, location) {
  let event = {};
  // event.initCustomEvent(eventName, true, true, null);

  // event.view = window;
  // event.detail = 0;
  // event.ctlrKey = false;
  // event.altKey = false;
  // event.shiftKey = false;
  // event.metaKey = false;
  // event.button = 0;
  // event.relatedTarget = null;
  event.cancelable = true;
  event.bubbles = true;

  /* if the clientX and clientY options are specified,
  also calculated the desired screenX and screenY values */
  if(options.x && options.y) {
      event.screenX = window.screenX + options.x;
      event.screenY = window.screenY + options.y;
      event.clientX = options.x;
      event.clientY = options.y;
      delete options.x;
      delete options.y;
  }

  /* copy the rest of the options into
  the event object */
  // for (const prop in options) {
  //     event[prop] = options[prop];
  // }
  event = Object.assign(event, options)

  switch (true) {
    case eventName.includes('pointer'):
      return new PointerEvent(eventName, event);
    case eventName.includes('mouse'):
      return new MouseEvent(eventName, event)
    case eventName.includes('drag'):
    case eventName.includes('drop'):
      return new DragEvent(eventName, event);
    default:
      return new CustomEvent(eventName, event);
  }
}

/**
 *
 * @param {HTMLElement} sourceElement - Element to be dragged
 * @param {HTMLElement} targetElement - Element where source element is being dropped
 */
export function simulateDrag (sourceElement, targetElement) {

  /* get the coordinates of both elements, note that
  left refers to X, and top to Y */
  const sourceCoordinates = sourceElement.getBoundingClientRect();
  const targetCoordinates = targetElement.getBoundingClientRect();

  /* simulate a mouse down event on the coordinates
  of the source element */
  const mouseDownEvent = createEvent(
      "pointerdown",
      {
          x: sourceCoordinates.left,
          y: sourceCoordinates.top
      }
  );

  sourceElement.dispatchEvent(mouseDownEvent);

  /* simulate a drag start event on the source element */
  const dragStartEvent = createEvent(
      "dragstart",
      {
          x: sourceCoordinates.left,
          y: sourceCoordinates.top,
          dataTransfer: new DataTransfer()
      }
  );

  sourceElement.dispatchEvent(dragStartEvent);

  /* simulate a drag event on the source element */
  const dragEvent = createEvent(
      "drag",
      {
          x: sourceCoordinates.left,
          y: sourceCoordinates.top
      }
  );

  sourceElement.dispatchEvent(dragEvent);

  /* simulate a drag enter event on the target element */
  const dragEnterEvent = createEvent(
      "dragenter",
      {
          x: targetCoordinates.left,
          y: targetCoordinates.top,
          dataTransfer: dragStartEvent.dataTransfer
      }
  );

  targetElement.dispatchEvent(dragEnterEvent);

  /* simulate a drag over event on the target element */
  const dragOverEvent = createEvent(
      "dragover",
      {
          x: targetCoordinates.left,
          y: targetCoordinates.top,
          dataTransfer: dragStartEvent.dataTransfer
      }
  );

  targetElement.dispatchEvent(dragOverEvent);

  /* simulate a drop event on the target element */
  const dropEvent = createEvent(
      "drop",
      {
          x: targetCoordinates.left,
          y: targetCoordinates.top,
          dataTransfer: dragStartEvent.dataTransfer
      }
  );

  targetElement.dispatchEvent(dropEvent);

  /* simulate a drag end event on the source element */
  const dragEndEvent = createEvent(
      "dragend",
      {
          x: targetCoordinates.left,
          y: targetCoordinates.top,
          dataTransfer: dragStartEvent.dataTransfer
      }
  );

  sourceElement.dispatchEvent(dragEndEvent);

  /* simulate a mouseup event on the target element */
  const mouseUpEvent = createEvent(
      "mouseup",
      {
          x: targetCoordinates.left,
          y: targetCoordinates.top
      }
  );

  targetElement.dispatchEvent(mouseUpEvent);
};
