import { MAX_PROCESSABLE_SENTENCE_LENGTH, PYTHON_KEYWORDS } from '../constants';

export const generateHeaderFromDoubleRootPath = (repoName, doubleRootPath) => {
  const doubleRootPathComponents = doubleRootPath.split('/');
  return `${repoName}/${doubleRootPathComponents.slice(2).join('/')}`;
};

export const generateFileUrl = (repoName, branchName, filePath) => {
  const filePathTail = filePath.split('/');
  return `${generateRepoUrl(repoName)}/blob/${branchName}/${filePathTail
    .slice(2)
    .join('/')}`;
};

export const generateRepoUrl = (repoName) => {
  return `https://github.com/${repoName}`;
};

export const getRepoNameFromExtendedName = (extendedName) => {
  return extendedName.split('/')[1];
};

const flattenAllNames = (allNames) => {
  const flattenedNames = [];
  for (const type of Object.values(allNames)) {
    for (const usedName of Object.keys(type)) {
      if (!flattenedNames.includes(usedName)) {
        flattenedNames.push(usedName);
      }
    }
  }
  return flattenedNames;
};
export const isPythonNameIllegal = (newName, allNames) => {
  if (!newName.match(/^[a-zA-Z0-9_]*$/)) {
    return true;
  }
  if (PYTHON_KEYWORDS.includes(newName)) {
    return true;
  }
  if (newName.match(/^\d/)) {
    return true;
  }
  if (allNames && flattenAllNames(allNames).includes(newName)) {
    return true;
  }
  return false;
};

export const getPythonNameErrorText = (newName, allNames) => {
  if (!newName.match(/^[a-zA-Z0-9_]*$/)) {
    return 'New name contains illegal characters.';
  }
  if (PYTHON_KEYWORDS.includes(newName)) {
    return 'New name cannot be a keyword.';
  }
  if (newName.match(/^\d/)) {
    return 'New name cannot begin with a number.';
  }
  if (flattenAllNames(allNames).includes(newName)) {
    return 'This name is already in use.';
  }
  return null;
};

const getShortenedSentence = (sentence, sentenceIndex) => {
  const includeAllLeft = sentenceIndex <= MAX_PROCESSABLE_SENTENCE_LENGTH / 2;
  const includeAllRight =
    sentence.length - sentenceIndex <= MAX_PROCESSABLE_SENTENCE_LENGTH / 2;
  if (includeAllLeft && includeAllRight) {
    // no slicing
    // should never execute, but here in case
    console.log('errenous sentence shortening calculation');
    return sentence;
  }
  let leftIndex;
  let leftTrail = '';
  let rightIndex;
  let rightTrail = '';
  let indexWithinShortenedSentence;
  const dotTrail = '...';

  if (includeAllLeft && !includeAllRight) {
    // slice the right only
    leftIndex = 0;
    rightIndex = MAX_PROCESSABLE_SENTENCE_LENGTH;
    rightTrail = dotTrail;
    indexWithinShortenedSentence = sentenceIndex;
  } else if (!includeAllLeft && includeAllRight) {
    // slice the left only
    leftIndex = sentence.length - MAX_PROCESSABLE_SENTENCE_LENGTH;
    rightIndex = sentence.length;
    leftTrail = dotTrail;
    indexWithinShortenedSentence =
      sentenceIndex - (sentence.length - MAX_PROCESSABLE_SENTENCE_LENGTH);
  } else {
    // slice the left and right
    leftIndex = sentenceIndex - MAX_PROCESSABLE_SENTENCE_LENGTH / 2;
    rightIndex = sentenceIndex + MAX_PROCESSABLE_SENTENCE_LENGTH / 2;
    rightTrail = dotTrail;
    leftTrail = dotTrail;
    indexWithinShortenedSentence = MAX_PROCESSABLE_SENTENCE_LENGTH / 2;
  }
  return {
    shortenedSentence: `${leftTrail}${sentence.slice(
      leftIndex,
      rightIndex
    )}${rightTrail}`,
    indexWithinShortenedSentence:
      indexWithinShortenedSentence + leftTrail.length,
  };
};

export const extractSentenceAtIndex = (text, index) => {
  const sentences = text.replace(/([.?!])\s*(?=[A-Z])/g, '$1|').split('|');
  for (const sentence of sentences) {
    const sentenceStart = text.indexOf(sentence);
    const sentenceEnd = sentenceStart + sentence.length - 1;
    if (index >= sentenceStart && index <= sentenceEnd) {
      if (sentence.length > MAX_PROCESSABLE_SENTENCE_LENGTH) {
        const sentenceIndex = index - sentenceStart;
        return getShortenedSentence(sentence, sentenceIndex).shortenedSentence;
      }
      return sentence;
    }
  }
  return null;
};

export const extractIndexWithinSentence = (text, index) => {
  const sentences = text.replace(/([.?!])\s*(?=[A-Z])/g, '$1|').split('|');
  for (const sentence of sentences) {
    const sentenceStart = text.indexOf(sentence);
    const sentenceEnd = sentenceStart + sentence.length - 1;
    if (index >= sentenceStart && index <= sentenceEnd) {
      if (sentence.length > MAX_PROCESSABLE_SENTENCE_LENGTH) {
        const sentenceIndex = index - sentenceStart;
        return getShortenedSentence(sentence, sentenceIndex)
          .indexWithinShortenedSentence;
      }
      return index - sentenceStart;
    }
  }
  return null;
};

export const capitalizeFirstLetters = (string) => {
  const words = string.toLowerCase().split(' ');

  const capitalizedWords = words.map((word) => {
    if (word.length === 0) {
      return '';
    }
    return word.charAt(0).toUpperCase() + word.slice(1);
  });

  return capitalizedWords.join(' ');
};
