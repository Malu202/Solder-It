
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

function drawOnce() {
    ctx.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
    drawBoardHoles();

    components.forEach(component => {
        component.draw();
    });
    drawStats();
}
let drawLoop = false;
function startDrawing() {
    drawLoop = true;
    keepDrawing();
}
function keepDrawing() {
    drawOnce();
    if (drawLoop) requestAnimationFrame(keepDrawing);
}
function stopDrawing() {
    drawLoop = false;
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
        this.positionY += (this.width - this.height) / 2;
        if (this.height > this.width) {
            this.positionX = Math.floor(this.positionX);
            this.positionY = Math.floor(this.positionY);
        } else {
            this.positionX = Math.ceil(this.positionX);
            this.positionY = Math.ceil(this.positionY);
        }
        drawOnce();
    }

    destroy() {
        if (!this.storedList) return false;
        this.storedList.forEach((component, index) => {
            if (component == this) {
                this.storedList.splice(index, 1);
                drawOnce();
                return true;
            }
        });
        return false;
    }
}

class Chip extends Component {
    constructor(width, height, storedList, pinNames) {
        super(width, height, storedList);
        this.pinNames = pinNames;
        if (!this.pinNames) this.pinNames = [];
    }
    draw() {
        ctx.fillStyle = "#222";
        if (this.width > this.height) ctx.rect(getTranslatedCanvasX(this.positionX - 0.5), getTranslatedCanvasY(this.positionY + 0.1), this.width * zoom, (this.height - 0.2) * zoom);
        else ctx.rect(getTranslatedCanvasX(this.positionX + 0.1), getTranslatedCanvasY(this.positionY - 0.5), (this.width - 0.2) * zoom, this.height * zoom); //passe
        ctx.fill();

        ctx.font = zoom * 0.4 + 'px serif';
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        let pinWidth = 0.4;
        if (this.width > this.height) {
            for (let i = 0; i < this.width; i++) {
                ctx.fillStyle = "#888";

                ctx.beginPath();
                ctx.rect(getTranslatedCanvasX(this.positionX + i - pinWidth / 2), getTranslatedCanvasY(this.positionY - pinWidth / 2), pinWidth * zoom, pinWidth * zoom);
                ctx.rect(getTranslatedCanvasX(this.positionX + i - pinWidth / 2), getTranslatedCanvasY(this.positionY + this.height - pinWidth / 2), pinWidth * zoom, pinWidth * zoom);
                ctx.fill();

                ctx.beginPath();
                ctx.fillStyle = "#FFF"
                if (this.pinNames[2 * this.width - i - 1]) ctx.fillText(this.pinNames[2 * this.width - i - 1], getTranslatedCanvasX(this.positionX + i), getTranslatedCanvasY(this.positionY + 0.7));
                if (this.pinNames[i]) ctx.fillText(this.pinNames[i], getTranslatedCanvasX(this.positionX + i), getTranslatedCanvasY(this.positionY + this.height - 0.7));
            }
        } else {
            for (let j = 0; j < this.height; j++) {
                ctx.fillStyle = "#888";

                ctx.beginPath();
                ctx.rect(getTranslatedCanvasX(this.positionX - pinWidth / 2), getTranslatedCanvasY(this.positionY + j - pinWidth / 2), pinWidth * zoom, pinWidth * zoom);
                ctx.rect(getTranslatedCanvasX(this.positionX + this.width - pinWidth / 2), getTranslatedCanvasY(this.positionY + j - pinWidth / 2), pinWidth * zoom, pinWidth * zoom);
                ctx.fill();

                ctx.beginPath();
                ctx.fillStyle = "#FFF"
                if (this.pinNames[j]) ctx.fillText(this.pinNames[j], getTranslatedCanvasX(this.positionX + 0.7), getTranslatedCanvasY(this.positionY + j));
                if (this.pinNames[2 * this.height - j - 1]) ctx.fillText(this.pinNames[2 * this.height - j - 1], getTranslatedCanvasX(this.positionX + this.width - 0.7), getTranslatedCanvasY(this.positionY + j));

            }
        }
    }
}
function getTranslatedCanvasX(positionX) { return positionX * zoom - viewX * zoom }
function getTranslatedCanvasY(positionY) { return positionY * zoom - viewY * zoom }
function getCanvasX(positionX) { return getTranslatedCanvasX(positionX) + canvas.clientWidth / 2 }
function getCanvasY(positionY) { return getTranslatedCanvasY(positionY) + canvas.clientHeight / 2 }


