import { MAX_PROCESSABLE_SENTENCE_LENGTH } from '../constants';

export const generateHeaderFromDoubleRootPath = (repoName, doubleRootPath) => {
  const doubleRootPathComponents = doubleRootPath.split('/');
  return `${repoName}/${doubleRootPathComponents.slice(2).join('/')}`;
};

export const generateMatchCountDisplay = (SSPMFlags, WBPMFlags) => {
  return `View ${SSPMFlags} SSPM and ${WBPMFlags} WBPM flag(s)`;
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
