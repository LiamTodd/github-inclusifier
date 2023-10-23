from github import Github, InputGitTreeElement
import os
import requests
from zipfile import ZipFile
import io
from backend.utils.language_analysis_utils import generate_language_report

from backend.constants import (
    GITHUB_URL_BITS,
    INCLUSIFIER_COMMENT_WATERMARK,
    ISSUE_BODY,
    ISSUE_TITLE,
    INCLUSIFIER_PR_WATERMARK,
)


def generate_zip_url(repo_full_name):
    return f"{GITHUB_URL_BITS.get('base')}{repo_full_name}{GITHUB_URL_BITS.get('zip_file_tail')}"


def get_github(github_token):
    return Github(github_token)


def generate_repo_path_from_local_path(file_path, repo_name):
    file_path = file_path.replace("\\", "/")
    parts = file_path.split("/")
    index = parts.index(repo_name)
    return f"{parts[index]}/{'/'.join(parts[index+2:])}"


def generate_pr_body(demodified_files, refactors, repo_name):
    body = "# Summary of changes:\n"
    for type in refactors.keys():
        body += f"## Updated {type}:\n"
        change_count = 0
        for change in refactors[type]:
            if change is not None:
                change_count += 1
                body += f"'{change['oldName']}' renamed to '{change['newName']}'\n"
        if change_count == 0:
            body += f"No changes applied to {type}.\n"

    if len(demodified_files) > 0:
        body += "# Caution:\n"
        body += "We weren't sure if we should refactor the following files, most likely due to naming overlaps and imports, and recommend that they be checked:\n"
        for file_path in demodified_files:
            body += f"- {generate_repo_path_from_local_path(file_path, repo_name)}\n"

    body += INCLUSIFIER_PR_WATERMARK

    return body


def make_pull_request(
    github_token,
    repo_owner,
    repo_name,
    default_branch,
    refactored_files,
    repo_path,
    commit_message,
    uuid,
    demodified_files,
    refactors,
):
    g = Github(github_token)
    repo = g.get_user(repo_owner).get_repo(repo_name)
    branch_name = f"inclusifier-{uuid}"
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

    pull_request = repo.create_pull(
        title=f"Refactor via Inclusifier",
        body=generate_pr_body(demodified_files, refactors, repo_name),
        base=default_branch,
        head=branch_name,
    )

    return branch_name, commit.sha, pull_request.number


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
        for file in zip_file.namelist():
            try:
                zip_file.extract(file, path=clone_location)
            except:
                print(f"Unable to extract file {file}")

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
        body += INCLUSIFIER_COMMENT_WATERMARK
        issue.create_comment(body)
