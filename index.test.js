const wordRectangle = require('./index.js');

const {
  dictionaryMapper,
  lettersSatisfiedByMap,
  rotateWordArray,
  solveDictionary,
  splitByLength,
  wordsHavePotentialColumnWords,
} = wordRectangle;

const inputDictionary = ['bears', 'beat', 'bee', 'bees', 'cat', 'one', 'ore', 'too', 'tub', 'urn'];
let dictionaryLength = [];
let mappedDictionary = [];

test('splitByLength, dictionaryMapper, and wordsHavePotentialColumnWords', () => {
  const splitResult = [undefined, undefined, undefined, ['bee', 'cat', 'one', 'ore', 'too', 'tub', 'urn'], ['beat', 'bees'], ['bears']];
  dictionaryLength = splitByLength(inputDictionary);
  expect(dictionaryLength).toEqual(splitResult);
});

test('dictionaryMapper generates map of letters', () => {
  const splitResult = [{}, {}, {}, {
    b: { e: 'e' }, c: { a: 't' }, o: { n: 'e', r: 'e' }, t: { o: 'o', u: 'b' }, u: { r: 'n' },
  }, { b: { e: { a: 't', e: 's' } } }, { b: { e: { a: { r: 's' } } } }];
  mappedDictionary = dictionaryMapper(dictionaryLength);
  expect(mappedDictionary).toEqual(splitResult);
});

test('lettersSatisfiedByMap indicates strings in our map', () => {
  expect(lettersSatisfiedByMap('ca', 3, mappedDictionary)).toBe(true);
  expect(lettersSatisfiedByMap('bears', 5, mappedDictionary)).toBe(true);
  expect(lettersSatisfiedByMap('beard', 5, mappedDictionary)).toBe(false);
  expect(lettersSatisfiedByMap(['b', 'e', 'e'], 4, mappedDictionary)).toBe(true);
});

test('rotateWordArray rotates a word array (and uses caches result)', () => {
  const firstRotation = rotateWordArray(['bears', 'knees']);
  expect(firstRotation).toEqual(['bk', 'en', 'ae', 're', 'ss']);
  expect(rotateWordArray(['bears', 'knees', 'spoon'], firstRotation))
    .toEqual(['bks', 'enp', 'aeo', 'reo', 'ssn']);
});

// an arbitrary array of words can be checked for column compatibility
test('wordsHavePotentialColumnWords checks words for columns', () => {
  const columnedWords = wordsHavePotentialColumnWords(['too', 'urn'], 3, mappedDictionary);
  expect(columnedWords).toBeTruthy();
  expect(wordsHavePotentialColumnWords(['too', 'urn', 'bee'], 3, mappedDictionary, columnedWords)).toBeTruthy();
  expect(wordsHavePotentialColumnWords(['too', 'urn', 'bee'], 6, mappedDictionary, columnedWords)).toBe(false);
});

test('solveDictionary returns a valid result', () => {
  expect(solveDictionary(inputDictionary, false, true)).toEqual(['tub', 'ore', 'one']);
});
