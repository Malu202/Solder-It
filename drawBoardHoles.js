// Put image data
// function drawBoardHoles() {
//     visibleBoardWidth = hoveredPositionX(canvas.width) - hoveredPositionX(0);
//     visibleBoardHeight = hoveredPositionY(canvas.height) - hoveredPositionY(0);

//     ctx.fillStyle = "#000"
//     ctx.lineWidth = 0.1 * zoom;

//     let holeTemplateCanvas = document.createElement("canvas");
//     let holeTemplateContext = holeTemplateCanvas.getContext("2d");
//     holeTemplateCanvas.width = Math.round(0.24 * zoom);
//     holeTemplateCanvas.height = Math.round(0.24 * zoom);
//     holeTemplateContext.arc(holeTemplateCanvas.width / 2, holeTemplateCanvas.height / 2, holeTemplateCanvas.height / 2 - ctx.lineWidth / 2, 0, Math.PI * 2);
//     holeTemplateContext.stroke();
//     let imgData = holeTemplateContext.getImageData(0, 0, holeTemplateCanvas.width, holeTemplateCanvas.height);

//     let leftMostHolePosition = Math.floor(hoveredPositionX(0));
//     let topHolePosition = Math.floor(hoveredPositionY(0));
//     for (let i = 2; i <= visibleBoardWidth - 1; i++) {
//         let x = i + leftMostHolePosition;
//         let canvasX = getCanvasX(x);
//         for (let j = 2; j <= visibleBoardHeight - 1; j++) {
//             let y = j + topHolePosition;
//             let canvasY = getCanvasY(y);
//             ctx.putImageData(imgData, canvasX, canvasY);
//         }
//     }
// }

//Draw directly
// function drawBoardHoles() {
//     visibleBoardWidth = hoveredPositionX(canvas.width) - hoveredPositionX(0);
//     visibleBoardHeight = hoveredPositionY(canvas.height) - hoveredPositionY(0);

//     ctx.fillStyle = "#000"
//     ctx.lineWidth = 0.1 * zoom;


//     let leftMostHolePosition = Math.floor(hoveredPositionX(0));
//     let topHolePosition = Math.floor(hoveredPositionY(0));
//     for (let i = 0; i <= visibleBoardWidth + 1; i++) {
//         let x = i + leftMostHolePosition;
//         let canvasX = getTranslatedCanvasX(x);
//         for (let j = 0; j <= visibleBoardHeight + 1; j++) {
//             let y = j + topHolePosition;
//             let canvasY = getTranslatedCanvasY(y);
//             ctx.beginPath();
//             ctx.arc(canvasX, canvasY, 0.12 * zoom, 0, Math.PI * 2)
//             ctx.stroke();

//         }
//     }
// }

let boardImg;
//move one big image
function drawBoardHoles() {
    let pixelsForOnePosition = getTranslatedCanvasX(1) - getTranslatedCanvasX(0);
    let xOffset = (hoveredPositionX(0) % 1 + 1) * pixelsForOnePosition + 1;
    let yOffset = (hoveredPositionY(0) % 1 + 1) * pixelsForOnePosition + 1;

    //canvas.width -1 because chrome doesn't draw anything if -1 is omitted
    ctx.putImageData(boardImg, -xOffset, -yOffset, xOffset, yOffset, canvas.width - 1, canvas.height - 1);



}

//Draw all holes with arcs
// function createBoardHoles1() {

//     let holeImageCanvas = document.createElement("canvas");
//     let holeImageContext = holeImageCanvas.getContext("2d");

//     let pixelsForOnePosition = getTranslatedCanvasX(1) - getTranslatedCanvasX(0);

//     holeImageCanvas.width = canvas.width + pixelsForOnePosition * 1;
//     holeImageCanvas.height = canvas.height + pixelsForOnePosition * 1;

//     visibleBoardWidth = hoveredPositionX(canvas.width) - hoveredPositionX(0);
//     visibleBoardHeight = hoveredPositionY(canvas.height) - hoveredPositionY(0);

//     holeImageContext.clearRect(0, 0, holeImageCanvas.width, holeImageCanvas.height);

//     holeImageContext.fillStyle = "#000"
//     holeImageContext.lineWidth = 0.1 * zoom;

//     for (let i = 0; i <= visibleBoardWidth + 1; i++) {
//         let x = i * pixelsForOnePosition;
//         for (let j = 0; j <= visibleBoardHeight + 1; j++) {
//             let y = j * pixelsForOnePosition;

//             holeImageContext.beginPath();
//             holeImageContext.arc(x, y, 0.12 * zoom, 0, Math.PI * 2);
//             holeImageContext.stroke();
//             // holeImageContext.fillText(i, x, y);
//         }
//     }
//     boardImg = holeImageContext.getImageData(0, 0, holeImageCanvas.width, holeImageCanvas.height);
// }

function createBoardHoles() {
    let holeImageCanvas = document.createElement("canvas");
    let holeImageContext = holeImageCanvas.getContext("2d");

    let pixelsForOnePosition = zoom;

    holeImageCanvas.width = canvas.width + pixelsForOnePosition * 2;
    holeImageCanvas.height = canvas.height + pixelsForOnePosition * 2;

    visibleBoardWidth = hoveredPositionX(canvas.width) - hoveredPositionX(0);
    visibleBoardHeight = hoveredPositionY(canvas.height) - hoveredPositionY(0);


    let oneHole = drawOneHole(pixelsForOnePosition);
    holeImageContext.clearRect(0, 0, holeImageCanvas.width, holeImageCanvas.height);

    let pattern = holeImageContext.createPattern(oneHole, "repeat");
    holeImageContext.fillStyle = pattern;
    holeImageContext.fillRect(0, 0, holeImageCanvas.width, holeImageCanvas.height);

    boardImg = holeImageContext.getImageData(pixelsForOnePosition / 2, pixelsForOnePosition / 2, holeImageCanvas.width, holeImageCanvas.height);
}
function drawOneHole(imageSize) {
    let canv = document.createElement("canvas");
    let cont = canv.getContext("2d");
    canv.width = imageSize;
    canv.height = imageSize;

    cont.strokeStyle = "#000";
    cont.fillStyle = "#000";
    cont.lineWidth = 0.1 * zoom;

    cont.beginPath();
    cont.arc(imageSize / 2, imageSize / 2, 0.12 * zoom, 0, Math.PI * 2)
    cont.stroke();
    return canv;
}


function zoomToggle() {
    if (zoom < 8) zoom = 8;
    else zoom = 7;
    createBoardHoles();
    drawOnce();
    requestAnimationFrame(zoomToggle);
}
//setTimeout(zoomToggle, 1000);

const downloadBoardImg = function () {
    let imageData = boardImg;
    let w = imageData.width;
    let h = imageData.height;
    let dlCanvas = document.createElement("canvas");
    dlCanvas.width = w;
    dlCanvas.height = h;
    let dlCtx = dlCanvas.getContext("2d");
    dlCtx.putImageData(imageData, 0, 0);

    downloadCanvas(dlCanvas);
}
let downloadCanvas = function (dlCanvas) {
    var link = document.createElement('a');
    link.download = 'test.png';
    link.href = dlCanvas.toDataURL()
    link.click();
}

createBoardHoles();
