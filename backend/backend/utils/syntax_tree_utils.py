import ast
import javalang


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


def generic_return(functions, variables):
    return {"functions": functions, "variables": variables}


def python_processor(code):
    tree = ast.parse(code)

    functions = []
    variables = []

    for node in ast.walk(tree):
        if isinstance(node, ast.FunctionDef) and node.name not in functions:
            functions.append(node.name)
        elif isinstance(node, ast.Name) and node.id not in variables:
            variables.append(node.id)

    return generic_return(functions, variables)


def java_processor(code):
    functions = []
    variables = []

    tree = javalang.parse.parse(code)

    for _, node in tree:
        if (
            isinstance(node, javalang.tree.MethodDeclaration)
            and node.name not in functions
        ):
            functions.append(node.name)
        elif (
            isinstance(node, javalang.tree.VariableDeclarator)
            and node.name not in variables
        ):
            variables.append(node.name)

    return generic_return(functions, variables)


LANGUAGE_PROCESSORS = {
    "python": python_processor,
    "java": java_processor,
}
