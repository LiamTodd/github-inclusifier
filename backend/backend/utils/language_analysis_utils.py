from backend.constants import FAILED_FILE_READ_WARNING
from backend.constants import NON_INCLUSIVE_LANGUAGE_TERMS
import re


def sub_string_pattern_match(file_data):
    for file in file_data.values():
        if (
            file.get("content") is not None
            and file.get("content") != FAILED_FILE_READ_WARNING
        ):
            cleaned_file_content = file.get("content").lower()
            file["sspm_matches"] = {}
            for category_name, category_list in NON_INCLUSIVE_LANGUAGE_TERMS.items():
                file["sspm_matches"][category_name] = {}
                for term in category_list:
                    # find start index of all occurrences of substring
                    matching_start_indexes = [
                        m.start()
                        for m in re.finditer(f"(?={term})", cleaned_file_content)
                    ]
                    if len(matching_start_indexes) > 0:
                        file["sspm_matches"][category_name][
                            term
                        ] = matching_start_indexes
    return file_data


def word_boundary_pattern_match(file_data):
    return file_data
