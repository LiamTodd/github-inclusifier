# GitHubInclusifier

This repository contains the source code and evaluation data for GitHubInclusifier, which is a web application designed to encourage the use of inclusive language in GitHub Repositories, and similarly to discourage the use of non-inclusive language. GitHubInclusifier's target users are software developers working collaboratively on software projects. It provides them with features for both recognising, and rectifying usages of non-inclusive language within these projects.

The key features of GitHubInclusifier which enable the recognition
of non-inclusive language usage within software projects include:
- Repository-wide search for non-inclusive language terms
using both word-boundary, and substring pattern matching
algorithms
- Automated reporting of non-inclusive language usage as a
GitHub issue;
- Repository explorer with non-inclusive language usages
visibly indicated;
- Non-inclusive language report on a per-file basis;
- Code-specific non-inclusive language report for Python
and Java source code files on a per-file basis, as well as a
repository-wide basis;
- Export of non-inclusive language reports for findings by
both word-boundary, and substring pattern matching algo-
rithms, on a repository-wide basis.

The key features of GitHubInclusifier which permit software
developers to rectify the usage of non-inclusive language are:
- Non-inclusive to inclusive language suggestion by user’s
choice of LLM;
- Code refactoring feature allowing variable, function, and
class renaming for Python source code on a repository-wide
basis;
- Automated commit and pull request creation following
refactoring.

Watch our demo video to learn more: https://youtu.be/1z1QKdQg-nM?si=1cCPpEPjUTn2LAQw

# Contents
## GitHubInclusifier source code
### Front end
The front end is implemented with ReactJS, and can be started by running `npm start`.
### Back end
The back end is implemented with Django, and can be started by activating the virtual environment with `.\venv\Scipts\activate`, followed by `python ./backend/manage.py runserver`.
## Evaluation Data
The `evaluation_data` folder contains `Raw Exports` which are a number of csv files exported directly from GitHubInclusifier, after it was linked to a number of popular open source GitHub repositories. `Processed Exports` contains csv files which are processed versions of the raw exports, simply existing for our ease of use, to evaluate GitHubInclusifier.
