export const generateHeaderFromDoubleRootPath = (repoName, doubleRootPath) => {
  const doubleRootPathComponents = doubleRootPath.split('/');
  return `${repoName}/${doubleRootPathComponents.slice(2).join('/')}`;
};
