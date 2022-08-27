
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
    drawBoardHoles();
    components.forEach(component => {
        component.draw();
    });
}

class Component {
    constructor(width, height, storedList) {
        this.width = width;
        this.height = height;
        this.positionX = 0;
        this.positionY = 0;

        this.grabbingPositionX = null;
        this.grabbingPositionY = null;
        this.storedList = storedList;
        if (storedList) storedList.push(this);
    }
    draw() {
        ctx.fillStyle = "#222"
        ctx.beginPath();
        ctx.rect(getTranslatedCanvasX(this.positionX), getTranslatedCanvasY(this.positionY), this.width * zoom, this.height * zoom);
        ctx.fill();
    }
    isHovered(x, y) {
        let canvasX = getCanvasX(this.positionX);
        let canvasY = getCanvasY(this.positionY);
        let canvasWidth = this.width * zoom;
        let canvasHeight = this.height * zoom;

        if (x > canvasX && x < canvasX + canvasWidth && y > canvasY && y < canvasY + canvasHeight) return true;
        else return false;
    }
    move(mouseX, mouseY) {
        if (this.grabbingPositionX == null || this.grabbingPositionY == null) {
            this.grabbingPositionX = hoveredPositionX(mouseX) - this.positionX;
            this.grabbingPositionY = hoveredPositionY(mouseY) - this.positionY;
        } else {
            this.positionX = Math.round(hoveredPositionX(mouseX) - this.grabbingPositionX);
            this.positionY = Math.round(hoveredPositionY(mouseY) - this.grabbingPositionY);
        }
    }
    putDown() {
        this.grabbingPositionX = null;
        this.grabbingPositionY = null;
    }
    rotateClockwise() {
        let width = this.width;
        this.width = this.height;
        this.height = width;
        this.positionX -= (this.width - this.height) / 2;
        this.positionY += (this.width - this.height) / 2
        draw();
    }

    destroy() {
        if (!this.storedList) return false;
        this.storedList.forEach((component, index) => {
            if (component == this) {
                this.storedList.splice(index, 1);
                draw();
                return true;
            }
        });
        return false;
    }
}

class Chip extends Component {
    draw() {
        ctx.fillStyle = "#222"
        ctx.beginPath();
        ctx.rect(getTranslatedCanvasX(this.positionX - 0.5), getTranslatedCanvasY(this.positionY + 0.1), this.width * zoom, (this.height - 0.2) * zoom);
        ctx.fill();

        ctx.fillStyle = "#888";
        let pinWidth = 0.4;
        for (let i = 0; i < this.width; i++) {
            ctx.beginPath();
            ctx.rect(getTranslatedCanvasX(this.positionX + i - pinWidth / 2), getTranslatedCanvasY(this.positionY - pinWidth / 2), pinWidth * zoom, pinWidth * zoom);
            ctx.rect(getTranslatedCanvasX(this.positionX + i - pinWidth / 2), getTranslatedCanvasY(this.positionY + this.height - pinWidth / 2), pinWidth * zoom, pinWidth * zoom);

            ctx.fill();
        }
    }
}

function getTranslatedCanvasX(positionX) { return positionX * zoom - viewX * zoom }
function getTranslatedCanvasY(positionY) { return positionY * zoom - viewY * zoom }
function getCanvasX(positionX) { return getTranslatedCanvasX(positionX) + canvas.clientWidth / 2 }
function getCanvasY(positionY) { return getTranslatedCanvasY(positionY) + canvas.clientHeight / 2 }


function drawBoardHoles() {
    visibleBoardWidth = hoveredPositionX(canvas.width) - hoveredPositionX(0);
    visibleBoardHeight = hoveredPositionY(canvas.height) - hoveredPositionY(0);

    ctx.fillStyle = "#000"
    ctx.lineWidth = Math.round(0.1 * zoom);

    let leftMostHolePosition = Math.floor(hoveredPositionX(0));
    let topHolePosition = Math.floor(hoveredPositionY(0));
    for (let i = 0; i <= visibleBoardWidth + 1; i++) {
        let x = i + leftMostHolePosition;
        let canvasX = getTranslatedCanvasX(x);
        for (let j = 0; j <= visibleBoardHeight + 1; j++) {
            let y = j + topHolePosition;
            ctx.beginPath();
            ctx.arc(canvasX, getTranslatedCanvasY(y), 0.12 * zoom, 0, Math.PI * 2)
            ctx.fill();
        }
    }
}