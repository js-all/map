interface navButtonInterface {
    el: HTMLDivElement,
    mask: HTMLDivElement;
}
interface dataInterface {
    json: __DATA_json,
    res: string[]
}
interface __DATA_json {
    size: number,
    tiles: __DATA_json_tile[],
    map: __DATA_json_mapTile[]
}
interface __DATA_json_tile {
    name: string,
    id: number,
    resID: number,
    background: boolean
}
interface __DATA_json_mapTile {
    id: number,
    pos: [number, number]
}

const { BrowserWindow, remote } = require("electron"),
    keys: Array<number> = [],
    win = () => <BrowserWindow>remote.BrowserWindow.getFocusedWindow(),
    closeButton: navButtonInterface = {
        el: <HTMLDivElement>document.getElementById('nav-close-button'),
        mask: <HTMLDivElement>document.getElementById('nav-close-icon')
    },
    minButton: navButtonInterface = {
        el: <HTMLDivElement>document.getElementById('nav-min-button'),
        mask: <HTMLDivElement>document.getElementById('nav-min-icon')
    },
    maxButton: navButtonInterface = {
        el: <HTMLDivElement>document.getElementById('nav-max-button'),
        mask: <HTMLDivElement>document.getElementById('nav-max-icon')
    },
    popupEls: HTMLElement[] = [],
    saveButton = <HTMLElement>document.getElementById('save'),
    gearButton = <HTMLElement>document.getElementById('gear-button'),
    topArrowButton = <HTMLElement>document.getElementById('tile-top-arrow'),
    bottomArrowButton = <HTMLElement>document.getElementById('tile-bottom-arrow'),
    tileNewButton = <HTMLElement>document.getElementById('tile-new-button'),
    gearCloseButton = <HTMLElement>document.getElementById('g-close'),
    gearInsCode = <HTMLElement>document.getElementById('ins-code'),
    gearSize = <HTMLInputElement>document.getElementById('g-in-size'),
    tileNewClose = <HTMLElement>document.getElementById('p-close'),
    tileNewSave = <HTMLElement>document.getElementById('p-save'),
    tileImage = <HTMLElement>document.getElementById('tile-image'),
    tileName = <HTMLElement>document.getElementById('tile-name'),
    tileNewNameIN = <HTMLInputElement>document.getElementById('p-in-name'),
    tileNewFileIN = <HTMLInputElement>document.getElementById('p-in-image'),
    tileNewBackgorund = <HTMLInputElement>document.getElementById('p-in-background'),
    gearFile = <HTMLInputElement>document.getElementById('g-in-file'),
    DATA: dataInterface = {
        json: {
            size: 100,
            tiles: [{ name: "oui", id: 0, resID: 0, background: false }],
            map: []
        },
        res: ["data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/PjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxOS4xLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT48c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkNhcGFfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiCSB2aWV3Qm94PSIwIDAgNDc4LjcwMyA0NzguNzAzIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA0NzguNzAzIDQ3OC43MDM7IiB4bWw6c3BhY2U9InByZXNlcnZlIj48Zz4JPGc+CQk8cGF0aCBkPSJNNDU0LjIsMTg5LjEwMWwtMzMuNi01LjdjLTMuNS0xMS4zLTgtMjIuMi0xMy41LTMyLjZsMTkuOC0yNy43YzguNC0xMS44LDcuMS0yNy45LTMuMi0zOC4xbC0yOS44LTI5LjgJCQljLTUuNi01LjYtMTMtOC43LTIwLjktOC43Yy02LjIsMC0xMi4xLDEuOS0xNy4xLDUuNWwtMjcuOCwxOS44Yy0xMC44LTUuNy0yMi4xLTEwLjQtMzMuOC0xMy45bC01LjYtMzMuMgkJCWMtMi40LTE0LjMtMTQuNy0yNC43LTI5LjItMjQuN2gtNDIuMWMtMTQuNSwwLTI2LjgsMTAuNC0yOS4yLDI0LjdsLTUuOCwzNGMtMTEuMiwzLjUtMjIuMSw4LjEtMzIuNSwxMy43bC0yNy41LTE5LjgJCQljLTUtMy42LTExLTUuNS0xNy4yLTUuNWMtNy45LDAtMTUuNCwzLjEtMjAuOSw4LjdsLTI5LjksMjkuOGMtMTAuMiwxMC4yLTExLjYsMjYuMy0zLjIsMzguMWwyMCwyOC4xCQkJYy01LjUsMTAuNS05LjksMjEuNC0xMy4zLDMyLjdsLTMzLjIsNS42Yy0xNC4zLDIuNC0yNC43LDE0LjctMjQuNywyOS4ydjQyLjFjMCwxNC41LDEwLjQsMjYuOCwyNC43LDI5LjJsMzQsNS44CQkJYzMuNSwxMS4yLDguMSwyMi4xLDEzLjcsMzIuNWwtMTkuNywyNy40Yy04LjQsMTEuOC03LjEsMjcuOSwzLjIsMzguMWwyOS44LDI5LjhjNS42LDUuNiwxMyw4LjcsMjAuOSw4LjdjNi4yLDAsMTIuMS0xLjksMTcuMS01LjUJCQlsMjguMS0yMGMxMC4xLDUuMywyMC43LDkuNiwzMS42LDEzbDUuNiwzMy42YzIuNCwxNC4zLDE0LjcsMjQuNywyOS4yLDI0LjdoNDIuMmMxNC41LDAsMjYuOC0xMC40LDI5LjItMjQuN2w1LjctMzMuNgkJCWMxMS4zLTMuNSwyMi4yLTgsMzIuNi0xMy41bDI3LjcsMTkuOGM1LDMuNiwxMSw1LjUsMTcuMiw1LjVsMCwwYzcuOSwwLDE1LjMtMy4xLDIwLjktOC43bDI5LjgtMjkuOGMxMC4yLTEwLjIsMTEuNi0yNi4zLDMuMi0zOC4xCQkJbC0xOS44LTI3LjhjNS41LTEwLjUsMTAuMS0yMS40LDEzLjUtMzIuNmwzMy42LTUuNmMxNC4zLTIuNCwyNC43LTE0LjcsMjQuNy0yOS4ydi00Mi4xCQkJQzQ3OC45LDIwMy44MDEsNDY4LjUsMTkxLjUwMSw0NTQuMiwxODkuMTAxeiBNNDUxLjksMjYwLjQwMWMwLDEuMy0wLjksMi40LTIuMiwyLjZsLTQyLDdjLTUuMywwLjktOS41LDQuOC0xMC44LDkuOQkJCWMtMy44LDE0LjctOS42LDI4LjgtMTcuNCw0MS45Yy0yLjcsNC42LTIuNSwxMC4zLDAuNiwxNC43bDI0LjcsMzQuOGMwLjcsMSwwLjYsMi41LTAuMywzLjRsLTI5LjgsMjkuOGMtMC43LDAuNy0xLjQsMC44LTEuOSwwLjgJCQljLTAuNiwwLTEuMS0wLjItMS41LTAuNWwtMzQuNy0yNC43Yy00LjMtMy4xLTEwLjEtMy4zLTE0LjctMC42Yy0xMy4xLDcuOC0yNy4yLDEzLjYtNDEuOSwxNy40Yy01LjIsMS4zLTkuMSw1LjYtOS45LDEwLjhsLTcuMSw0MgkJCWMtMC4yLDEuMy0xLjMsMi4yLTIuNiwyLjJoLTQyLjFjLTEuMywwLTIuNC0wLjktMi42LTIuMmwtNy00MmMtMC45LTUuMy00LjgtOS41LTkuOS0xMC44Yy0xNC4zLTMuNy0yOC4xLTkuNC00MS0xNi44CQkJYy0yLjEtMS4yLTQuNS0xLjgtNi44LTEuOGMtMi43LDAtNS41LDAuOC03LjgsMi41bC0zNSwyNC45Yy0wLjUsMC4zLTEsMC41LTEuNSwwLjVjLTAuNCwwLTEuMi0wLjEtMS45LTAuOGwtMjkuOC0yOS44CQkJYy0wLjktMC45LTEtMi4zLTAuMy0zLjRsMjQuNi0zNC41YzMuMS00LjQsMy4zLTEwLjIsMC42LTE0LjhjLTcuOC0xMy0xMy44LTI3LjEtMTcuNi00MS44Yy0xLjQtNS4xLTUuNi05LTEwLjgtOS45bC00Mi4zLTcuMgkJCWMtMS4zLTAuMi0yLjItMS4zLTIuMi0yLjZ2LTQyLjFjMC0xLjMsMC45LTIuNCwyLjItMi42bDQxLjctN2M1LjMtMC45LDkuNi00LjgsMTAuOS0xMGMzLjctMTQuNyw5LjQtMjguOSwxNy4xLTQyCQkJYzIuNy00LjYsMi40LTEwLjMtMC43LTE0LjZsLTI0LjktMzVjLTAuNy0xLTAuNi0yLjUsMC4zLTMuNGwyOS44LTI5LjhjMC43LTAuNywxLjQtMC44LDEuOS0wLjhjMC42LDAsMS4xLDAuMiwxLjUsMC41bDM0LjUsMjQuNgkJCWM0LjQsMy4xLDEwLjIsMy4zLDE0LjgsMC42YzEzLTcuOCwyNy4xLTEzLjgsNDEuOC0xNy42YzUuMS0xLjQsOS01LjYsOS45LTEwLjhsNy4yLTQyLjNjMC4yLTEuMywxLjMtMi4yLDIuNi0yLjJoNDIuMQkJCWMxLjMsMCwyLjQsMC45LDIuNiwyLjJsNyw0MS43YzAuOSw1LjMsNC44LDkuNiwxMCwxMC45YzE1LjEsMy44LDI5LjUsOS43LDQyLjksMTcuNmM0LjYsMi43LDEwLjMsMi41LDE0LjctMC42bDM0LjUtMjQuOAkJCWMwLjUtMC4zLDEtMC41LDEuNS0wLjVjMC40LDAsMS4yLDAuMSwxLjksMC44bDI5LjgsMjkuOGMwLjksMC45LDEsMi4zLDAuMywzLjRsLTI0LjcsMzQuN2MtMy4xLDQuMy0zLjMsMTAuMS0wLjYsMTQuNwkJCWM3LjgsMTMuMSwxMy42LDI3LjIsMTcuNCw0MS45YzEuMyw1LjIsNS42LDkuMSwxMC44LDkuOWw0Miw3LjFjMS4zLDAuMiwyLjIsMS4zLDIuMiwyLjZ2NDIuMUg0NTEuOXoiLz4JCTxwYXRoIGQ9Ik0yMzkuNCwxMzYuMDAxYy01NywwLTEwMy4zLDQ2LjMtMTAzLjMsMTAzLjNzNDYuMywxMDMuMywxMDMuMywxMDMuM3MxMDMuMy00Ni4zLDEwMy4zLTEwMy4zUzI5Ni40LDEzNi4wMDEsMjM5LjQsMTM2LjAwMQkJCXogTTIzOS40LDMxNS42MDFjLTQyLjEsMC03Ni4zLTM0LjItNzYuMy03Ni4zczM0LjItNzYuMyw3Ni4zLTc2LjNzNzYuMywzNC4yLDc2LjMsNzYuM1MyODEuNSwzMTUuNjAxLDIzOS40LDMxNS42MDF6Ii8+CTwvZz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PC9zdmc+"]
    },
    canvas = <HTMLCanvasElement>document.getElementById('canvas'),
    ctx = <CanvasRenderingContext2D>canvas.getContext('2d'),
    { log } = console;

