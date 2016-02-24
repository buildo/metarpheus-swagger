const morpheusToSwagger = input => {
  const { models, routes } = input;

  const successResponse = {
    '200': {
      description: 'success'
    }
  };

  const toSwaggerType = tpe => {
    switch (tpe) {
      case 'String': return 'string';
      default: return tpe;
    }
  }

  const getRouteParamName = ({ name = 'unknown' }) => name;

  const getRoutePath = ({ route }) => route.reduce((path, part) => {
    if (part.str) return `${path}/${part.str}`;
    if (part.routeParam) return `${path}/{${getRouteParamName(part.routeParam)}}`;
    //TODO: any other cases? Body params? Query params?
    return path;
  }, '');

  const getRouteParameters = ({ route }) => {
    return route
      .filter(part => Object.keys(part).indexOf('routeParam') !== -1)
      .map(({ routeParam }) => ({
        in: 'path',
        name: getRouteParamName(routeParam),
        required: routeParam.required,
        type: toSwaggerType(routeParam.tpe.name)
      }))
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
          responses: successResponse //TODO: use actual return types
        }
      }
    }
  });

  const swaggerSpec = {
    swagger: '2.0',
    info: {
      description: 'Autogenerated swagger spec',
      version: '0.1.0',
      title: 'metarpheus-swagger',
    },
    paths: paths.reduce((paths, path) => Object.assign(paths, path))
  };

  return swaggerSpec;

};

module.exports = morpheusToSwagger;
