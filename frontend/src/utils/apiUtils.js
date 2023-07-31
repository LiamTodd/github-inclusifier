import { LOCAL_HOST_INCLUSIVE_LANGUAGE_REPORT_URL } from '../constants';

export const fetchData = (
  userName,
  repoName,
  accessToken,
  handleSetRepoName,
  handleSetRawFileData,
  handleSetErrorMessage
) => {
  handleSetErrorMessage(null);
  const url = new URL(LOCAL_HOST_INCLUSIVE_LANGUAGE_REPORT_URL);
  const params = {
    'repo-owner': userName,
    'repo-name': repoName,
    'access-token': accessToken,
  };
  Object.keys(params).forEach((key) =>
    url.searchParams.append(key, params[key])
  );
  fetch(url, { method: 'POST' })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        handleSetErrorMessage(data.error);
        return;
      }
      handleSetRepoName(data.repo);
      handleSetRawFileData(data.data);
    });

  // devving without backend
  // handleSetRepoName(TEST_DATA.repo);
  // handleSetRawFileData(TEST_DATA.data);
};
