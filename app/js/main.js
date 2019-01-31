"use strict";
if (!Object.prototype.hasOwnProperty.call(Array.prototype, 'includes')) {
    Object.defineProperty(Array, 'includes', {
        value(searchElement, fromIndex = 0) {
            for (let i = fromIndex; i < this.length; i++) {
                if (isNaN(searchElement) && isNaN(this[i]))
                    return true;
                if (searchElement === this[i])
                    return true;
            }
            return false;
        }
    });
}
const keys = [];
function onKeysChange() {
}
document.addEventListener('keydown', e => {
    if (keys.includes(e.keyCode)) {
    }
});
