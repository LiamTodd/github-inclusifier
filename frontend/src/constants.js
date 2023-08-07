export const LOCAL_HOST_BACKEND_API_BASE_URL = 'http://localhost:8000/';
export const LOCAL_HOST_INCLUSIVE_LANGUAGE_REPORT_URL = `${LOCAL_HOST_BACKEND_API_BASE_URL}get_inclusive_language_report/`;

export const APP_NAME = 'Inclusiviser v1';

export const DARKEST_PURPLE = '#1F1B24';
export const DARK_GREY = '#121212';
export const ERROR = '#CF6679';
export const WHITE = '#FFFFFF';
export const BLACK = '#000000';
export const LIGHT_PURPLE = '#BB86FC';
export const DARK_PURPLE = '#3700B3';
export const TURQOISE = '#03DAC6';

export const REPO_NAME_KEY = 'repo-name';
export const RAW_FILE_DATA_KEY = 'raw-file-date';
export const SELECTED_FILE_DATA_KEY = 'selected-file';
export const DEFAULT_BRANCH_KEY = 'default-branch';

export const DETAIL_TABLE_COLUMNS = [
  { field: 'term', headerName: 'Non-inclusive Term' },
  { field: 'category', headerName: 'Category' },
  {
    field: 'SSPMoccurrences',
    headerName: 'Occurrences (sub-string pattern matching)',
    type: 'number',
  },
  {
    field: 'WBPMoccurrences',
    headerName: 'Occurrences (word-boundary pattern matching)',
    type: 'number',
  },
];

export const NON_INCLUSIVE_LANGUAGE_TERMS = {
  'ABLEIST LANGUAGE': [
    'crazy',
    'sane',
    'insane',
    'blind',
    'cripple',
    'dumb',
    'sanity-check',
    'sanity check',
    'dummy',
    'bonkers',
    'mad',
    'lunatic',
    'loony',
    'deficient',
    'deformed',
    'dumb',
    'gimp',
    'retarded',
    'unsighted',
    'visually challenged',
  ],
  'GENDERED LANGUAGE': [
    'man-hours',
    'man hours',
    'manhours',
    'manking',
    'male adapter',
    'female adapter',
    'guys',
    'manned',
    'man made',
    'manmade',
    'manpower',
    'man power',
    'man-power',
    'mom test',
    'grandmother test',
    'girlfriend test',
    'chairman',
    'mans',
    'salesman',
    'daughter board',
    'female connector',
    'male connector',
    'gender bender',
  ],
  'VIOLENT LANGUAGE': [
    'stonith',
    'hang',
    'hung',
    'hit',
    'abort',
    'blast radius',
    'kill',
    'nuke',
    'terminate',
  ],
  'AGEIST LANGUAGE': ['the elderly', 'the aged', 'seniors', 'senior citizen'],
  'RACIALLY CHARGED LANGUAGE': [
    'whitelist',
    'white list',
    'white-list',
    'blacklist',
    'black list',
    'black-list',
    'native',
    'first-class citizen',
    'first class citizen',
    'master',
    'slave',
    'blackbox',
    'black box',
    'black-box',
    'whitebox',
    'white box',
    'white-box',
    'blackhole',
    'blackhat',
    'black hat',
    'black-hat',
    'whitehat',
    'white hat',
    'white-hat',
    'first-class',
    'first class',
    'ghetto',
    'gypsy',
    'primitive',
    'tribal knowledge',
    'tribal wisdom',
    'webmaster',
    'web master',
    'web-master',
    'whiteglove',
    'white glove',
    'white-glove',
    'whitelabel',
    'white label',
    'white-label',
    'quantum supremacy',
  ],
  'BIASED LANGUAGE': [
    'normal',
    'healthy',
    'health check',
    'abnormal',
    'sick',
    'disabled',
    'quadriplegic',
    'victim of',
    'suffering from',
    'wheelchair-bound',
    'physically challenged',
    'special',
    'differently abled',
    'handi-capable',
    'handicapped',
    'average user',
  ],
  'MILITARY LANGUAGE': [
    'demilitarized zone',
    'outpost',
    'war room',
    'warroom',
    'war-room',
  ],
  OTHER: [
    'chubby',
    'denigrate',
    'fat',
    'hands on',
    'hands-on',
    'hands off',
    'hands-off',
    'jank',
    'lame',
    'monkey test',
    'ninja',
    'sexy',
    'orphaned object',
  ],
};
let csvHeaders = 'file name,file path,';
for (const category in NON_INCLUSIVE_LANGUAGE_TERMS) {
  for (const term of NON_INCLUSIVE_LANGUAGE_TERMS[category]) {
    csvHeaders += `${term} (occurrences),`;
  }
}
export const CSV_HEADERS = csvHeaders + '\n';

export const WBPM_DATASET_KEY = 'wbpmMatches';
export const SSPM_DATASET_KEY = 'sspmMatches';
export const WBPM_NAME = 'Word-Boundary Pattern Matching';
export const SSPM_NAME = 'Sub-String Pattern Matching';
