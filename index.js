const fs = require('fs');
const input = fs.readFileSync(process.argv[2], 'utf8');

const morpheusToSwagger = require('./morpheusToSwagger');
const swaggerSpec = morpheusToSwagger(JSON.parse(input));

const swaggerJson = JSON.stringify(swaggerSpec, null, 2);
const swaggerYaml = require('json2yaml').stringify(swaggerSpec);

fs.writeFileSync('swagger.json', swaggerJson);
fs.writeFileSync('swagger.yaml', swaggerYaml);
