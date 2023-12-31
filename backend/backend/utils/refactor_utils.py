import ast_comments as ast
import os
from io import StringIO
from contextlib import redirect_stderr
import pyflakes.api as flakes
from pyflakes.reporter import Reporter
import autopep8

from backend.utils.misc_utils import get_code_files
from backend.constants import SUPPORTED_LANGUAGES_REFACTORING


class StreamToListAdapter:
    def __init__(self):
        self.stream = []

    def write(self, new_item):
        if new_item != "\n":
            self.stream.append(new_item)


def find_refactor_errors(code_str, file_path):
    warnings = StreamToListAdapter()
    errors = StreamToListAdapter()
    with redirect_stderr(StringIO()):
        reporter = Reporter(warnings, errors)
        flakes.check(codeString=code_str, filename=file_path, reporter=reporter)
    undefined_names = []
    for warning in warnings.stream:
        if "undefined name" in warning:
            name = warning.split("'")[-2]
            undefined_names.append(name)
    return undefined_names


def refactor_functions(root_path, refactors):
    demodified_files = []
    for refactor in refactors:
        if refactor is not None:
            old_function_name = refactor["oldName"]
            new_function_name = refactor["newName"]
            renamed_functions = {old_function_name: new_function_name}
            original_content = {}

            def update_function_calls(node):
                if isinstance(node, ast.Attribute) and node.attr == old_function_name:
                    node.attr = new_function_name
                if isinstance(node, ast.Call):
                    if (
                        isinstance(node.func, ast.Name)
                        and node.func.id in renamed_functions
                    ):
                        node.func.id = renamed_functions[node.func.id]
                for child_node in ast.iter_child_nodes(node):
                    update_function_calls(child_node)

            for root, _, files in os.walk(root_path):
                for file in files:
                    if file.endswith(".py"):
                        file_path = os.path.join(root, file)

                        with open(file_path, "r") as f:
                            content = f.read()

                        original_content[file_path] = content
                        tree = ast.parse(content)

                        # first pass: modify function defs and calls

                        class RenameFunctions(ast.NodeTransformer):
                            def visit_FunctionDef(seld, node):
                                if node.name == old_function_name:
                                    node.name = new_function_name
                                return node

                        transformer = RenameFunctions()
                        new_tree = transformer.visit(tree)

                        update_function_calls(new_tree)

                        modified_code = ast.unparse(new_tree)

                        with open(file_path, "w") as f:
                            f.write(modified_code)

                        # second pass: modify imports

                        with open(file_path, "r") as f:
                            content = f.read()

                        modified_content = content.replace(
                            f"import {old_function_name}", f"import {new_function_name}"
                        )

                        if content != modified_content:
                            with open(file_path, "w") as f:
                                f.write(modified_content)

                        # third pass: check with linter
                        with open(file_path, "r") as f:
                            content = f.read()
                        if len(find_refactor_errors(content, file_path)) > 0:
                            with open(file_path, "w") as f:
                                f.write(original_content[file_path])
                                demodified_files.append(file_path)
    return demodified_files


