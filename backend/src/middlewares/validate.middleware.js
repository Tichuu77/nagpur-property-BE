export default function validate(schema) {
  return (req, _res, next) => {
    try {
      const validatedData = {};

      // Validate body
      if (schema.body) {
        const { error, value } = schema.body.validate(req.body, {
          abortEarly: false,
          stripUnknown: true,
        });

        if (error) {
          return next({
            status: 400,
            message: 'Validation Error',
            errors: error.details.map((e) => e.message),
          });
        }

        validatedData.body = value;
      }

      // Validate query
      if (schema.query) {
        const { error, value } = schema.query.validate(req.query, {
          abortEarly: false,
          stripUnknown: true,
        });

        if (error) {
          return next({
            status: 400,
            message: 'Query Validation Error',
            errors: error.details.map((e) => e.message),
          });
        }

        validatedData.query = value;
      }

      // Validate params
      if (schema.params) {
        const { error, value } = schema.params.validate(req.params, {
          abortEarly: false,
          stripUnknown: true,
        });

        if (error) {
          return next({
            status: 400,
            message: 'Params Validation Error',
            errors: error.details.map((e) => e.message),
          });
        }

        validatedData.params = value;
      }

      // Replace req data with sanitized values
      if (validatedData.body) req.body = validatedData.body;
      if (validatedData.query) req.query = validatedData.query;
      if (validatedData.params) req.params = validatedData.params;

      next();
    } catch (err) {
      next(err);
    }
  };
}