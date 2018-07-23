/*

| Action      | Income | Cost | Requires  | Blockable  |
| ----------- | ------ | ---- | --------- | ---------- |
| Income      |      1 |    0 | -         | -          |
| Foreign Aid |      2 |    0 | -         | Duke       |
| Tax         |      3 |    0 | Duke      | -          |
| Coup        |      0 |    7 | -         | -          |
| Assassinate |      0 |    3 | Assassin  | Contessa   |
| Exchange    |      0 |    0 | Ambassador| -          |
| Steal       |      0 |    2 | Captain   | Cap/Amb    |
*/

const ACTIONS = [
	{ key: 'taking-1',       income: 1, cost: 0, requires: [],           , blockableBy: []                        },
	{ key: 'foreign-aid',    income: 2, cost: 0, requires: [],           , blockableBy: ['duke']                  },
	{ key: 'couping',        income: 0, cost: 7, requires: ['duke']      , blockableBy: []                        },
	{ key: 'taking-3',       income: 3, cost: 0, requires: []            , blockableBy: []                        },
	{ key: 'assassination',  income: 0, cost: 3, requires: ['assassin']  , blockableBy: ['contessa']              },
	{ key: 'swapping',       income: 0, cost: 0, requires: ['ambassador'], blockableBy: []                        },
	{ key: 'stealing',       income: 0, cost: 2, requires: ['captain']   , blockableBy: ['captain', 'ambassador'] },
];


const BLOCK_ACTIONS = {
	'foreign-aid': ['duke'],
	'assassination': ['contessa'],
	'stealing': ['captain', 'ambassador'],
}
