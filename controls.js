function hoveredPositionX(canvasX) {
    return canvasX / zoom + viewX - canvas.clientWidth / (2 * zoom);
}
function hoveredPositionY(canvasY) {
    return canvasY / zoom + viewY - canvas.clientHeight / (2 * zoom);
}

addEventListener('wheel', (event) => {
    zoom *= 1 - (event.deltaY * 0.001);
    draw();
});
let startingNavigationX;
let startingNavigationY;
let navigating = false;
let activeComponent = null;
let movingComponent = null;
addEventListener("mousedown", (event) => {
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
});
addEventListener("mouseup", (event) => {
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
})
addEventListener("mousemove", (event) => {
    if (navigating) {
        if (startingNavigationX == null) {
            startingNavigationX = event.clientX;
            startingNavigationY = event.clientY;
        }
        viewX -= (event.clientX - startingNavigationX) / zoom;
        viewY -= (event.clientY - startingNavigationY) / zoom;
        startingNavigationX = event.clientX;
        startingNavigationY = event.clientY;
        draw();

    } else if (movingComponent) {
        movingComponent.move(event.clientX, event.clientY)
        draw();

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
        case 46:
            if (!activeComponent) break;
            activeComponent.destroy();
            activeComponent = null;
            break;
        case 82:
            if (!activeComponent) break;
            activeComponent.rotateClockwise();
            break;
        default:
            break;
    }
})