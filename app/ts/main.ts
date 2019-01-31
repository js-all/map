const keys :Array<number> = [];
const { remote } = require('electron');

function onKeysChange() {
    const isInKeys = function(...el :number[]) {
        for(let i of el) {
            if(keys.indexOf(i) === -1) return false;
        }
        return true;
    }
    if(isInKeys(17, 82)) location.reload();
    if(isInKeys(18, 16, 73)) {
        remote.BrowserWindow.getFocusedWindow().webContents.toggleDevTools()
    }
}

document.addEventListener('keydown', e => {
    if(keys.indexOf(e.keyCode) === -1) {
        keys.push(e.keyCode);
    }
    onKeysChange();
});
document.addEventListener('keyup', e => {
    if(keys.indexOf(e.keyCode) !== -1) {
        keys.splice(keys.indexOf(e.keyCode), 1);
    } 
    onKeysChange();
});