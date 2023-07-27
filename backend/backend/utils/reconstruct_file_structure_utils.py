def reconstruct_file_structure(flat_file_data, repo_root):
    flat_file_data_list = list(flat_file_data.values())
    root = flat_file_data.get(repo_root)
    return [reconstruct_file_structure_aux(flat_file_data_list, root)]


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
