"use strict";
const { BrowserWindow, remote } = require("electron"), keys = [], win = () => remote.BrowserWindow.getFocusedWindow(), closeButton = {
    el: document.getElementById('nav-close-button'),
    mask: document.getElementById('nav-close-icon')
}, minButton = {
    el: document.getElementById('nav-min-button'),
    mask: document.getElementById('nav-min-icon')
}, maxButton = {
    el: document.getElementById('nav-max-button'),
    mask: document.getElementById('nav-max-icon')
}, popupEls = [], saveButton = document.getElementById('save'), gearButton = document.getElementById('gear-button'), topArrowButton = document.getElementById('tile-top-arrow'), bottomArrowButton = document.getElementById('tile-bottom-arrow'), tileNewButton = document.getElementById('tile-new-button'), gearCloseButton = document.getElementById('g-close'), gearInsCode = document.getElementById('ins-code'), tileNewClose = document.getElementById('p-close'), tileNewSave = document.getElementById('p-save'), tileImage = document.getElementById('tile-image'), tileName = document.getElementById('tile-name'), tileNewNameIN = document.getElementById('p-in-name'), tileNewFileIN = document.getElementById('p-in-image'), DATA = {
    json: {
        size: 100,
        tiles: [],
        map: []
    },
    res: []
}, canvas = document.getElementById('canvas'), ctx = canvas.getContext('2d'), { log } = console;
var TileID = 0;
var mouseDown = false;
var step = 100;
var lastPos = [NaN, NaN];
var offset = [0, 0];
var mouseX = 0;
var mouseY = 0;
popupEls.push(document.getElementById('new-tile-popup'), document.getElementById('gear-popup'));
closeButton.el.addEventListener('click', () => {
    win().close();
});
minButton.el.addEventListener('click', () => {
    win().minimize();
});
maxButton.el.addEventListener('click', () => {
    if (!win().isMaximized()) {
        win().maximize();
    }
    else {
        win().unmaximize();
    }
    ;
});
window.addEventListener('resize', setMaxButtonMask);
document.addEventListener('keydown', e => {
    if (keys.indexOf(e.keyCode) === -1) {
        keys.push(e.keyCode);
    }
    onKeysChange();
});
document.addEventListener('keyup', e => {
    if (keys.indexOf(e.keyCode) !== -1) {
        keys.splice(keys.indexOf(e.keyCode), 1);
    }
    onKeysChange();
});
gearButton.addEventListener('click', () => popup(1));
gearCloseButton.addEventListener('click', () => popup(1));
gearInsCode.addEventListener('click', () => popup(1));
tileNewButton.addEventListener('click', () => popup(0));
tileNewClose.addEventListener('click', () => popup(0));
topArrowButton.addEventListener('click', () => {
    if (TileID <= 0)
        TileID = DATA.json.tiles.length === 0 ? 0 : DATA.json.tiles.length - 1;
    else
        --TileID;
    onTileIDChange();
});
bottomArrowButton.addEventListener('click', () => {
    if (TileID >= DATA.json.tiles.length - 1)
        TileID = 0;
    else
        ++TileID;
    onTileIDChange();
});
tileNewSave.addEventListener('click', () => {
    const name = tileNewNameIN.value;
    if (tileNewFileIN.files.length === 0)
        return;
    const file = tileNewFileIN.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (e) {
        const res = e.target.result;
        DATA.json.tiles.push({
            name: name,
            id: DATA.json.tiles.length,
            resID: DATA.res.length
        });
        DATA.res.push(res);
        popup(0);
        onTileIDChange();
    };
});
canvas.addEventListener('mousedown', () => { mouseDown = true; if (canvas.style.cursor === "grab")
    canvas.style.cursor = "grabbing"; });
canvas.addEventListener('mouseup', () => { mouseDown = false; canvas.style.cursor = ''; });
setMaxButtonMask();
onTileIDChange();
function popup(popupElid) {
    const greyBG = document.getElementById('grey-cover');
    const popupEl = popupEls[popupElid];
    if (greyBG !== null && popupEl !== null) {
        if (popupEl.style.display !== 'block') {
            for (let i of popupEls) {
                i.style.display = 'none';
                if (i.classList.contains('ONEop'))
                    i.classList.remove('ONEop');
                if (!i.classList.contains('ZEROop'))
                    i.classList.add('ZEROop');
            }
            greyBG.style.display = 'block';
            if (greyBG.classList.contains('ZEROop'))
                greyBG.classList.remove('ZEROop');
            if (!greyBG.classList.contains('ONEop'))
                greyBG.classList.add('ONEop');
            popupEl.style.display = 'block';
            if (popupEl.classList.contains('ZEROop'))
                popupEl.classList.remove('ZEROop');
            if (!popupEl.classList.contains('ONEop'))
                popupEl.classList.add('ONEop');
        }
        else {
            for (let i of popupEls) {
                i.style.display = 'none';
                if (i.classList.contains('ONEop'))
                    i.classList.remove('ONEop');
                if (!i.classList.contains('ZEROop'))
                    i.classList.add('ZEROop');
            }
            if (greyBG.classList.contains('ONEop'))
                greyBG.classList.remove('ONEop');
            if (!greyBG.classList.contains('ZEROop'))
                greyBG.classList.add('ZEROop');
            setTimeout(() => {
                greyBG.style.display = 'none';
            }, 600);
        }
    }
}
function onTileIDChange() {
    const tile = getTileById(TileID);
    if (DATA.json.tiles.length === 0 || tile === null) {
        tileImage.style.backgroundImage = '';
        tileName.innerHTML = 'name#id';
    }
    else {
        tileImage.style.backgroundImage = `url(${DATA.res[tile.resID]})`;
        tileName.innerHTML = `${tile.name}#${tile.id}`;
    }
}
function getTileById(id) {
    let res = null;
    for (let i of DATA.json.tiles) {
        if (i.id === id)
            res = i;
    }
    return res;
}
function setMaxButtonMask() {
    if (!win().isMaximized()) {
        maxButton.mask.classList.remove('MinMax-icon');
        maxButton.mask.classList.add("MaxMax-icon");
    }
    else {
        maxButton.mask.classList.add('MinMax-icon');
        maxButton.mask.classList.remove("MaxMax-icon");
    }
    ;
}
function onKeysChange() {
    const isInKeys = function (...el) {
        for (let i of el) {
            if (keys.indexOf(i) === -1)
                return false;
        }
        return true;
    };
    if (isInKeys(17, 82))
        location.reload();
    if (isInKeys(18, 16, 73)) {
        win().webContents.toggleDevTools();
    }
    if (isInKeys(32)) {
        if (!mouseDown)
            canvas.style.cursor = "grab";
    }
    else {
        canvas.style.cursor = "";
    }
    const transStep = 50;
    if (isInKeys(17, 107) && step <= 1990) {
        ctx.translate(-transStep, -transStep);
        offset[0] -= transStep;
        offset[1] -= transStep;
        step += 10;
    }
    if (isInKeys(17, 109) && step >= 20) {
        ctx.translate(transStep, transStep);
        offset[0] += transStep;
        offset[1] += transStep;
        step -= 10;
    }
}
