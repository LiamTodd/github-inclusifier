from backend.constants import (
    GPT4_ENGINE,
    LLAMA7B_ENGINE,
    PROMPT_TEMPLATES,
    RESPONSE_DELIMITER,
    TEMPORARY_NGROK_URL,
)
import requests
import json


def gpt4_engine(original_text, term):
    template = PROMPT_TEMPLATES["non-code-inclusive"]
    input = f"""
            {template['pre-term']}{term}
            {template['pre-text']}{original_text}
            {template['post-text']}
        """

    return f"gpt-4 response {input}"


def llama7b_engine(original_text, term):
    template = PROMPT_TEMPLATES["non-code-inclusive"]
    processed_original_text = original_text.replace("\n", " ").replace("\r", "")

    input = f"""
{template['pre-term']}{term}
{template['pre-text']}{processed_original_text}
{template['post-text']}
"""

    response = requests.get(f"{TEMPORARY_NGROK_URL}?input={input}")
    raw_output = json.loads(response.text)["data"]
    index = raw_output.index(RESPONSE_DELIMITER)
    processed_output = raw_output[index + len(RESPONSE_DELIMITER) :]
    if processed_output[0:2] == "\\n":
        processed_output = processed_output[2:]
    return processed_output.lstrip()


LLM_ENGINE_FUNCTIONS = {GPT4_ENGINE: gpt4_engine, LLAMA7B_ENGINE: llama7b_engine}