def refactor_variables(root_path, refactors):
    demodified_files = []
    for refactor in refactors:
        if refactor is not None:
            old_variable_name = refactor["oldName"]
            new_variable_name = refactor["newName"]
            original_content = {}

            def update_function_parameters(node):
                if isinstance(node, ast.FunctionDef):
                    for param in node.args.args:
                        if param.arg == old_variable_name:
                            param.arg = new_variable_name
                for child_node in ast.iter_child_nodes(node):
                    update_function_parameters(child_node)

            for root, _, files in os.walk(root_path):
                for file in files:
                    if file.endswith(".py"):
                        file_path = os.path.join(root, file)

                        with open(file_path, "r") as f:
                            content = f.read()
                        original_content[file_path] = content

                        tree = ast.parse(content)

                        class RenameVariables(ast.NodeTransformer):
                            def visit_Assign(self, node):
                                for target in node.targets:
                                    if (
                                        isinstance(target, ast.Name)
                                        and target.id == old_variable_name
                                    ):
                                        target.id = new_variable_name
                                return node

                            def visit_FunctionDef(self, node):
                                if node.name != old_variable_name:
                                    self.generic_visit(node)
                                return node

                            def visit_ClassDef(self, node):
                                if node.name != old_variable_name:
                                    self.generic_visit(node)
                                return node

                            def visit_Name(self, node):
                                if node.id == old_variable_name:
                                    col_offset = node.col_offset
                                    line_number = node.lineno
                                    index = (
                                        sum(
                                            len(line) + 1
                                            for i, line in enumerate(
                                                content.splitlines()
                                            )
                                            if i < line_number - 1
                                        )
                                        + col_offset
                                    )
                                    if len(content) > index + len(node.id):
                                        if content[index + len(node.id)] != "(":
                                            node.id = new_variable_name
                                    else:
                                        node.id = new_variable_name
                                return node

                        transformer = RenameVariables()
                        new_tree = transformer.visit(tree)

                        update_function_parameters(new_tree)

                        modified_code = ast.unparse(new_tree)

                        with open(file_path, "w") as f:
                            f.write(modified_code)

                        content = modified_code
                        modified_content = content.replace(
                            f"import {old_variable_name}", f"import {new_variable_name}"
                        )

                        if content != modified_content:
                            with open(file_path, "w") as f:
                                f.write(modified_content)

                        with open(file_path, "r") as f:
                            content = f.read()
                        if len(find_refactor_errors(content, file_path)) > 0:
                            with open(file_path, "w") as f:
                                f.write(original_content[file_path])
                                demodified_files.append(file_path)
    return demodified_files


def refactor_classes(root_path, refactors):
    demodified_files = []
    for refactor in refactors:
        if refactor is not None:
            old_class_name = refactor["oldName"]
            new_class_name = refactor["newName"]
            original_content = {}
            for root, _, files in os.walk(root_path):
                for file in files:
                    if file.endswith(".py"):
                        file_path = os.path.join(root, file)

                        with open(file_path, "r") as f:
                            content = f.read()
                            original_content[file_path] = content

                        tree = ast.parse(content)

                        class RenameClasses(ast.NodeTransformer):
                            def visitFunctionDef(self, node):
                                if node.name != old_class_name:
                                    self.generic_visit(node)
                                return node

                            def visit_ClassDef(self, node):
                                if node.name == old_class_name:
                                    node.name = new_class_name
                                return node

                            def visit_Name(self, node):
                                if node.id == old_class_name:
                                    node.id = new_class_name
                                return node

                        transformer = RenameClasses()
                        new_tree = transformer.visit(tree)

                        modified_code = ast.unparse(new_tree)

                        with open(file_path, "w") as f:
                            f.write(modified_code)

                        content = modified_code
                        modified_content = content.replace(
                            f"import {old_class_name}", f"import {new_class_name}"
                        )

                        if content != modified_content:
                            with open(file_path, "w") as f:
                                f.write(modified_content)

                        with open(file_path, "r") as f:
                            content = f.read()
                        if len(find_refactor_errors(content, file_path)) > 0:
                            with open(file_path, "w"):
                                f.write(original_content[file_path])
                                demodified_files.append(file_path)
    return demodified_files


def format_files(root_path):
    for root, _, files in os.walk(root_path):
        for file in files:
            if file.endswith(".py"):
                file_path = os.path.join(root, file)
                with open(file_path, "r") as f:
                    content = f.read()

                formatted_code = autopep8.fix_code(content)

                with open(file_path, "w") as f:
                    f.write(formatted_code)


def do_codebase_refactors(refactors, root_path, language):
    demodified_files = []
    # currently hardcoded to python
    demodified_files += refactor_functions(root_path, refactors["functions"])
    demodified_files += refactor_variables(root_path, refactors["variables"])
    demodified_files += refactor_classes(root_path, refactors["classes"])

    format_files(root_path)
    return get_code_files(root_path, SUPPORTED_LANGUAGES_REFACTORING[language]), set(
        demodified_files
    )
