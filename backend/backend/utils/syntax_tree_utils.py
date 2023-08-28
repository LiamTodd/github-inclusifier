import ast_comments as ast
import javalang
from comment_parser import comment_parser
from backend.utils.language_analysis_utils import (
    single_term_classification,
    code_comment_wbpm,
)


# from slimit.parser import Parser
# from slimit.visitors import nodevisitor
# from slimit import ast as js_ast


# def javascript_processor(code):
#     parser = Parser()
#     try:
#         tree = parser.parse(code)
#     except Exception as e:
#         print(f"Error parsing JavaScript code: {e}")
#         return [], []

#     functions = []
#     variables = []

#     for node in nodevisitor.visit(tree):
#         if (
#             isinstance(node, js_ast.FuncDecl)
#             or isinstance(node, js_ast.FuncExpr)
#             and node.identifier.value not in functions
#         ):
#             functions.append(node.identifier.value)
#         elif (
#             isinstance(node, js_ast.VarDecl) and node.identifier.value not in variables
#         ):
#             variables.append(node.identifier.value)

#     return generic_return(functions, variables)


def generic_return(functions, variables, comments):
    return {"functions": functions, "variables": variables, "comments": comments}


def python_processor(code):
    tree = ast.parse(code)

    functions = []
    variables = []
    comments = []

    for node in ast.walk(tree):
        if isinstance(node, ast.FunctionDef) and node.name not in [
            function["term"] for function in functions
        ]:
            functions.append(single_term_classification(node.name))
        elif isinstance(node, ast.Name) and node.id not in [
            variable["term"] for variable in variables
        ]:
            variables.append(single_term_classification(node.id))
        elif isinstance(node, ast.Comment):
            comments.append(code_comment_wbpm(node.value))

    return generic_return(functions, variables, comments)


def java_processor(code):
    functions = []
    variables = []
    comments = [
        code_comment_wbpm(comment.text())
        for comment in comment_parser.extract_comments_from_str(
            code, mime="text/x-java-source"
        )
    ]

    tree = javalang.parse.parse(code)

    for _, node in tree:
        if isinstance(node, javalang.tree.MethodDeclaration) and node.name not in [
            function["term"] for function in functions
        ]:
            functions.append(single_term_classification(node.name))
        elif isinstance(node, javalang.tree.VariableDeclarator) and node.name not in [
            variable["term"] for variable in variables
        ]:
            variables.append(single_term_classification(node.name))

    return generic_return(functions, variables, comments)


LANGUAGE_PROCESSORS = {
    "python": python_processor,
    "java": java_processor,
}