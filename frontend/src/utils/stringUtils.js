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

export const extractSentenceAtIndex = (text, index) => {
  const sentences = text.replace(/([.?!])\s*(?=[A-Z])/g, '$1|').split('|');
  for (const sentence of sentences) {
    const sentenceStart = text.indexOf(sentence);
    const sentenceEnd = sentenceStart + sentence.length - 1;
    if (index >= sentenceStart && index <= sentenceEnd) {
      return sentence;
    }
  }
  return null;
};

export const extractIndexOfSentence = (text, index) => {
  const sentences = text.replace(/([.?!])\s*(?=[A-Z])/g, '$1|').split('|');
  for (const sentence of sentences) {
    const sentenceStart = text.indexOf(sentence);
    const sentenceEnd = sentenceStart + sentence.length - 1;
    if (index >= sentenceStart && index <= sentenceEnd) {
      return index - sentenceStart;
    }
  }
  return null;
};
