import shutil
import json
import os
import uuid

from github import GithubException
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from backend.utils.llm_utils import LLM_ENGINE_FUNCTIONS
from backend.utils.misc_utils import parse_boolean_string
from backend.constants import (
    REPO_OWNER_PARAM,
    REPO_NAME_PARAM,
    ACCESS_TOKEN_PARAM,
    GENERATE_GITHUB_ISSUE_PARAM,
    LLM_ENGINE_PARAM,
    ORIGINAL_TEXT_PARAM,
    TERM_PARAM,
    LANGUAGE_PARAM,
    CODE_STRING_PARAM,
    TEMP_REPO_STORAGE_LOCATION,
    REFACTORED_REPO_STORAGE_LOCATION,
    SUPPORTED_LANGUAGES_REFACTORING,
    REFACTORS_PARAM,
    COMMIT_MESSAGE_PARAM,
    UUID_PARAM,
)
from backend.utils.reconstruct_file_structure_utils import reconstruct_file_structure
from backend.utils.language_analysis_utils import (
    sub_string_pattern_match,
    word_boundary_pattern_match,
)
from backend.utils.text_extraction_utils import get_repo_file_data
from backend.utils.syntax_tree_utils import (
    LANGUAGE_PROCESSORS,
    perform_codebase_analysis,
)

from backend.utils.github_api_utils import (
    download_github_repo,
    post_language_report_to_github,
    push_changes,
)
from backend.utils.refactor_utils import do_codebase_refactors


@api_view(["POST"])
def get_inclusive_language_report(request):
    # download specified repo
    repo_owner = request.query_params.get(REPO_OWNER_PARAM, None)
    repo_name = request.query_params.get(REPO_NAME_PARAM, None)
    github_token = request.query_params.get(ACCESS_TOKEN_PARAM, None)

    if any([param is None for param in (repo_owner, repo_name, github_token)]):
        error_response = {"error": "Insufficient credentials."}
        return Response(error_response, status=status.HTTP_400_BAD_REQUEST)

    repo_path = f"{TEMP_REPO_STORAGE_LOCATION}/{repo_name}"
    try:
        default_branch = download_github_repo(
            repo_name=repo_name,
            repo_owner=repo_owner,
            github_token=github_token,
            location=TEMP_REPO_STORAGE_LOCATION,
        )
    except GithubException as e:
        if e.status == 401:
            error_message = "Authentication failed. Please check that you entered the correct credentials."
        elif e.status == 403:
            error_message = "Forbidden. You may have reached the rate limit."
        else:
            error_message = "Something went wrong"

        error_response = {"error": error_message}

        return Response(error_response, status=e.status)

    # extract text
    file_data = get_repo_file_data(repo_name)

    # perform codebase analysis
    code_analysis = perform_codebase_analysis(file_data)

    # perform inclusive language analysis on text
    sub_string_pattern_match(file_data)
    word_boundary_pattern_match(file_data)

    # reconstruct file structure
    result = reconstruct_file_structure(file_data, repo_name)

    # generate issue response
    generate_github_issue = parse_boolean_string(
        request.query_params.get(GENERATE_GITHUB_ISSUE_PARAM, False)
    )
    if generate_github_issue:
        post_language_report_to_github(github_token, repo_owner, repo_name, file_data)

    # delete repo
    shutil.rmtree(repo_path)

    return Response(
        {
            "message": f"Successful inclusive language analysis conducted on {repo_owner}/{repo_name}",
            "repo": f"{repo_owner}/{repo_name}",
            "general_report": result,
            "default_branch": default_branch,
            "codebase_analysis": code_analysis,
        }
    )


@api_view(["POST"])
def get_suggestion(request):
    llm_engine = request.query_params.get(LLM_ENGINE_PARAM, None)
    original_text = request.query_params.get(ORIGINAL_TEXT_PARAM, None)
    term = request.query_params.get(TERM_PARAM, None)
    # todo: error handling

    llm_engine_function = LLM_ENGINE_FUNCTIONS.get(llm_engine, None)
    if llm_engine_function is None:
        error_response = {"error": "LLM is currently unavailable."}
        return Response(error_response, status.HTTP_400_BAD_REQUEST)
    result = llm_engine_function(original_text, term)

    return Response(
        {
            "message": f"Successfully generated suggestion using {llm_engine} engine.",
            "data": result,
        }
    )


@api_view(["POST"])
def get_code_analysis(request):
    language = request.query_params.get(LANGUAGE_PARAM, None)
    code_string = request.query_params.get(CODE_STRING_PARAM, None)
    language_processor = LANGUAGE_PROCESSORS.get(language, None)
    if language_processor is None:
        return Response(
            {"error": "Language not currently supported."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    try:
        result = language_processor(code_string)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    return Response(
        {"message": "Successfully performed code analysis.", "data": result}
    )


@api_view(["POST"])
def refactor_codebase(request):
    language = request.query_params.get(LANGUAGE_PARAM, None)
    if language not in SUPPORTED_LANGUAGES_REFACTORING.keys():
        return Response(
            {"error": f"Refactoring not currently supported for {language}"},
            status=status.HTTP_400_BAD_REQUEST,
        )
    # download specified repo
    repo_owner = request.query_params.get(REPO_OWNER_PARAM, None)
    repo_name = request.query_params.get(REPO_NAME_PARAM, None)
    github_token = request.query_params.get(ACCESS_TOKEN_PARAM, None)
    refactors = json.loads(request.query_params.get(REFACTORS_PARAM, None))
    commit_message = request.query_params.get(COMMIT_MESSAGE_PARAM, None)
    uuid = request.query_params.get(UUID_PARAM, None)

    if any([param is None for param in (repo_owner, repo_name, github_token)]):
        error_response = {"error": "Insufficient credentials."}
        return Response(error_response, status=status.HTTP_400_BAD_REQUEST)

    repo_path = f"{REFACTORED_REPO_STORAGE_LOCATION}/{repo_name}"
    try:
        default_branch = download_github_repo(
            repo_name=repo_name,
            repo_owner=repo_owner,
            github_token=github_token,
            location=REFACTORED_REPO_STORAGE_LOCATION,
        )
    except GithubException as e:
        if e.status == 401:
            error_message = "Authentication failed. Please check that you entered the correct credentials."
        elif e.status == 403:
            error_message = "Forbidden. You may have reached the rate limit."
        else:
            error_message = "Something went wrong"

        error_response = {"error": error_message}

        return Response(error_response, status=e.status)

    # refactor code
    refactored_files = do_codebase_refactors(refactors, repo_path, language)

    # push to repo
    new_branch_name, commit_sha = push_changes(
        github_token,
        repo_owner,
        repo_name,
        default_branch,
        refactored_files,
        repo_path,
        commit_message,
        uuid,
    )

    # delete repo
    shutil.rmtree(repo_path)

    return Response(
        {
            "message": f"Successfully refactored code and committed to branch {new_branch_name}",
            "branch_url": f"https://github.com/{repo_owner}/{repo_name}/commit/{commit_sha}",
        }
    )
