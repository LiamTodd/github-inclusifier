from backend.constants import (
    FAILED_FILE_READ_WARNING,
    NON_INCLUSIVE_LANGUAGE_TERMS,
    SSPM,
    WBPM,
)
import re


def single_term_classification(term):
    non_inclusive = False
    category = None
    algorithm = None
    cleaned_term = term.lower()
    # must search for all wbpm matches first, as some terms are substrings of other terms.
    for non_inclusive_category, category_terms in NON_INCLUSIVE_LANGUAGE_TERMS.items():
        for category_term in category_terms:
            wbpm_matches = [
                m.start() for m in re.finditer(rf"\b{category_term}\b", cleaned_term)
            ]
            if len(wbpm_matches) > 0:
                non_inclusive = True
                category = non_inclusive_category
                algorithm = WBPM
                break
        # only look for sub-string matches if no word-boundary matches are found
        if non_inclusive == False:
            for (
                non_inclusive_category,
                category_terms,
            ) in NON_INCLUSIVE_LANGUAGE_TERMS.items():
                for category_term in category_terms:
                    if category_term in cleaned_term:
                        non_inclusive = True
                        category = non_inclusive_category
                        algorithm = SSPM
                        break
    return {
        "term": term,
        "non_inclusive": non_inclusive,
        "category": category,
        "algorithm": algorithm,
    }


def code_comment_wbpm(comment):
    cleaned_comment = comment.lower()
    analysis = {}
    for category_name, category_list in NON_INCLUSIVE_LANGUAGE_TERMS.items():
        analysis[category_name] = {}
        for term in category_list:
            # find start index of all word-boundary matches
            matching_start_indexes = [
                m.start() for m in re.finditer(rf"\b{term}\b", cleaned_comment)
            ]
            if len(matching_start_indexes) > 0:
                analysis[category_name][term] = matching_start_indexes
    return {"text": comment, "analysis": analysis}


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
    for file in file_data.values():
        if (
            file.get("content") is not None
            and file.get("content") != FAILED_FILE_READ_WARNING
        ):
            cleaned_file_content = file.get("content").lower()
            file["wbpm_matches"] = {}
            for category_name, category_list in NON_INCLUSIVE_LANGUAGE_TERMS.items():
                file["wbpm_matches"][category_name] = {}
                for term in category_list:
                    # find start index of all word-boundary matches
                    matching_start_indexes = [
                        m.start()
                        for m in re.finditer(rf"\b{term}\b", cleaned_file_content)
                    ]
                    if len(matching_start_indexes) > 0:
                        file["wbpm_matches"][category_name][
                            term
                        ] = matching_start_indexes
    return file_data


def collate_term_matches(file_matches, file, report, algorithm):
    if file_matches is not None:
        for file_category, file_category_report in file_matches.items():
            for term, matching_list in file_category_report.items():
                report[file_category][term].append(
                    {
                        "file": file["file_path"],
                        "count": len(matching_list),
                        "algorithm": algorithm,
                    }
                )


def generate_language_report(file_data):
    report = {}
    for category_name, category_list in NON_INCLUSIVE_LANGUAGE_TERMS.items():
        report[category_name] = {}
        for term in category_list:
            report[category_name][term] = []

    for file in file_data.values():
        collate_term_matches(file.get("sspm_matches"), file, report, SSPM)
        collate_term_matches(file.get("wbpm_matches"), file, report, WBPM)

    return report
