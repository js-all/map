canvas.width = 1000;
canvas.height = 1000;


function draw() {
    const T = 10 * step;
    ctx.clearRect((canvas.width / 2 - offset[0]) - canvas.width / 2, (canvas.height / 2 - offset[1]) - canvas.height / 2, canvas.width, canvas.height);
    let b = 0;
    ctx.fillStyle = 'rgba(256, 0, 0, 0.5)';
    ctx.fillRect(stepalize(mouseX - offset[0]), stepalize(mouseY - offset[1]), step, step)
    for (let y = stepalize(T / 2 - offset[1] - T / 2); y < stepalize(T / 2 - offset[1] - T / 2 + canvas.height + step); y += step) {
        for (let x = stepalize(T / 2 - offset[0] - T / 2); x < stepalize(T / 2 - offset[0] - T / 2 + canvas.width + step); x += step) {
            ctx.strokeStyle = "black"
            b = b === 0 ? 1 : 0;
            ctx.strokeRect(x, y, step, step);
            //uncomment to enable rainbow mode
            //const c = `rgb(${Math.floor(Math.random() * 257)}, ${Math.floor(Math.random() * 257)}, ${Math.floor(Math.random() * 257)})`;
            //ctx.fillStyle = c;
            //ctx.fillRect(x, y, step, step);
        }
    }
    //const c2 = `rgb(${Math.floor(Math.random() * 257)}, ${Math.floor(Math.random() * 257)}, ${Math.floor(Math.random() * 257)})`;
    //const c3 = `rgb(${Math.floor(Math.random() * 257)}, ${Math.floor(Math.random() * 257)}, ${Math.floor(Math.random() * 257)})`;
    //document.body.style = '--nav-bar-color:'+c2+';--secound-color:'+c3;
    for (let i of DATA.json.map) {
        const image = new Image();
        image.src = DATA.res[(<__DATA_json_tile>getTileById(i.id)).resID];
        ctx.drawImage(image, (i.pos[0] * step), (i.pos[1] * step), step, step);
    }
    ctx.fillStyle = 'red';
    ctx.font = (step/3)+"px 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    ctx.fillText('0,0', step/20, step/3);
}

function stepalize(num: number): number {
    return Math.floor(num / step) * step
}

function adaptSize() {
    canvas.height = window.innerHeight - parseFloat(<string>getComputedStyle(document.body).getPropertyValue('--nav-bar-height'));
    canvas.width = parseFloat(<string>getComputedStyle(<HTMLElement>document.getElementById('left-container')).width);
}
adaptSize()

canvas.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY - 30;
    if (!mouseDown || canvas.style.cursor !== 'grabbing') return;
    if (isNaN(lastPos[0])) {
        lastPos = [e.clientX, e.clientY];
        return;
    } else {
        const actPos = [e.clientX, e.clientY];
        let diffX: number = 0;
        let diffY: number = 0;
        [diffX, diffY] = [lastPos[0] - actPos[0], lastPos[1] - actPos[1]];
        ctx.translate(-(diffX / 50), -(diffY / 50));
        offset[0] += -(diffX / 50);
        offset[1] += -(diffY / 50);
    }
});
canvas.addEventListener('mousemove', e => {
    if (!mouseDown) return;
    if (isInKeys(32)) return;
    mouseX = e.clientX;
    mouseY = e.clientY - 30;
    if (DATA.json.tiles.length === 0) return;
    let pos: [number, number] = [stepalize(mouseX - offset[0]) / step, stepalize(mouseY - offset[1]) / step];
    for (let i of DATA.json.map) {
        if (i.pos[0] === pos[0] && i.pos[1] === pos[1]) return;
    }
    DATA.json.map.push({ id: TileID, pos: pos });
})

document.addEventListener('mouseup', () => lastPos = [NaN, NaN]);
window.addEventListener('mouseout', () => {
    lastPos = [NaN, NaN];
    mouseDown = false;
    rightMouseDown = false;
});
canvas.addEventListener('mousemove', e => {
    if(!rightMouseDown) return;
    mouseX = e.clientX;
    mouseY = e.clientY - 30;
    let pos = [stepalize(mouseX - offset[0]) / step, stepalize(mouseY - offset[1]) / step];
    for (let i of DATA.json.map) {
        if (i.pos[0] === pos[0] && i.pos[1] === pos[1]) DATA.json.map.splice(DATA.json.map.indexOf(i), 1);
    }
});
canvas.addEventListener('contextmenu', e => {
    mouseX = e.clientX;
    mouseY = e.clientY - 30;
    let pos = [stepalize(mouseX - offset[0]) / step, stepalize(mouseY - offset[1]) / step];
    for (let i of DATA.json.map) {
        if (i.pos[0] === pos[0] && i.pos[1] === pos[1]) DATA.json.map.splice(DATA.json.map.indexOf(i), 1);
    }
});
canvas.addEventListener('click', e => {
    if (isInKeys(32)) return;
    mouseX = e.clientX;
    mouseY = e.clientY - 30;
    if (DATA.json.tiles.length === 0) return;
    let pos: [number, number] = [stepalize(mouseX - offset[0]) / step, stepalize(mouseY - offset[1]) / step];
    for (let i of DATA.json.map) {
        if (i.pos[0] === pos[0] && i.pos[1] === pos[1] && i.id === TileID) return;
    }
    DATA.json.map.push({ id: TileID, pos: pos });
})

window.addEventListener('resize', adaptSize);

setInterval(draw, 1000 / 60);