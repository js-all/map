"use strict";
canvas.width = 1000;
canvas.height = 1000;
function draw() {
    const T = 10 * step;
    ctx.clearRect((canvas.width / 2 - offset[0]) - canvas.width / 2, (canvas.height / 2 - offset[1]) - canvas.height / 2, canvas.width, canvas.height);
    let b = 0;
    ctx.fillStyle = 'rgba(125, 80, 25, 0.5)';
    ctx.fillRect(stepalize(mouseX - offset[0]), stepalize(mouseY - offset[1]), step, step);
    for (let y = stepalize(T / 2 - offset[1] - T / 2); y < stepalize(T / 2 - offset[1] - T / 2 + canvas.height + step); y += step) {
        for (let x = stepalize(T / 2 - offset[0] - T / 2); x < stepalize(T / 2 - offset[0] - T / 2 + canvas.width + step); x += step) {
            ctx.strokeStyle = "black";
            b = b === 0 ? 1 : 0;
            ctx.strokeRect(x, y, step, step);
        }
    }
    for (let i of DATA.json.map) {
        const image = new Image();
        image.src = DATA.res[getTileById(i.id).resID];
        ctx.drawImage(image, i.pos[0] * step - offset[0], i.pos[1] * step - offset[1], step, step);
    }
}
function stepalize(num) {
    return Math.floor(num / step) * step;
}
function adaptSize() {
    log(parseFloat(getComputedStyle(document.getElementById('left-container')).width));
    canvas.height = window.innerHeight - parseFloat(getComputedStyle(document.body).getPropertyValue('--nav-bar-height'));
    canvas.width = parseFloat(getComputedStyle(document.getElementById('left-container')).width);
}
adaptSize();
canvas.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY - 30;
    if (!mouseDown || canvas.style.cursor !== 'grabbing')
        return;
    if (isNaN(lastPos[0])) {
        lastPos = [e.clientX, e.clientY];
        return;
    }
    else {
        const actPos = [e.clientX, e.clientY];
        let diffX = 0;
        let diffY = 0;
        [diffX, diffY] = [lastPos[0] - actPos[0], lastPos[1] - actPos[1]];
        ctx.translate(-(diffX / 50), -(diffY / 50));
        offset[0] += -(diffX / 50);
        offset[1] += -(diffY / 50);
    }
});
document.addEventListener('mouseup', () => lastPos = [NaN, NaN]);
window.addEventListener('mouseout', () => { lastPos = [NaN, NaN]; mouseDown = false; });
canvas.addEventListener('click', e => {
    mouseX = e.clientX;
    mouseY = e.clientY - 30;
    if (DATA.json.tiles.length === 0)
        return;
    let pos = [stepalize(mouseX - offset[0]), stepalize(mouseY - offset[1])];
    DATA.json.map.push({ id: TileID, pos: pos });
});
canvas.addEventListener('contextmenu', e => {
    mouseX = e.clientX;
    mouseY = e.clientY - 30;
    let pos = [stepalize(mouseX - offset[0]), stepalize(mouseY - offset[1])];
    for (let i of DATA.json.map) {
        if (i.pos[0] === pos[0] && i.pos[1] === pos[1])
            DATA.json.map.splice(DATA.json.map.indexOf(i), 1);
    }
});
window.addEventListener('resize', adaptSize);
setInterval(draw, 1000 / 30);
