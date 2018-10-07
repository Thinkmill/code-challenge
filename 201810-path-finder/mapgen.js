const _randInt = (n) => Math.floor(n * Math.random());

const _solveable = (map, s, e) => {
  if (!map[s[0]][s[1]]) return false;
  const n=map.length;
  const ns=map.reduce((acc, row, i) => ({...acc, ...row.reduce((o, c, j) => ({...o, [i*n + j]: c}), {})}) ,{});
  const v=Object.keys(ns).reduce((o, k) => ({...o, [k]: false}), {});
  let cn=s[1]*n+s[0]
  const cs=[cn];
  v[cn]=true;
  while (cn!==e[1]*n+e[0] && cn !== undefined) {
    const x=cn%n;
    const y=(cn-cn%n)/n;
    const nn=[[x,y+1],[x+1,y],[x,y-1],[x-1,y]].filter(p=>p.every(z=>z>=0&&z<n)).map(([xx,yy])=>yy*n+xx).find(q=>!v[q]&&ns[q]);
    if (nn===undefined) {
      cs.pop();
    } else {
      cs.push(nn);
      v[nn]=true;
    }
    cn=cs.slice(-1)[0];
  }
  return cn===e[1]*n+e[0];
}

const generateMap = (n, difficulty, start, end) => {
  attempts = 0;
  while (attempts < 1000) {
    const map = Array(n).fill().map(_ => Array(n).fill(true));

    let blocks = n * n * difficulty;

    while (blocks > 0) {
      map[_randInt(n)][_randInt(n)] = false;
      blocks--;
    }

    if (_solveable(map, start, end)) return map;
    attempts++;
  }
}

const n = 50;
const start = [0, 0];
const end = [n-1, n-1];
console.log(generateMap(n, 0.3, start, end));
