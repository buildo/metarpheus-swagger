import test from 'ava';
import YAML from 'json2yaml';
import morpheusToSwagger from '../morpheusToSwagger';

const input = require('./fixtures/input.json');

test('it should produce a correct JSON output', t => {
  const expectedJSON = require('./fixtures/swagger.json');
  const swaggerSpec = morpheusToSwagger(input);
  t.same(swaggerSpec, expectedJSON);
})

test('it should produce a correct YAML output', t => {
  const expectedYAML = require('fs').readFileSync('./fixtures/swagger.yaml', 'utf8');
  const swaggerSpec = morpheusToSwagger(input);
  t.same(YAML.stringify(swaggerSpec), expectedYAML);
})