var TileID = 0;
var mouseDown = false;
var rightMouseDown = false;
var step = 100;
var lastPos: [number, number] = [NaN, NaN];
var offset: [number, number] = [0, 0];
var mouseX = 0;
var mouseY = 0;

popupEls.push(<HTMLElement>document.getElementById('new-tile-popup'), <HTMLElement>document.getElementById('gear-popup'));

closeButton.el.addEventListener('click', () => {
    win().close();
});

minButton.el.addEventListener('click', () => {
    win().minimize();
});

maxButton.el.addEventListener('click', () => {
    if (!win().isMaximized()) {
        win().maximize();
    } else {
        win().unmaximize();
    };
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
    if (TileID <= 0) TileID = DATA.json.tiles.length === 0 ? 0 : DATA.json.tiles.length - 1;
    else --TileID;
    onTileIDChange();
});

bottomArrowButton.addEventListener('click', () => {
    if (TileID >= DATA.json.tiles.length - 1) TileID = 0;
    else ++TileID;
    onTileIDChange();
});

tileNewSave.addEventListener('click', () => {
    const name = tileNewNameIN.value;
    const background = tileNewBackgorund.checked;
    if ((<FileList>tileNewFileIN.files).length === 0) return;
    const file = (<FileList>tileNewFileIN.files)[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (e) {
        const res = (<{ result: string }><unknown>e.target).result;
        DATA.json.tiles.push({
            name: name,
            id: DATA.json.tiles.length,
            resID: DATA.res.length,
            background: background
        });
        DATA.res.push(res);
        popup(0);
        onTileIDChange();
    };
});

document.addEventListener('mousedown', e => {
    if (e.button === 0) mouseDown = true;
    else if (e.button === 2) rightMouseDown = true;
    if (canvas.style.cursor === "grab") canvas.style.cursor = "grabbing"
});
document.addEventListener('mouseup', e => {
    if (e.button === 0) mouseDown = false;
    else if (e.button === 2) rightMouseDown = false;
    canvas.style.cursor = ''
});

gearSize.addEventListener('change', e => {
    if (gearSize.value === "") gearSize.value = '100';
    else DATA.json.size = parseFloat(gearSize.value);
});
saveButton.addEventListener('click', () => {
    const a = document.createElement('a');
    a.download = 'map.json';
    const blobData = new Blob([JSON.stringify(DATA)], { type: 'application/json' });
    const reader = new FileReader();
    reader.readAsDataURL(blobData);
    reader.onload = (e) => {
        interface t {
            result: string
        }
        a.href = (<t><unknown>e.target).result;
        a.click();
    }

});

gearInsCode.addEventListener('click', () => {
    const file = (<FileList>gearFile.files)[0];
    if ((<FileList>gearFile.files).length === 0) {
        alert('no file')
        return;
    }
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = e => {
        const res = (<{ result: string }><unknown>e.target).result;
        try {
            const resJson = JSON.parse(res);
            DATA.json.map = resJson.json.map;
            DATA.json.size = resJson.json.size;
            DATA.json.tiles = resJson.json.tiles;
            DATA.res = resJson.res;

        } catch (e) {
            alert('invalid json')
        }
    }
});

setMaxButtonMask();

onTileIDChange();

function popup(popupElid: number) {
    const greyBG = document.getElementById('grey-cover');
    const popupEl = popupEls[popupElid];
    if (greyBG !== null && popupEl !== null) {
        if (popupEl.style.display !== 'block') {
            for (let i of popupEls) {
                i.style.display = 'none';
                if (i.classList.contains('ONEop')) i.classList.remove('ONEop');
                if (!i.classList.contains('ZEROop')) i.classList.add('ZEROop');
            }
            greyBG.style.display = 'block';
            if (greyBG.classList.contains('ZEROop')) greyBG.classList.remove('ZEROop');
            if (!greyBG.classList.contains('ONEop')) greyBG.classList.add('ONEop');
            popupEl.style.display = 'block';
            if (popupEl.classList.contains('ZEROop')) popupEl.classList.remove('ZEROop');
            if (!popupEl.classList.contains('ONEop')) popupEl.classList.add('ONEop');
        } else {
            for (let i of popupEls) {
                i.style.display = 'none';
                if (i.classList.contains('ONEop')) i.classList.remove('ONEop');
                if (!i.classList.contains('ZEROop')) i.classList.add('ZEROop');
            }
            if (greyBG.classList.contains('ONEop')) greyBG.classList.remove('ONEop');
            if (!greyBG.classList.contains('ZEROop')) greyBG.classList.add('ZEROop');
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
    } else {
        tileImage.style.backgroundImage = `url(${DATA.res[tile.resID]})`;
        tileName.innerHTML = `${tile.name}#${tile.id}`;
    }
}

function getTileById(id: number) {
    let res: null | __DATA_json_tile = null;
    for (let i of DATA.json.tiles) {
        if (i.id === id) res = i;
    }
    return res;
}

function setMaxButtonMask() {
    if (!win().isMaximized()) {
        maxButton.mask.classList.remove('MinMax-icon');
        maxButton.mask.classList.add("MaxMax-icon");
    } else {
        maxButton.mask.classList.add('MinMax-icon');
        maxButton.mask.classList.remove("MaxMax-icon");
    };
}

function isInKeys(...el: number[]) {
    for (let i of el) {
        if (keys.indexOf(i) === -1) return false;
    }
    return true;
}

function onKeysChange() {
    if (isInKeys(17, 82)) location.reload();
    if (isInKeys(18, 16, 73)) {
        win().webContents.toggleDevTools()
    }
    if (isInKeys(32)) { if (!mouseDown) canvas.style.cursor = "grab" }
    else { canvas.style.cursor = ""; }
    const transStep = 50
    if (isInKeys(17, 107) && step <= 1990) {
        ctx.translate(-transStep, -transStep)
        offset[0] -= transStep;
        offset[1] -= transStep;
        step += 10;
    }
    if (isInKeys(17, 109) && step >= 20) {
        ctx.translate(transStep, transStep)
        offset[0] += transStep;
        offset[1] += transStep;
        step -= 10;
    }
}
