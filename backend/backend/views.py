import shutil

from github import GithubException
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import os
from backend.constants import (
    REPO_OWNER_PARAM,
    REPO_NAME_PARAM,
    ACCESS_TOKEN_PARAM,
)
from backend.utils.reconstruct_file_structure_utils import reconstruct_file_structure
from backend.utils.language_analysis_utils import (
    sub_string_pattern_match,
    word_boundary_pattern_match,
)
from backend.utils.text_extraction_utils import get_repo_file_data
from backend.constants import TEMP_REPO_STORAGE_LOCATION

from backend.utils.github_api_utils import download_github_repo


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
        if not os.path.exists(repo_path):
            download_github_repo(
                repo_name=repo_name, repo_owner=repo_owner, github_token=github_token
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

    # perform inclusive language analysis on text
    sub_string_pattern_match(file_data)
    word_boundary_pattern_match(file_data)

    # reconstruct file structure
    result = reconstruct_file_structure(file_data, repo_name)

    # delete repo
    shutil.rmtree(repo_path)

    return Response(
        {
            "message": f"Successful inclusive language analysis conducted on {repo_owner}/{repo_name}",
            "repo": f"{repo_owner}/{repo_name}",
            "data": result,
        }
    )
