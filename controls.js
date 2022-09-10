function hoveredPositionX(canvasX) {
    return canvasX / zoom + viewX - canvas.clientWidth / (2 * zoom);
}
function hoveredPositionY(canvasY) {
    return canvasY / zoom + viewY - canvas.clientHeight / (2 * zoom);
}

let lastAnimationRequest;
let zoomingDone;
addEventListener('wheel', (event) => {
    clearTimeout(zoomingDone);
    zoomingDone = setTimeout(() => { if (!navigating) stopDrawing(); }, 1000);
    if (!drawLoop) startDrawing();

    let change = zoom * (event.deltaY * 0.001);

    //if change is smaller than 0.5 it gets lost when rounding and nothing gets zoomed
    if (Math.abs(change) <= 0.5) change = 1 * Math.sign(change);

    zoom = Math.round(zoom - change);

    if (zoom < 1) zoom = 1;
    zoomChanged = true;
});
let startingNavigationX;
let startingNavigationY;
let navigating = false;
let activeComponent = null;
let movingComponent = null;
addEventListener("mousedown", (event) => {
    console.log("mousedown");
    console.log(event.button)
    if (event.button == 1 || event.button == 2) {
        navigating = true;
        document.body.style.cursor = 'all-scroll';
    } else if (event.button == 0) {
        components.forEach(component => {
            if (component.isHovered(event.clientX, event.clientY)) {
                movingComponent = component;
                activeComponent = movingComponent;
                return;
            }
        });
    }
    console.log("calling start drawing");
    startDrawing();
});
addEventListener("mouseup", (event) => {
    console.log("mouseup");

    if (navigating) {
        navigating = false;
        startingNavigationX = null;
        startingNavigationY = null;
        document.body.style.cursor = 'default';
    } else if (movingComponent) {
        movingComponent.putDown();
        movingComponent = null;
        document.body.style.cursor = 'pointer';
    }
    stopDrawing();
})
addEventListener("mousemove", (event) => {
    console.log("mousemove");

    if (navigating) {
        if (startingNavigationX == null) {
            startingNavigationX = event.clientX;
            startingNavigationY = event.clientY;
        }
        viewX -= (event.clientX - startingNavigationX) / zoom;
        viewY -= (event.clientY - startingNavigationY) / zoom;
        startingNavigationX = event.clientX;
        startingNavigationY = event.clientY;
        // drawOnce();

    } else if (movingComponent) {
        movingComponent.move(event.clientX, event.clientY)
        // drawOnce();

    } else {
        document.body.style.cursor = 'default';
        components.forEach(component => {
            if (component.isHovered(event.clientX, event.clientY)) {
                document.body.style.cursor = 'pointer';
            }
        });
    }

})
addEventListener("contextmenu", (event) => {
    if (event.stopPropagation) event.stopPropagation();
    event.preventDefault()
    event.cancelBubble = true;
    return false;
})
addEventListener("keydown", event => {
    switch (event.keyCode) {
        case 46: //"entf"
            if (!activeComponent) break;
            activeComponent.destroy();
            activeComponent = null;
            break;
        case 82: //"R"
            if (!activeComponent) break;
            activeComponent.rotateClockwise();
            break;
        default:
            break;
    }
})