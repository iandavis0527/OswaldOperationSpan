import json
import pathlib
import xml.etree.ElementTree as ET
import re

tree = ET.parse(pathlib.Path(__file__).parent.absolute().joinpath("OspanShort.xml"))
root = tree.getroot()
studioItems = root.find("StudioItems")


def find_item(name):
    for studioItem in studioItems.findall("StudioItem"):
        if studioItem.find("Name").text == name:
            return studioItem


def extract_text_displays():
    return list(
        {
            "name": text_display.find("Name").text,
            "text": text_display.find("ObjectData").find("Text").text.replace("\n\n", "\n").split("\n"),
        }
        for text_display in filter(
            lambda item: item.find("TypeName").text == "TextDisplay", studioItems.findall("StudioItem")
        )
        if text_display.find("ObjectData").find("Text").text
    )


def collect_column_names(item):
    return (
        attribute.find("Name").text for attribute in item.find("ObjectData").find("Attributes").findall("Attribute")
    )


def collect_levels(item):
    return (data.text.split("\t") for data in item.find("ObjectData").find("Levels").findall("Level"))


def collect_stimuli_data(itemName):
    item = find_item(itemName)
    columns = list(collect_column_names(item))
    levels = list(collect_levels(item))
    stimuli_data = []

    for level in levels:
        data = {}

        for i, column in enumerate(columns):
            data[column] = level[i]

        stimuli_data.append(data)

    return stimuli_data


def convert_column(data, column_name, datatype):
    for row in data:
        row[column_name] = datatype(row[column_name])

    return data


def convert_columns(datasets, column_names, datatypes):
    converted_datasets = []

    for dataset in datasets:
        converted_dataset = dataset
        for column_name, datatype in zip(column_names, datatypes):
            converted_dataset = convert_column(converted_dataset, column_name, datatype)

        converted_datasets.append(dataset)

    return converted_datasets


def remove_columns(datasets, column_names):
    for column_name in column_names:
        for dataset in datasets:
            for row in dataset:
                if column_name in row:
                    del row[column_name]

    return datasets


def apply_weights(datasets, weight_column):
    converted_datasets = []

    for dataset in datasets:
        converted_datasets.append(list(filter(lambda row: row[weight_column] != "0", dataset)))

    return converted_datasets


def exclude_texts(texts, excluded_text_names):
    return list(filter(lambda text: text["name"] not in excluded_text_names, texts))


def exclude_empty_text(texts):
    def filter_empty(data):
        data["text"] = list(filter(lambda text: text.replace(" ", ""), data["text"]))
        return data

    return list(map(filter_empty, texts))


def strip_extra_spaces(texts):
    def filter_extra_spaces(data):
        data["text"] = list(filter(lambda text: text.rstrip(), data["text"]))
        return data

    return list(map(filter_extra_spaces, texts))


def wrap_in_p_tag(texts):
    def wrap_p(data):
        data["text"] = list(map(lambda text: "<p>{0}</p>".format(text), data["text"]))
        return data

    return list(map(wrap_p, texts))


math_practice_solo_stimuli = collect_stimuli_data("mathProblems")
math_operation_one_stimuli = collect_stimuli_data("operations")
math_operation_two_stimuli = collect_stimuli_data("secondOperation")

math_practice_solo_stimuli = convert_columns([math_practice_solo_stimuli], ["answer"], [int])[0]
math_operation_one_stimuli = convert_columns([math_operation_one_stimuli], ["sum"], [int])[0]
math_operation_two_stimuli = convert_columns([math_operation_two_stimuli], ["sum2"], [int])[0]

math_practice_solo_stimuli, math_operation_one_stimuli, math_operation_two_stimuli = apply_weights(
    [
        math_practice_solo_stimuli,
        math_operation_one_stimuli,
        math_operation_two_stimuli,
    ],
    "Weight",
)

math_practice_solo_stimuli, math_operation_one_stimuli, math_operation_two_stimuli = remove_columns(
    [math_practice_solo_stimuli, math_operation_one_stimuli, math_operation_two_stimuli],
    ["Weight", "Nested", "Procedure"],
)

instruction_texts = sorted(
    wrap_in_p_tag(
        strip_extra_spaces(
            exclude_empty_text(
                exclude_texts(
                    extract_text_displays(),
                    (
                        "Goodbye",
                        "ShowLetter",
                        "echoResponse",
                        "echoResponse1",
                        "ShowLetterPractice",
                        "scores",
                        "showProblem",
                        "TextDisplay1",
                    ),
                ),
            ),
        ),
    ),
    key=lambda text: text["name"],
)


instruction_texts = dict((instructions["name"], instructions["text"]) for instructions in instruction_texts)
instruction_text_data = json.dumps(instruction_texts, indent=4)
instruction_text_data = re.sub(r'"<p>(.*?)</p>"', r"<p>\1</p>", instruction_text_data)
instruction_text_data = "export default " + instruction_text_data + ";"

with open("instruction_texts.jsx", "w") as json_file:
    json_file.write(instruction_text_data)

with open("math_practice_solo.json", "w") as json_file:
    json.dump(math_practice_solo_stimuli, json_file, indent=4)

with open("math_operation_one_stimuli.json", "w") as json_file:
    json.dump(math_operation_one_stimuli, json_file, indent=4)

with open("math_operation_two_stimuli.json", "w") as json_file:
    json.dump(math_operation_two_stimuli, json_file, indent=4)
