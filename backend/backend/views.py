import shutil
from rest_framework.decorators import api_view
from rest_framework.response import Response
import os
from backend.utils.reconstruct_file_structure_utils import reconstruct_file_structure
from backend.utils.language_analysis_utils import (
    sub_string_pattern_match,
    word_boundary_pattern_match,
)
from backend.utils.text_extraction_utils import get_repo_file_data
from backend.constants import TEMP_REPO_STORAGE_LOCATION

from backend.utils.github_api_utils import download_github_repo


@api_view(["GET"])
def get_inclusive_language_report(request):
    # download repo
    # todo: read github details from request
    repo_owner = "LiamTodd"
    repo_name = "human-centric-issue-visualiser"
    github_token = ""

    repo_path = f"{TEMP_REPO_STORAGE_LOCATION}/{repo_name}"

    if not os.path.exists(repo_path):
        download_github_repo(
            repo_name=repo_name, repo_owner=repo_owner, github_token=github_token
        )

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
