import { useState, useCallback, useEffect } from 'react';
import {
  APP_NAME,
  BLACK,
  DARK_GREY,
  DEFAULT_BRANCH_KEY,
  LIGHT_PURPLE,
  RAW_FILE_DATA_KEY,
  REPO_NAME_KEY,
  SELECTED_FILE_DATA_KEY,
  SELECTED_TERM_KEY,
  SSPM_DATASET_KEY,
  SSPM_NAME,
  WBPM_DATASET_KEY,
  WBPM_NAME,
  WHITE,
  LANGUAGE_MODE_KEY,
  VIEW_CODE_ANALYSIS_KEY,
  REPO_CODE_ANALYSIS_KEY,
  ALL_NAMES_KEY,
} from '../constants';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import RepoSummaryComponent from './RepoSummaryComponent.js';
import FileDetailComponent from './FileDetailComponent';
import {
  generateFileUrl,
  generateHeaderFromDoubleRootPath,
  generateRepoUrl,
} from '../utils/stringUtils';
import LinkToRepoComponent from './LinkToRepoComponent';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CodeIcon from '@mui/icons-material/Code';
import { IconButton, Link } from '@mui/material';
import { exportCSV } from '../utils/csvUtils';
import TermSuggestionsComponent from './TermSuggestionsComponent';
import CodeAnalysisComponent from './CodeAnalysisComponent';
import CodebaseAnalysisComponent from './CodebaseAnalysisComponent';

