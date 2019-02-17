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
    map: number[][]
}
interface __DATA_json_tile {
    name: string,
    id: number,
    resID: number
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
    tileNewClose = <HTMLElement>document.getElementById('p-close'),
    tileNewSave = <HTMLElement>document.getElementById('p-save'),
    tileImage = <HTMLElement>document.getElementById('tile-image'),
    tileName = <HTMLElement>document.getElementById('tile-name'),
    tileNewNameIN = <HTMLInputElement>document.getElementById('p-in-name'),
    tileNewFileIN = <HTMLInputElement>document.getElementById('p-in-image'),
    DATA: dataInterface = {
        json: {
            size: 100,
            tiles: [],
            map: [
                [-1, -1, -1, -1, -1, -1, -1, -1],
                [-1, -1, -1, -1, -1, -1, -1, -1],
                [-1, -1, -1, -1, -1, -1, -1, -1],
                [-1, -1, -1, -1, -1, -1, -1, -1],
                [-1, -1, -1, -1, -1, -1, -1, -1],
                [-1, -1, -1, -1, -1, -1, -1, -1],
                [-1, -1, -1, -1, -1, -1, -1, -1],
                [-1, -1, -1, -1, -1, -1, -1, -1]
            ]
        },
        res: []
    }

var TileID = 0;

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
    if(TileID <= 0) TileID = DATA.json.tiles.length === 0 ? 0 :  DATA.json.tiles.length-1;
    else --TileID;
    onTileIDChange();
});

bottomArrowButton.addEventListener('click', () => {
    if(TileID >= DATA.json.tiles.length-1) TileID = 0;
    else ++TileID;
    onTileIDChange();
});

tileNewSave.addEventListener('click', () => {
    const name = tileNewNameIN.value;
    if((<FileList>tileNewFileIN.files).length === 0) return;
    const file = (<FileList>tileNewFileIN.files)[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function(e) {
        const res = (<{result: string}><unknown>e.target).result;
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
    if(DATA.json.tiles.length === 0 || tile === null) {
        tileImage.style.backgroundImage = '';
        tileName.innerHTML = 'name#id';
    } else {
        tileImage.style.backgroundImage = `url(${DATA.res[tile.resID]})`;
        tileName.innerHTML = `${tile.name}#${tile.id}`;
    }
}

function getTileById(id :number) {
    let res : null | __DATA_json_tile = null;
    for(let i of DATA.json.tiles) {
        if(i.id === id) res = i;
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

function onKeysChange() {
    const isInKeys = function (...el: number[]) {
        for (let i of el) {
            if (keys.indexOf(i) === -1) return false;
        }
        return true;
    }
    if (isInKeys(17, 82)) location.reload();
    if (isInKeys(18, 16, 73)) {
        win().webContents.toggleDevTools()
    }
}
