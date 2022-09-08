let test = new Chip(3, 8, components, [1, 2, 3, 4, 5, 6, 7, "GND", "VCC", 9, 10, 11, null, 13, 14, 15]);
let test2 = new Chip(3, 2, components, null)
test2.positionX = 4;
test2.positionY = 10;

let test3 = new Chip(5, 2, components, null)
test3.positionX = -8;
test3.positionY = -8;

let test4 = new Chip(4, 8, components, null)
test4.positionX = -10;
test4.positionY = -1;
drawOnce();

function drawStats() {
    let text1 = `zoom: ${zoom}`
    let text2 = `movingComponent: ${movingComponent}`;
    let text3 = `drawLoop: ${drawLoop}`;

    ctx.font = '24px serif';
    ctx.fillStyle = "#000";
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.clearRect(-canvas.width / 2, -canvas.height / 2, 400, 100);
    ctx.fillText(text1, 10 - canvas.clientWidth / 2, 30 - canvas.clientHeight / 2);
    ctx.fillText(text2, 10 - canvas.clientWidth / 2, 60 - canvas.clientHeight / 2);
    ctx.fillText(text3, 10 - canvas.clientWidth / 2, 90 - canvas.clientHeight / 2);


    // requestAnimationFrame(showStats)
}
// setTimeout(() => showStats(), 0);