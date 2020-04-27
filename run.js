const fs = require('fs');
const wordListPath = require('word-list');
const wordRectangle = require('./index.js');

let wordArray = fs.readFileSync(wordListPath, 'utf8').split('\n');
wordArray = wordArray.sort();

wordRectangle.solveDictionary(wordArray, true, false, 15, 3, 5647);
