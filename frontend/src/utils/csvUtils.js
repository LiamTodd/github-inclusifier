import { CSV_HEADERS, NON_INCLUSIVE_LANGUAGE_TERMS } from '../constants';

export const exportCSV = (repoName, rawFileData, dataSet, algorithmName) => {
  const flatData = flattenFileData(rawFileData);
  let csvContent = 'data:text/csv;charset=utf-8,';
  csvContent += CSV_HEADERS;
  for (const file of flatData) {
    const row = [];
    if (file[dataSet]) {
      row.push(file.fileName, file.filePath);
      for (const category in NON_INCLUSIVE_LANGUAGE_TERMS) {
        for (const term of NON_INCLUSIVE_LANGUAGE_TERMS[category]) {
          const matches = file[dataSet][category][term]
            ? file[dataSet][category][term].length
            : 0;
          row.push(matches);
        }
      }
      row.push('\n');
      csvContent += row.join(',');
    }
  }
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `${algorithmName}-Analysis${repoName}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const flattenFileData = (rawFileData) => {
  const flatData = [];
  const root = rawFileData[0];
  flattenFileDataAux(root, flatData);
  return flatData;
};

const flattenFileDataAux = (fileData, flatData) => {
  if (fileData.is_dir) {
    for (const child of fileData.children) {
      flattenFileDataAux(child, flatData);
    }
  } else {
    flatData.push({
      content: fileData.content,
      fileName: fileData.file_name,
      filePath: fileData.file_path,
      sspmMatches: fileData.sspm_matches,
      wbpmMatches: fileData.wbpm_matches,
    });
  }
};
