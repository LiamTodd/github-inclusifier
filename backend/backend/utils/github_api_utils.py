from github import Github, InputGitTreeElement
import os
import requests
from zipfile import ZipFile
import io
import uuid
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


def get_github(github_token):
    return Github(github_token)


def push_changes(
    github_token,
    repo_owner,
    repo_name,
    default_branch,
    refactored_files,
    repo_path,
    commit_message,
):
    g = Github(github_token)
    repo = g.get_user(repo_owner).get_repo(repo_name)
    branch_name = f"inclusiviser-{uuid.uuid1()}"
    repo.create_git_ref(
        f"refs/heads/{branch_name}", repo.get_branch(default_branch).commit.sha
    )
    tree_elements = []
    for file in refactored_files:
        with open(os.path.join(repo_path, file), "r") as f:
            content = f.read()
        # extract relative path within repo dir
        split_file = file.split(f"{repo_name}-{default_branch}")
        repo_relative_path = split_file[-1].replace("\\", "/")[1:]
        blob = repo.create_git_blob(content=content, encoding="utf-8")
        tree_elements.append(
            InputGitTreeElement(
                path=repo_relative_path, mode="100644", type="blob", sha=blob.sha
            )
        )

    tree = repo.create_git_tree(
        tree=tree_elements, base_tree=repo.get_git_tree(sha=branch_name)
    )

    commit = repo.create_git_commit(
        message=commit_message,
        tree=repo.get_git_tree(sha=tree.sha),
        parents=[repo.get_git_commit(repo.get_branch(branch_name).commit.sha)],
    )

    branch_ref = repo.get_git_ref(ref=f"heads/{branch_name}")

    branch_ref.edit(sha=commit.sha)

    return branch_name


def download_github_repo(repo_owner, repo_name, github_token, location):
    # Initialize the PyGithub client
    g = get_github(github_token)

    # Get the repository by URL
    repository = g.get_repo(f"{repo_owner}/{repo_name}")

    # Download the repository as a zip file
    zip_url = generate_zip_url(repository.full_name)
    response = requests.get(zip_url)

    # Raise an exception if the repository is not found
    response.raise_for_status()

    # Extract the contents of the zip file to a desired location in your Django project
    # Replace 'your_desired_location' with the path where you want to save the repository
    clone_location = os.path.join(location, repository.name)
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
