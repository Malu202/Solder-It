
let viewX = 0;
let viewY = 0;
let zoom = 25;

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
ctx.save();
ctx.translate(canvas.clientWidth / 2, canvas.clientHeight / 2);

let components = [];

function draw(elapsedTime) {
    if (elapsedTime == null) elapsedTime = 0;
    ctx.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
    components.forEach(component => {
        component.draw();
    });
}

class Component {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.positionX = 0;
        this.positionY = 0;

        this.grabbingPositionX = null;
        this.grabbingPositionY = null;
        components.push(this);
    }
    draw() {
        ctx.fillStyle = "#000"
        ctx.beginPath();
        ctx.rect(this.getTranslatedCanvasX(), this.getTranslatedCanvasY(), this.width * zoom, this.height * zoom);
        ctx.fill();
    }
    isHovered(x, y) {
        let canvasX = this.getCanvasX();
        let canvasY = this.getCanvasY();
        let canvasWidth = this.width * zoom;
        let canvasHeight = this.height * zoom;

        if (x > canvasX && x < canvasX + canvasWidth && y > canvasY && y < canvasY + canvasHeight) return true;
        else return false;
    }
    getTranslatedCanvasX() { return this.positionX * zoom - viewX * zoom }
    getTranslatedCanvasY() { return this.positionY * zoom - viewY * zoom }
    getCanvasX() { return this.getTranslatedCanvasX() + canvas.clientWidth / 2 }
    getCanvasY() { return this.getTranslatedCanvasY() + canvas.clientHeight / 2 }


    move(mouseX, mouseY) {
        if (this.grabbingPositionX == null || this.grabbingPositionY == null) {
            this.grabbingPositionX = hoveredPositionX(mouseX) - this.positionX;
            this.grabbingPositionY = hoveredPositionY(mouseY) - this.positionY;
        } else {
            this.positionX = hoveredPositionX(mouseX) - this.grabbingPositionX;
            this.positionY = hoveredPositionY(mouseY) - this.grabbingPositionY;
        }
    }
    putDown() {
        this.grabbingPositionX = null;
        this.grabbingPositionY = null;
    }

    destroy() {
        components.forEach((component, index) => {
            if (component == this) {
                components.splice(index, 1);
                draw();
                return true;
            }
        });
        return false;
    }
}

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
        console.log("hi")
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


let test = new Component(15, 8);
let test2 = new Component(8, 15)
test2.positionX = 4;
test2.positionY = 10;
draw();

function showStats() {
    let text1 = `navigating: ${navigating}`
    let text2 = `movingComponent: ${movingComponent}`;
    ctx.font = '24px serif';
    ctx.clearRect(-canvas.width / 2, -canvas.height / 2, 400, 70);
    ctx.fillText(text1, 10 - canvas.clientWidth / 2, 30 - canvas.clientHeight / 2);
    ctx.fillText(text2, 10 - canvas.clientWidth / 2, 60 - canvas.clientHeight / 2);

    requestAnimationFrame(showStats)
}
showStats();

