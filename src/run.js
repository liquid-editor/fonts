const fs = require('fs');
var path = require('path');

const folder = path.join(__dirname, './fonts');
var data = [];
const weightMap = {
    Thin: 100,
    ThinItalic: 100,
    ExtraLight: 200,
    ExtraLightItalic: 200,
    Light: 300,
    LightItalic: 300,
    Regular: 400,
    RegularItalic: 400,
    Medium: 500,
    MediumItalic: 500,
    SemiBold: 600,
    SemiBoldItalic: 600,
    Bold: 700,
    BoldItalic: 700,
    ExtraBold: 800,
    ExtraBoldItalic: 800,
    Black: 900,
    BlackItalic: 900,
}

const deleteFolderRecursive = function(path) {
    if( fs.existsSync(path) ) {
        fs.readdirSync(path).forEach(function(file) {
            var curPath = path + "/" + file;
            if(fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};
const url = 'https://github.com/liquid-editor/fonts/raw/master/src/fonts';
const convertFontName = (name) => name.split(/(?=[A-Z][a-z])/).join(' ');
function generate() {
    fs.readdirSync(folder, { withFileTypes: true }).forEach((file) => {
        if (file.isFile()) {
            return;
        }
        const settings = {name: convertFontName(file.name), fonts: []};
        fs.readdirSync(path.join(folder, file.name)).forEach((i) => {
            const [_, ...rest] = i.split('-');
            if (rest.length >= 1) {
                const [style, ext] = rest[rest.length - 1].split('.');
                if (ext === 'woff2') {
                    if (weightMap[style]) {
                        const w = weightMap[style];
                        if ([400, 700].includes(w)) {
                            if (style.indexOf('Italic') !== -1) {
                                settings.fonts.push({
                                    style: w === 700 ? 'Bold_Italic' : 'Italic',
                                    urls: [`${url}/${file.name}/${file.name}-${w === 700 ? 'Bold' : 'Regular'}.woff2`],
                                })
                            }
                            settings.fonts.push({
                                style: w === 700 ? 'Bold' : undefined,
                                urls: [`${url}/${file.name}/${file.name}-${w === 700 ? 'Bold' : 'Regular'}.woff2`]
                            });
                        }
                    }
                }
            }
        });
        if (settings.fonts.length > 0) {
            data.push(settings);
        }
    });
    fs.writeFile('data.json', JSON.stringify(data), (err) => {
        if (err) {
            throw err;
        }
        console.log("JSON data is saved.");
    });
}

//refactor();
generate();
