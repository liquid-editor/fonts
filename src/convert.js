const fs = require('fs');
var path = require('path');
var ttf2woff2 = require('ttf2woff2');

const folder = path.join(__dirname, './fonts');
const error = [];
function refactor() {
    fs.readdir(folder, { withFileTypes: true }, (err, files) => {
        files.forEach(dirents => {
            if (dirents.isFile()) {
                return;
            }
            const file = dirents.name;
            fs.readdirSync(path.join(folder, file), { withFileTypes: false }).forEach((i) => {
                const [fontName, s] = i.split('-');
                if (s) {
                    const [style, ext] = s.split('.');
                    if (ext === 'ttf' && !fs.existsSync(path.join(folder, `${file}/${fontName}-${style}.woff2`))) {
                        try {
                            fs.writeFileSync(path.join(folder, `${file}/${fontName}-${style}.woff2`), ttf2woff2(fs.readFileSync(path.join(folder, `${file}/${i}`))));
                        } catch (e) {
                            console.log(e);
                            if (!error.includes(fontName)) {
                                error.push(fontName);
                            }
                        }
                    }
                }
            });

        });
        console.log(error);
    });
}

refactor();