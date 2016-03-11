const objectAssignDeep = require('object-assign-deep');

const morpheusToSwagger = input => {
  const { models, routes } = input;

  const successResponse = route => ({
    '200': {
      description: `a ${route.returns.name}`,
      schema: {
        $ref: `#/definitions/${route.returns.name}`
      }
    }
  });

  const objectify = arr => arr.reduce((arr, a) => objectAssignDeep(arr, a));

  const toSwaggerType = ({ name, args }, noSchemaEmbed) => {
    if (models.filter(m => m.name === name).length) {
      if (noSchemaEmbed) {
        return { $ref: `#/definitions/${name}` };
      } else {
        return { schema: { $ref: `#/definitions/${name}` } };
      }
    }

    // refer to
    // https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#data-types
    switch (name) {
      case "String": return { type: 'string' };
      case "Int": return { type: 'integer', format: 'int32' };
      case "Long": return { type: 'integer', format: 'int64' };
      case "Float": return { type: 'number', format: 'float' };
      case "Double": return { type: 'number', format: 'double' };
      case "Date": return { type: 'string', format: 'date' };
      case "DateTime": return { type: 'string', format: 'date-time' };
      case "Boolean": return { type: 'boolean' };
      case "Option": return toSwaggerType(args[0]);
      default: console.log(`unknown type '${name}'`); return { type: name };
    };

  };

  const getRouteParamName = ({ name = 'unknown' }) => name;

  const getRoutePath = ({ route }) => route.reduce((path, part) => {
    if (part.str) return `${path}/${part.str}`;
    if (part.routeParam) return `${path}/{${getRouteParamName(part.routeParam)}}`;
    return path;
  }, '');

  const getRouteParameters = (route) => {
    const pathParams = route.route
      .filter(part => Object.keys(part).indexOf('routeParam') !== -1)
      .map(({ routeParam }) => Object.assign({
        in: 'path',
        name: getRouteParamName(routeParam),
        required: routeParam.required,
      }, toSwaggerType(routeParam.tpe)));

    const { params = [], body } = route;
    const queryParams = params.map(param => Object.assign({
      in: 'query',
      name: param.name,
      required: param.required
    }, toSwaggerType(param.tpe)));

    const bodyParams = body ? [{
      in: 'body',
      name: 'body',
      required: true,
      schema: {
        $ref: `#/definitions/${body.tpe.name}`
      }
    }] : [];

    return [...pathParams, ...queryParams, ...bodyParams];
  };


  const paths = routes.map(route => {
    const path = getRoutePath(route);
    const parameters = getRouteParameters(route);

    return {
      [path]: {
        [route.method]: {
          summary: route.desc,
          consumes: [
            'application/json'
          ],
          produces: [
            'application/json'
          ],
          parameters,
          responses: successResponse(route)
        }
      }
    }
  });

  const definitions = models.map(model => ({
    [model.name]: {
      type: 'object',
      properties: objectify(model.members.map(member => {
        return {
          [member.name]: Object.assign({
            description: member.desc
          }, toSwaggerType(member.tpe, true))
        };
      }))
    }
  }));

  const swaggerSpec = {
    swagger: '2.0',
    info: {
      description: 'Autogenerated swagger spec',
      version: '0.1.0',
      title: 'metarpheus-swagger',
    },
    paths: objectify(paths),
    definitions: objectify(definitions)
  };

  return swaggerSpec;

};

module.exports = morpheusToSwagger;
