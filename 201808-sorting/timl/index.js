
const fs = require('fs');

const order = [undefined, 'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',' ','1','2','3','4','5','6','7','8','9','0',':','-','.',"'",'’','#','/'];

const compare = (s1, s2) => {
    // Is s1 bigger than (or equal to) s2? ull/undefined are always big
    if (s1 === undefined) return true;
    if (s2 === undefined) return false;
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();
    const N = Math.max(s1.length, s2.length);
    for (let i = 0; i < N; i++) {
        if (s1[i] !== s2[i]) return order.indexOf(s1[i]) > order.indexOf(s2[i])
    }
    return true; // Must be identical
}

const selectionSort = (data) => {
    const N = data.length;
    const sorted = [];
    for (let i = 0; i < N; i++) {
        let marker = 0;
        for (let j = 1; j < N; j++) {
            if (data[j] && compare(data[marker], data[j])) {
                marker = j;
            }
        }
        sorted.push(data[marker]);
        data[marker] = undefined;
    }
    return sorted;
}


const merge = (data1, data2) => {
    let i1 = 0;
    let i2 = 0;
    const result = [];
    while (data1[i1] !== undefined || data2[i2] !== undefined) {
        result.push(compare(data1[i1], data2[i2]) ? data2[i2++] : data1[i1++]);
    }
    return result;
}

const mergeSort = (data, low, high) => {
    // Take index parameters so that we don't have to manipulate the underlying array
    low = low !== undefined ? low : 0;
    high = high !== undefined ? high : data.length;

    if (high === low) return [] // Base case
    if (high - low === 1) return [data[low]]; // Base case

    const middle = Math.floor((low + high) / 2);

    return merge(mergeSort(data, low, middle), mergeSort(data, middle, high));
}


const timedSort = (data, sortFn) => {
    const N = data.length;
    const t0 = process.hrtime();
    const output = sortFn([...data]);
    const t1 = process.hrtime();
    const dt = 1000000000 * (t1[0] - t0[0]) + (t1[1] - t0[1]);
    console.log(`N: ${N} - time: ${dt/1000000000} s - per-elem: ${dt/N/1000} us`)
    if (N !== output.length) console.error(`Incorrect length: ${output.length} !== ${N}`)
};

const data = JSON.parse(fs.readFileSync('../unsorted.json'));

console.log('Merge Sort');
timedSort(data.normies, mergeSort);
timedSort(data.villains, mergeSort);
timedSort(data.heroes, mergeSort);
console.log('Selection Sort');
timedSort(data.normies, selectionSort);
timedSort(data.villains, selectionSort);
timedSort(data.heroes, selectionSort);


// Selection Sort
// N: 1000 - time: 0.126074397 s - per-elem: 126.07439699999999 us
// N: 20000 - time: 48.222657082 s - per-elem: 2411.1328541000003 us
// N: 40000 - time: 188.528793157 s - per-elem: 4713.219828925 us
// node index.js  236.94s user 1.21s system 100% cpu 3:57.86 total
