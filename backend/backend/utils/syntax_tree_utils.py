import ast_comments as ast
import javalang
from comment_parser import comment_parser
from backend.constants import FAILED_FILE_READ_WARNING, SUPPORTED_LANGUAGES
from backend.utils.language_analysis_utils import (
    single_term_classification,
    code_comment_wbpm,
)


def generic_return(functions, variables, comments):
    return {"functions": functions, "variables": variables, "comments": comments}


def python_processor(code, keep_duplicates=False, analyse_comments=True):
    try:
        tree = ast.parse(code)
    except:
        raise Exception(f"Unable to parse code.")

    functions = []
    variables = []
    comments = []

    for node in ast.walk(tree):
        if isinstance(node, ast.FunctionDef):
            if (
                keep_duplicates is False
                and node.name not in [function["term"] for function in functions]
            ) or keep_duplicates is True:
                functions.append(single_term_classification(node.name))
        elif isinstance(node, ast.Name):
            if (
                keep_duplicates is False
                and node.id not in [variable["term"] for variable in variables]
            ) or keep_duplicates is True:
                variables.append(single_term_classification(node.id))
        elif isinstance(node, ast.Comment) and analyse_comments is True:
            comments.append(code_comment_wbpm(node.value))

    return generic_return(functions, variables, comments)


def java_processor(code, keep_duplicates=False, analyse_comments=True):
    functions = []
    variables = []
    comments = []
    try:
        if analyse_comments is True:
            comments = [
                code_comment_wbpm(comment.text())
                for comment in comment_parser.extract_comments_from_str(
                    code, mime="text/x-java-source"
                )
            ]
        tree = javalang.parse.parse(code)
    except:
        raise Exception(f"Unable to parse code.")

    for _, node in tree:
        if isinstance(node, javalang.tree.MethodDeclaration):
            if (
                keep_duplicates is False
                and node.name not in [function["term"] for function in functions]
            ) or keep_duplicates is True:
                functions.append(single_term_classification(node.name))
        elif isinstance(node, javalang.tree.VariableDeclarator):
            if (
                keep_duplicates is False
                and node.name not in [variable["term"] for variable in variables]
            ) or keep_duplicates is True:
                variables.append(single_term_classification(node.name))

    return generic_return(functions, variables, comments)


LANGUAGE_PROCESSORS = {
    "python": python_processor,
    "java": java_processor,
}


def perform_codebase_analysis(file_data):
    # initialise an output structure
    # for each supported language
    #   initialise a structure for the language
    #   traverse file tree, attend to relevant files
    #       use the relevant language processor on the file
    #       collate the language processor outputs with the maintained structure
    #   add the language's structure to the output structure
    output = {}
    for language, extension in SUPPORTED_LANGUAGES.items():
        language_analysis = {"variables": {}, "functions": {}}
        for file in file_data.values():
            if (
                file.get("content") is not None
                and file.get("content") != FAILED_FILE_READ_WARNING
                and file.get("file_name").endswith(extension)
            ):
                try:
                    file_analysis = LANGUAGE_PROCESSORS[language](
                        file.get("content"),
                        keep_duplicates=True,
                        analyse_comments=False,
                    )
                except:
                    print(f"Unable to parse {file.get('file_name')}")
                    continue
                for variable in file_analysis["variables"]:
                    if variable["non_inclusive"]:
                        term_data = language_analysis["variables"].get(
                            variable["term"], None
                        )
                        # first instance of term
                        if term_data is None:
                            language_analysis["variables"][variable["term"]] = {
                                "files": [file.get("file_path")],
                                "occurrences": 1,
                            }
                        # term has been found before
                        else:
                            # term has not been found in this file before
                            if file.get("file_path") not in term_data["files"]:
                                term_data["files"].append(file.get("file_path"))
                            term_data["occurrences"] += 1
                for function in file_analysis["functions"]:
                    if function["non_inclusive"]:
                        term_data = language_analysis["functions"].get(
                            function["term"], None
                        )
                        # first instance of term
                        if term_data is None:
                            language_analysis["functions"][function["term"]] = {
                                "files": [file.get("file_path")],
                                "occurrences": 1,
                            }
                        # term has been found before
                        else:
                            # term has not been found in this file before
                            if file.get("file_path") not in term_data["files"]:
                                term_data["files"].append(file.get("file_path"))
                            term_data["occurrences"] += 1
            output[language] = language_analysis

    return output