function AppBackgroundComponent() {
  const [repoName, setRepoName] = useState(
    JSON.parse(localStorage.getItem(REPO_NAME_KEY))
  );
  const [rawFileData, setRawFileData] = useState(
    JSON.parse(localStorage.getItem(RAW_FILE_DATA_KEY))
  );
  const [selectedFileData, setSelectedFileData] = useState(
    JSON.parse(localStorage.getItem(SELECTED_FILE_DATA_KEY))
  );
  const [selectedTermData, setSelectedTermData] = useState(
    JSON.parse(localStorage.getItem(SELECTED_TERM_KEY))
  );
  const [backButtonActive, setBackButtonActive] = useState(false);
  const [defaultBranch, setDefaultBranch] = useState(
    JSON.parse(localStorage.getItem(DEFAULT_BRANCH_KEY))
  );
  const [languageMode, setLanguageMode] = useState(
    JSON.parse(localStorage.getItem(LANGUAGE_MODE_KEY))
  );
  const [viewCodeAnalysis, setViewCodeAnalysis] = useState(
    JSON.parse(localStorage.getItem(VIEW_CODE_ANALYSIS_KEY))
  );
  const [repoCodeAnalysis, setRepoCodeAnalysis] = useState(
    JSON.parse(localStorage.getItem(REPO_CODE_ANALYSIS_KEY))
  );
  const [allNames, setAllNames] = useState(
    JSON.parse(localStorage.getItem(ALL_NAMES_KEY))
  );

  useEffect(() => {
    setBackButtonActive(
      (rawFileData && repoName) || (rawFileData && repoName && selectedFileData)
    );
  }, [rawFileData, selectedFileData, repoName]);

  // update local storage
  useEffect(() => {
    window.localStorage.setItem(REPO_NAME_KEY, JSON.stringify(repoName));
    window.localStorage.setItem(RAW_FILE_DATA_KEY, JSON.stringify(rawFileData));
    window.localStorage.setItem(
      SELECTED_FILE_DATA_KEY,
      JSON.stringify(selectedFileData)
    );
    window.localStorage.setItem(
      SELECTED_TERM_KEY,
      JSON.stringify(selectedTermData)
    );
    window.localStorage.setItem(
      DEFAULT_BRANCH_KEY,
      JSON.stringify(defaultBranch)
    );
    window.localStorage.setItem(
      LANGUAGE_MODE_KEY,
      JSON.stringify(languageMode)
    );
    window.localStorage.setItem(
      VIEW_CODE_ANALYSIS_KEY,
      JSON.stringify(viewCodeAnalysis)
    );
    window.localStorage.setItem(
      REPO_CODE_ANALYSIS_KEY,
      JSON.stringify(repoCodeAnalysis)
    );
    window.localStorage.setItem(ALL_NAMES_KEY, JSON.stringify(allNames));
  }, [
    repoName,
    rawFileData,
    selectedFileData,
    selectedTermData,
    defaultBranch,
    languageMode,
    viewCodeAnalysis,
    repoCodeAnalysis,
    allNames,
  ]);

  const handleBackClick = () => {
    // on code analysis page
    if (viewCodeAnalysis) {
      setViewCodeAnalysis(false);
    }
    // on language analysis page
    else if (languageMode && selectedFileData) {
      setSelectedFileData(null);
      setLanguageMode(null);
    } else if (selectedTermData) {
      // on suggestions page
      setSelectedTermData(null);
    } else if (selectedFileData) {
      // if on file detail page
      setSelectedFileData(null);
    } else if (rawFileData && repoName) {
      // if on repo view
      setRawFileData(null);
      setRepoName(null);
    }
  };

  const wrapperSetDefaultBranch = useCallback(
    (val) => {
      setDefaultBranch(val);
    },
    [setDefaultBranch]
  );

  const wrapperSetSelectedFile = useCallback(
    (val) => {
      setSelectedFileData(val);
    },
    [setSelectedFileData]
  );

  const wrapperSetRepoName = useCallback(
    (val) => setRepoName(val),
    [setRepoName]
  );
  const wrapperSetRawFileData = useCallback(
    (val) => setRawFileData(val),
    [setRawFileData]
  );
  const wrapperSetSelectedTermData = useCallback(
    (val) => setSelectedTermData(val),
    [setSelectedTermData]
  );
  const wrapperSetLanguageMode = useCallback(
    (val) => setLanguageMode(val),
    [setLanguageMode]
  );
  const wrapperSetRepoCodeAnalysis = useCallback(
    (val) => setRepoCodeAnalysis(val),
    [setRepoCodeAnalysis]
  );
  const wrapperSetAllNames = useCallback(
    (val) => {
      setAllNames(val);
    },
    [setAllNames]
  );
  return (
    <Box sx={{ backgroundColor: BLACK }}>
      <Typography
        variant='h1'
        gutterBottom
        sx={{
          fontSize: '2rem',
          paddingTop: '1vh',
          paddingLeft: '1vw',
          color: WHITE,
          backgroundColor: BLACK,
          marginBottom: 0,
        }}
      >
        {selectedFileData ? (
          <Link
            sx={{
              '&:hover': { color: LIGHT_PURPLE },
            }}
            href={generateFileUrl(
              repoName,
              defaultBranch,
              selectedFileData.file_path
            )}
            color='inherit'
          >
            {generateHeaderFromDoubleRootPath(
              repoName,
              selectedFileData.file_path
            )}
          </Link>
        ) : repoName ? (
          <Link
            sx={{
              '&:hover': { color: LIGHT_PURPLE },
            }}
            href={generateRepoUrl(repoName)}
            color='inherit'
          >
            {repoName}
          </Link>
        ) : (
          APP_NAME
        )}
      </Typography>
      <Box>
        <Box
          sx={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: 0,
            justifyContent: 'center',
            marginX: 'auto',
          }}
        >
          <Box
            sx={{
              height: 0.7,
              width: 0.7,
              overflow: 'auto',
              backgroundColor: DARK_GREY,
              color: WHITE,
              display: 'flex',
              flexDirection: 'column',
              paddingLeft: '2%',
              paddingRight: '2%',
            }}
          >
            {selectedFileData && languageMode ? (
              <CodeAnalysisComponent
                languageMode={languageMode}
                selectedFileData={selectedFileData}
              />
            ) : selectedFileData && selectedTermData ? (
              <TermSuggestionsComponent
                selectedFileData={selectedFileData}
                selectedTermData={selectedTermData}
              ></TermSuggestionsComponent>
            ) : selectedFileData && !selectedTermData ? (
              <FileDetailComponent
                fileData={selectedFileData}
                handleSetSelectedTermData={wrapperSetSelectedTermData}
              />
            ) : rawFileData && viewCodeAnalysis ? (
              <CodebaseAnalysisComponent
                repoCodeAnalysis={repoCodeAnalysis}
                allNames={allNames}
              />
            ) : rawFileData && !viewCodeAnalysis ? (
              <RepoSummaryComponent
                rawFileData={rawFileData}
                handleSetSelectedFile={wrapperSetSelectedFile}
                handleSetLanguageMode={wrapperSetLanguageMode}
              />
            ) : (
              <LinkToRepoComponent
                handleSetRepoName={wrapperSetRepoName}
                handleSetRawFileData={wrapperSetRawFileData}
                handleSetDefaultBranch={wrapperSetDefaultBranch}
                handleSetRepoCodeAnalysis={wrapperSetRepoCodeAnalysis}
                handleSetAllNames={wrapperSetAllNames}
              />
            )}
          </Box>
          <Box
            sx={{
              alignItems: 'left',
              width: 1,
              paddingLeft: '1vw',
            }}
          >
            <IconButton
              sx={{
                color: WHITE,
                fontSize: 'smaller',
                '&:hover': { color: LIGHT_PURPLE },
              }}
              onClick={handleBackClick}
              disabled={!backButtonActive}
            >
              <ArrowBackIcon fontSize='large' />
              Back
            </IconButton>
            <IconButton
              sx={{
                color: WHITE,
                fontSize: 'smaller',
                '&:hover': { color: LIGHT_PURPLE },
              }}
              onClick={() => {
                exportCSV(repoName, rawFileData, SSPM_DATASET_KEY, SSPM_NAME);
              }}
              disabled={!backButtonActive}
            >
              <FileDownloadIcon fontSize='large' />
              Export sub-string pattern-matched data to CSV
            </IconButton>
            <IconButton
              sx={{
                color: WHITE,
                fontSize: 'smaller',
                '&:hover': { color: LIGHT_PURPLE },
              }}
              onClick={() => {
                exportCSV(repoName, rawFileData, WBPM_DATASET_KEY, WBPM_NAME);
              }}
              disabled={!backButtonActive}
            >
              <FileDownloadIcon fontSize='large' />
              Export word-boundary pattern-matched data to CSV
            </IconButton>
            <IconButton
              sx={{
                color: WHITE,
                fontSize: 'smaller',
                '&:hover': { color: LIGHT_PURPLE },
              }}
              onClick={() => {
                setSelectedFileData(null);
                setLanguageMode(null);
                setSelectedTermData(null);
                setViewCodeAnalysis(true);
              }}
              disabled={!backButtonActive}
            >
              <CodeIcon fontSize='large' />
              Repo-Wide Code Analysis
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
export default AppBackgroundComponent;
