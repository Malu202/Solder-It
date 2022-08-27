let queuedFunctions = [];
function doOnlyEveryFrame(spammedFunction) {
    queuedFunctions.forEach(queuedFunction => {
        if (spammedFunction === queuedFunction) {
            console.log("blocked")
            return;
        }
    });

    queuedFunctions.push(spammedFunction)
    window.requestAnimationFrame(() => {
        queuedFunctions.forEach((queuedFunction, index) => {
            if (spammedFunction === queuedFunction) {
                queuedFunctions.splice(index, 1);
                spammedFunction();
                return;
            }
        });
    })
}
doOnlyEveryFrame(testfunction)

function testfunction() {
    for (let i = 0; i < 50000; i++) {
        // console.log("hi")
        if (i % 100 == 0) console.log(queuedFunctions.length)
    }
}