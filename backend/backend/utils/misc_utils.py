def parse_boolean_string(boolean_string):
    cleaned_boolean_string = boolean_string.lower()
    if cleaned_boolean_string == "true":
        return True
    if cleaned_boolean_string == "false":
        return False
    raise TypeError
