from github import Github
import os
import requests
from zipfile import ZipFile
import io
from backend.utils.language_analysis_utils import generate_language_report

from backend.constants import (
    GITHUB_URL_BITS,
    TEMP_REPO_STORAGE_LOCATION,
    INCLUSIVISER_COMMENT_WATERMARK,
    ISSUE_BODY,
    ISSUE_TITLE,
)


def generate_zip_url(repo_full_name):
    return f"{GITHUB_URL_BITS.get('base')}{repo_full_name}{GITHUB_URL_BITS.get('zip_file_tail')}"


def download_github_repo(repo_owner, repo_name, github_token):
    # Initialize the PyGithub client
    if github_token:
        g = Github(github_token)

    # Get the repository by URL
    repository = g.get_repo(f"{repo_owner}/{repo_name}")

    # Download the repository as a zip file
    zip_url = generate_zip_url(repository.full_name)
    response = requests.get(zip_url)

    # Raise an exception if the repository is not found
    response.raise_for_status()

    # Extract the contents of the zip file to a desired location in your Django project
    # Replace 'your_desired_location' with the path where you want to save the repository
    clone_location = os.path.join(TEMP_REPO_STORAGE_LOCATION, repository.name)
    with ZipFile(io.BytesIO(response.content)) as zip_file:
        zip_file.extractall(clone_location)

    return repository.default_branch


def post_language_report_to_github(github_token, repo_owner, repo_name, file_data):
    g = Github(github_token)
    repository = g.get_repo(f"{repo_owner}/{repo_name}")
    # retrieve language report
    language_report = generate_language_report(file_data)
    issue = repository.create_issue(
        title=ISSUE_TITLE,
        body=ISSUE_BODY,
    )
    for category in language_report.keys():
        no_uses = True
        body = f"# Usage of {category.lower()}:\n"
        for term, usages in language_report[category].items():
            if len(usages) > 0:
                no_uses = False
                body += f"## Usage of the term **'{term}'**:\n"
                for usage in usages:
                    body += f"- {usage['algorithm']} algorithm found {usage['count']} occurrence(s) in {usage['file']}\n"
        if no_uses:
            body += f"No {category.lower()} detected."
        body += INCLUSIVISER_COMMENT_WATERMARK
        issue.create_comment(body)
