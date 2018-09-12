const zlib = require('zlib');
const fs = require('fs');
const tree = fs.readFileSync('./tree-orig.js', { encoding: 'utf8'});
const treedout = zlib.deflateRawSync(tree);
fs.writeFileSync('./tree.bin', treedout);
const file = 'r=require,eval(r("zlib").inflateRawSync(r("fs").readFileSync("tree.bin")).toString())';
fs.writeFileSync('./tree.js', file, { encoding: 'utf8'});
