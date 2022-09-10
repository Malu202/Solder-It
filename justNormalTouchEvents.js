

function dispatchMouseEvent(options) {
    options = options || {};

    let defaultView = document.defaultView;
    if (options.target && options.target.ownerDocument) defaultView = options.target.ownerDocument.defaultView;
    let opts = { // These are the default values, set up for un-modified left clicks
        type: 'click',
        canBubble: true,
        cancelable: true,
        view: defaultView,
        detail: 1,
        screenX: 0, //The coordinates within the entire page
        screenY: 0,
        clientX: 0, //The coordinates within the viewport
        clientY: 0,
        ctrlKey: false,
        altKey: false,
        shiftKey: false,
        metaKey: false, //I *think* 'meta' is 'Cmd/Apple' on Mac, and 'Windows key' on Win. Not sure, though!
        button: 0, //0 = left, 1 = middle, 2 = right
        relatedTarget: null,
        target: document,
    };

    //Merge the options with the defaults
    for (var key in options) {
        if (options.hasOwnProperty(key)) {
            opts[key] = options[key];
        }
    }

    options.bubbles = true;
    let event = new MouseEvent(options.type, options);
    opts.target.dispatchEvent(event);
}


function modifyEvent(event, modifications) {
    let newEvent = {};
    Object.keys(event).forEach(key => {
        newEvent[key] = event[key];
    });
    Object.keys(modifications).forEach(key => {
        newEvent[key] = modifications[key];
    });

    let evt = (typeof event.originalEvent === 'undefined') ? event : event.originalEvent;
    let touch = evt.touches[0] || evt.changedTouches[0];
    newEvent.clientX = touch.pageX;
    newEvent.clientY = touch.pageY;
    return newEvent
}


addEventListener("touchstart", (event) => {
    let modifiedEvent = modifyEvent(event, { type: "mousedown", button: 1 })
    dispatchMouseEvent(modifiedEvent);
});
addEventListener("touchmove", (event) => {
    let modifiedEvent = modifyEvent(event, { type: "mousemove" })
    dispatchMouseEvent(modifiedEvent);
});
addEventListener("touchend", (event) => {
    let modifiedEvent = modifyEvent(event, { type: "mouseup" })
    dispatchMouseEvent(modifiedEvent);
});