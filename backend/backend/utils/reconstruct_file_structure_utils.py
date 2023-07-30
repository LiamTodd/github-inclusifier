def reconstruct_file_structure(flat_file_data, repo_root):
    flat_file_data_list = list(flat_file_data.values())
    root = flat_file_data.get(repo_root)
    return [
        resolve_double_root_structure(
            reconstruct_file_structure_aux(flat_file_data_list, root)
        )
    ]


def reconstruct_file_structure_aux(flat_file_data_list, parent):
    children = [
        file
        for file in flat_file_data_list
        if file.get("parent") == parent.get("file_path")
    ]
    for child in children:
        if child.get("is_dir"):
            reconstruct_file_structure_aux(flat_file_data_list, child)
    parent["children"] = children
    return parent


def resolve_double_root_structure(reconstructed_file_structure):
    # This function changes the file structure from:
    # root___root-2___repo-content
    # to:
    # root___repo-content
    duplicated_root = reconstructed_file_structure["children"][0]
    reconstructed_file_structure["children"] = duplicated_root["children"]
    return reconstructed_file_structure
