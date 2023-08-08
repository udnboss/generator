# Import the modules
import argparse
import shlex

# Create a test string
test_string = 'category_id -optional-create -ref categories.id -type entity -entity-type account -ref-delete setnull -ref-update cascade -enforce'
test_string = 'category_id -oc -r categories.id -t entity -et account -rd setnull -ru cascade'
test_string = 'category.id d-cascade u-cascade su-enforce'

# Split the test string into tokens using shlex
tokens = shlex.split(test_string)

# Create a parser object
parser = argparse.ArgumentParser(description='A script that parses an entity property')

# Add the arguments to the parser
parser.add_argument('prop', help='The property name')
# parser.add_argument('-optional', action='store_true', help='The property value allows null')
parser.add_argument('-optional-create', '-oc', action='store_true', help='The property value allows null when creating')
parser.add_argument('-optional-update', '-ou', action='store_true', help='The property value allows null when updating')
parser.add_argument('-isarray', action='store_true', help='The property value is an array of the specified -type')
parser.add_argument('-type', '-t', default='string', choices=['entity', 'string', 'integer', 'number', 'boolean'], help='The base property type')
parser.add_argument('-entity-type', '-et', default=None, help='The property type if its base type is an entity')

parser.add_argument('-ref', '-r', help='The property value is a constrained to another entity property value')
parser.add_argument('-ref-delete', '-rd', default=None, choices=['noaction', 'cascade', 'restrict', 'setnull'], help='The action to take when the referenced entity is deleted')
parser.add_argument('-ref-update', '-ru', default=None, choices=['noaction', 'cascade', 'restrict', 'setnull'], help='The action to take when the referenced entity is updated')
parser.add_argument('-enforce', action='store_true', help='Ensure that the referenced entity exists when saving')

# Parse the tokens and store them in variables
args = parser.parse_args(tokens)

if args.type == 'entity' and args.entity_type is None:
    raise Exception("Missing -entity-type")

# Print the values of the arguments for testing
print(vars(args))

