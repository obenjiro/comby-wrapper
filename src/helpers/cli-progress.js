const cliProgress = require('cli-progress');

// create a new progress bar instance and use shades_classic theme
const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
const isProgress = (process.env.PROGRESS == '1' || process.env.PROGRESS == 'true' || process.env.PROGRESS == 'on');

let currentMax = 0;
let currentVal = 0;

let timer;

module.exports = {
    addMax: (max) => {
        clearTimeout(timer);
        currentMax += max;
        if (isProgress) {
            bar.start(currentMax, currentVal);
        }
    },
    addVal: (val) => {
        clearTimeout(timer);
        currentVal += val;
        if (isProgress) {
            bar.update(currentVal);
        }
    },
    stop: () => {
        timer = setTimeout(() => {
            currentMax = 0;
            currentVal = 0;
            if (isProgress) {
                bar.stop();
            }
        }, 100);
    },
}