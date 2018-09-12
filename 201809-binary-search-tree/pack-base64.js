const zlib = require('zlib');
const fs = require('fs');
const tree = fs.readFileSync('./tree-orig.js', { encoding: 'utf8'});
const treedout = zlib.deflateRawSync(tree);
const file = 'eval(require("zlib").inflateRawSync(Buffer.from("' + treedout.toString('base64') + '", "base64")).toString())';
fs.writeFileSync('./tree.js', file, { encoding: 'utf8'});
