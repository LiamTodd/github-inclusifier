import ast
from rope.base.project import Project
from rope.refactor.rename import Rename
from rope.base.libutils import path_to_resource


def refactor_codebase(changes, root_path):
    project = Project(root_path, ropefolder=None)
    # get python files from codebase
    # for each file
    #   resource = path_to_resource(project, file_name)
    #   for each change
    #       refactor_file(file_name, change["old"], change["new"], project, resource)


def refactor_file(file_name, old_name, new_name, project, resource):
    node_found = True
    while node_found:
        file_contents = ""
        with open(file_name) as file:
            file_contents = file.read()
        try:
            tree = ast.parse(file_contents)
        except:
            raise Exception(f"Unable to parse code for {file_name}.")
        node_found = False
        for node in ast.walk(tree):
            if (
                (isinstance(node, ast.Name) and node.id == old_name)
                or (isinstance(node, ast.FunctionDef) and node.name == old_name)
                or (isinstance(node, ast.ClassDef) and node.name == old_name)
            ):
                node_found = True
                col_offset = node.col_offset
                line_number = node.lineno
                index = (
                    sum(
                        len(line) + 1
                        for i, line in enumerate(file_contents.splitlines())
                        if i < line_number - 1
                    )
                    + col_offset
                )
                if isinstance(node, ast.FunctionDef):
                    index += len("def ")  # account for 'def '
                if isinstance(node, ast.ClassDef):
                    index += len("class ")
                rename_refactor = Rename(
                    project=project, resource=resource, offset=index
                ).get_changes(new_name, docs=True)
                rename_refactor.do()
                # only change on occurrence at a time
                break
