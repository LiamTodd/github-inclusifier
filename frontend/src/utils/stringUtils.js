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
