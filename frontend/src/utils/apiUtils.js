import {
  LOCAL_HOST_INCLUSIVE_LANGUAGE_REPORT_URL,
  LOCAL_HOST_SUGGESTION_URL,
  LOCAL_HOST_CODE_ANALYSIS_URL,
  LOCAL_HOST_REFACTOR_URL,
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
  handleSetDefaultBranch,
  handleSetRepoCodeAnalysis,
  handleSetAllNames
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
      handleSetRepoName(data.repo);
      handleSetRawFileData(data.general_report);
      handleSetLoading(false);
      handleSetDefaultBranch(data.default_branch);
      handleSetRepoCodeAnalysis(data.codebase_analysis);
      handleSetAllNames(data.all_names);
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

export const doCodeRefactors = (
  handleSetLoading,
  handleSetErrorMessage,
  refactors,
  language,
  userName,
  accessToken,
  repoName,
  commitMessage,
  uuid,
  handleSetBranchUrl,
  handleSetConfirmed
) => {
  handleSetErrorMessage('');
  handleSetLoading(true);
  handleSetConfirmed(true);
  const url = new URL(LOCAL_HOST_REFACTOR_URL);
  const params = {
    refactors: JSON.stringify(refactors),
    'language-mode': language,
    'repo-owner': userName,
    'repo-name': repoName,
    'access-token': accessToken,
    'commit-message': commitMessage,
    uuid: uuid,
  };
  Object.keys(params).forEach((key) =>
    url.searchParams.append(key, params[key])
  );
  fetch(url, { method: 'POST' })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        handleSetLoading(false);
        handleSetConfirmed(false);
        handleSetErrorMessage(data.error);
        return;
      }
      handleSetBranchUrl(data.branch_url);
      handleSetLoading(false);
    });
};
