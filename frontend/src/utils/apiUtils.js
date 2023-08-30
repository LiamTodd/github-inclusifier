import {
  LOCAL_HOST_INCLUSIVE_LANGUAGE_REPORT_URL,
  LOCAL_HOST_SUGGESTION_URL,
  LOCAL_HOST_CODE_ANALYSIS_URL,
} from '../constants';

export const fetchData = (
  userName,
  repoName,
  accessToken,
  generateGithubIssue,
  handleSetRepoName,
  handleSetRawFileData,
  handleSetErrorMessage,
  handleSetLoading,
  handleSetDefaultBranch
) => {
  handleSetErrorMessage('');
  handleSetLoading(true);
  const url = new URL(LOCAL_HOST_INCLUSIVE_LANGUAGE_REPORT_URL);
  const params = {
    'repo-owner': userName,
    'repo-name': repoName,
    'access-token': accessToken,
    'generate-github-issue': generateGithubIssue,
  };
  Object.keys(params).forEach((key) =>
    url.searchParams.append(key, params[key])
  );
  fetch(url, { method: 'POST' })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        handleSetLoading(false);
        handleSetErrorMessage(data.error);
        return;
      }
      console.log(data);
      handleSetRepoName(data.repo);
      handleSetRawFileData(data.data);
      handleSetLoading(false);
      handleSetDefaultBranch(data.default_branch);
    });
};

export const fetchSuggestion = (
  llmEngine,
  originalText,
  term,
  handleSetLoading,
  handleSetErrorMessage,
  handleSetSuggestion,
  handleSetModelName
) => {
  handleSetErrorMessage('');
  handleSetLoading(true);
  const url = new URL(LOCAL_HOST_SUGGESTION_URL);
  const params = {
    'llm-engine': llmEngine,
    'original-text': originalText,
    term: term,
  };
  Object.keys(params).forEach((key) =>
    url.searchParams.append(key, params[key])
  );
  fetch(url, { method: 'POST' })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        handleSetLoading(false);
        handleSetSuggestion('');
        handleSetErrorMessage(`${llmEngine} ${data.error}`);
        return;
      }
      handleSetSuggestion(data.data);
      handleSetModelName(llmEngine);
      handleSetLoading(false);
    });
};

export const fetchCodeAnalysis = (
  languageMode,
  fileContent,
  handleSetErrorMessage,
  handleSetLoading,
  handleSetCodeAnalysis
) => {
  handleSetErrorMessage('');
  handleSetLoading(true);
  const url = new URL(LOCAL_HOST_CODE_ANALYSIS_URL);
  const params = {
    'language-mode': languageMode,
    'file-content': fileContent,
  };
  Object.keys(params).forEach((key) =>
    url.searchParams.append(key, params[key])
  );
  fetch(url, { method: 'POST' })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        handleSetLoading(false);
        handleSetCodeAnalysis(null);
        handleSetErrorMessage(data.error);
        return;
      }
      handleSetCodeAnalysis(data.data);
      handleSetLoading(false);
    });
};
