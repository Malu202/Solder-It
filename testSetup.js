let test = new Chip(8, 3, components);
let test2 = new Component(8, 15, components)
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
setTimeout(() => showStats(), 0);