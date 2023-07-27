import os

from backend.constants import (
    TEMP_REPO_STORAGE_LOCATION,
    DEFAULT_UNREADABLE_FILE_TYPES,
    FAILED_FILE_READ_WARNING,
)


def get_repo_file_data(repo_name):
    root_path = repo_name
    file_data = {}
    parent = None
    extract_file_contents(root_path, file_data, parent)
    return file_data


def extract_file_contents(file_path, file_data, parent):
    full_file_path = os.path.join(TEMP_REPO_STORAGE_LOCATION, file_path)
    # store shortened file name for display (exclude path)
    file_name = (
        file_path.replace(f"{parent}/", "", 1) if parent is not None else file_path
    )
    # recursive case: file is a directory
    if os.path.isdir(full_file_path):
        file_data[file_path] = {
            "file_path": file_path,
            "file_name": file_name,
            "parent": parent,
            "content": None,
            "is_dir": True,
        }

        child_files = os.listdir(full_file_path)
        for child in child_files:
            child_path = f"{file_path}/{child}"
            extract_file_contents(child_path, file_data, file_path)

    # base case: file is not a directory - extract and store its contents
    else:
        try:
            read_file = True
            # stop blacklisted file types from being read
            for file_extension in DEFAULT_UNREADABLE_FILE_TYPES:
                if file_path.endswith(file_extension):
                    content = FAILED_FILE_READ_WARNING
                    read_file = False
                    break
            if read_file:
                with open(full_file_path) as f:
                    content = f.read()
        except UnicodeDecodeError:
            content = FAILED_FILE_READ_WARNING
            print(f"DEVELOPER WARNING: Unreadable file not blacklisted: {file_path}")

        file_data[file_path] = {
            "file_path": file_path,
            "file_name": file_name,
            "parent": parent,
            "content": content,
            "is_dir": False,
        }
