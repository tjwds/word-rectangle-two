const splitByLength = function splitByLength(inputWordList) {
  const dictionaryByLength = [];

  inputWordList.forEach((word) => {
    if (typeof dictionaryByLength[word.length] === 'undefined') {
      dictionaryByLength[word.length] = [];
    }
    dictionaryByLength[word.length].push(word);
  });

  return dictionaryByLength;
};

const dictionaryMapper = function dictionaryMapper(dictByLength) {
  const dictionary = [];
  for (
    let wordLength = 0;
    wordLength < dictByLength.length;
    wordLength += 1
  ) {
    dictionary[wordLength] = {};
    const lengthMap = dictionary[wordLength];
    const lengthWords = dictByLength[wordLength];
    if (typeof lengthWords !== 'undefined') {
      lengthWords.forEach((word) => {
        let mapDeep = lengthMap;
        const wordLetters = word.split('');
        // deliberately hoisting the letterIndex up a scope to let the for
        // loop handle our special case of the last letter, which is
        // deliberately left out of the loop.
        let letterIndex = 0;
        let letter = '';
        for (; letterIndex < wordLetters.length - 2;) {
          letter = wordLetters[letterIndex];
          if (typeof mapDeep[letter] === 'undefined') {
            mapDeep[letter] = {};
          }
          mapDeep = mapDeep[letter];
          letterIndex += 1;
        }
        mapDeep[wordLetters[letterIndex]] = wordLetters[letterIndex + 1];
      });
    }
  }
  return dictionary;
};

// does a string starting with these letters exist in our map?
const lettersSatisfiedByMap = function lettersSatisfiedByMap(
  lettersInput, targetLength, mappedDictionary,
) {
  let letters = lettersInput;
  if (typeof letters === 'string') {
    letters = letters.split('');
  }
  if (!letters.length) {
    return false;
  }
  let dict = mappedDictionary[targetLength];
  if (!dict) {
    return false;
  }
  for (let letterIndex = 0; letterIndex <= letters.length; letterIndex += 1) {
    if (typeof letters[letterIndex] === 'undefined') {
      return true;
    }
    if (typeof dict === 'string') {
      return dict === letters[letterIndex];
    }
    dict = dict[letters[letterIndex]];
    if (!dict) {
      return false;
    }
  }
  throw new Error("You shouldn't have gotten here.");
};

// also allows pre-rotated input to not require re-calculation.
const rotateWordArray = function rotateWordArray(wordArray, reusedResult) {
  let result = [];
  let startingWordIndex = 0;
  // arrrrgh, js.
  if (typeof reusedResult === 'object') {
    result = reusedResult;
    startingWordIndex = reusedResult.length ? reusedResult[0].length : 0;
  }
  for (
    let letterIndex = 0;
    letterIndex < wordArray[0].length;
    letterIndex += 1
  ) {
    // for each letter in wordArray length??
    for (
      let wordIndex = startingWordIndex;
      wordIndex < wordArray.length;
      wordIndex += 1
    ) {
      if (!wordIndex) {
        result[letterIndex] = wordArray[wordIndex][letterIndex];
      } else {
        result[letterIndex] += wordArray[wordIndex][letterIndex];
      }
    }
  }

  return result;
};

// method that creates an array of all words that satisfy column conditions
// returns rotated array to try to be speedy
const wordsHavePotentialColumnWords = function wordsHavePotentialColumnWords(
  testWords,
  columnLength,
  mappedDictionary,
  reusableResult,
) {
  const rotatedWords = rotateWordArray(testWords, reusableResult);
  if (rotatedWords.every((word) => lettersSatisfiedByMap(word, columnLength, mappedDictionary))) {
    return rotatedWords;
  }
  return false;
};

const recursivelyTestWords = function recursivelyTestWords(candidateResultZ, rowDictionary, rotatedCacheZ, columnLength, mappedDictionary, returnNotLog, bannedLastWords) {
  let rotatedCache = rotatedCacheZ;
  let candidateResult = [...candidateResultZ];
  for (let dictionaryIndex = 0; dictionaryIndex < rowDictionary.length; dictionaryIndex += 1) {
    const word = rowDictionary[dictionaryIndex];
    if (!bannedLastWords.includes(word)) {
      candidateResult.push(word);
      rotatedCache = wordsHavePotentialColumnWords(
        candidateResult, columnLength, mappedDictionary, rotatedCache,
      );
      if (rotatedCache) {
        if (rotatedCache[0].length === columnLength) {
          if (!returnNotLog) {
            console.log('WE DID IT');
            console.log(rotatedCache);
            bannedLastWords.push(word);
            return recursivelyTestWords([...candidateResult].slice(0, -1), rowDictionary, [], columnLength, mappedDictionary, returnNotLog, bannedLastWords);
          }
          return rotatedCache;
        }
        return recursivelyTestWords([...candidateResult], rowDictionary, [...rotatedCache], columnLength, mappedDictionary, returnNotLog, bannedLastWords);
      }
    }
    candidateResult = [...candidateResultZ];
  }
};

// todo:  make better args
const solveDictionary = function solveDictionary(dictionary, consoleLogging, returnNotLog, startRowLength, startColumnLength) {
  const dictionaryLength = splitByLength(dictionary);
  const mappedDictionary = dictionaryMapper(dictionaryLength);
  const MAXLENS = dictionaryLength.length;

  for (let columnLength = startColumnLength || MAXLENS; columnLength > 2; columnLength -= 1) {
    if (consoleLogging) {
      console.log(`${columnLength} down`);
    }
    for (let rowLength = startRowLength || MAXLENS; rowLength > 2; rowLength -= 1) {
      const rowDictionary = dictionaryLength[rowLength];
      if (consoleLogging) {
        console.log(`${rowLength} across`);
      }
      if (rowDictionary) {
        const candidateResult = [];
        const rotatedCache = [];
        const bannedLastWords = [];
        const recursiveResult = recursivelyTestWords([...candidateResult], rowDictionary, [...rotatedCache], columnLength, mappedDictionary, returnNotLog, bannedLastWords);
        if (recursiveResult) {
          return recursiveResult;
        }
      }
    }
  }
};

Object.assign(module.exports, {
  dictionaryMapper,
  lettersSatisfiedByMap,
  rotateWordArray,
  solveDictionary,
  splitByLength,
  wordsHavePotentialColumnWords,
});
