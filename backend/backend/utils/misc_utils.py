import os


def parse_boolean_string(boolean_string):
    cleaned_boolean_string = boolean_string.lower()
    if cleaned_boolean_string == "true":
        return True
    if cleaned_boolean_string == "false":
        return False
    raise TypeError


def get_code_files(root_path, file_extension):
    code_files = []
    get_code_files_aux(root_path, code_files, file_extension)
    return [code_file for code_file in code_files if code_file is not None]


def get_code_files_aux(root_path, code_files, file_extension):
    if os.path.isdir(root_path):
        for file_path in os.listdir(root_path):
            code_files.append(
                get_code_files_aux(
                    os.path.join(root_path, file_path), code_files, file_extension
                )
            )
    elif root_path.endswith(file_extension):
        return root_path
