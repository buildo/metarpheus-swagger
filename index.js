const ArgumentParser = require('argparse').ArgumentParser;
const argParser = new ArgumentParser({ addHelp: true });
argParser.addArgument([ '-t', '--customTypes' ], {
  help: 'custom type definitions'
});
argParser.addArgument(['input'], {
  help: 'input file'
});
const args = argParser.parseArgs();

const fs = require('fs');
const input = fs.readFileSync(args.input, 'utf8');
const customTypes = args.customTypes ? JSON.parse(fs.readFileSync(args.customTypes)) : {};

const morpheusToSwagger = require('./morpheusToSwagger');
const swaggerSpec = morpheusToSwagger(JSON.parse(input), customTypes);

const swaggerJson = JSON.stringify(swaggerSpec, null, 2);
const swaggerYaml = require('json2yaml').stringify(swaggerSpec);

fs.writeFileSync('swagger.json', swaggerJson);
fs.writeFileSync('swagger.yaml', swaggerYaml);
