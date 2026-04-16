import { z } from 'zod';

/**
 * validate(schema)
 *
 * Supports two patterns:
 *
 * 1. Flat Zod schema — validates req.body directly
 *    validate(myZodSchema)
 *
 * 2. Nested shape — validates body / query / params separately
 *    validate({ body: mySchema, query: myQuerySchema, params: myParamsSchema })
 */
export default function validate(schema) {
  return (req, _res, next) => {
    try {
      // ── Pattern 1: flat Zod schema (has .parse / .safeParse) ─────────────────
      if (typeof schema?.safeParse === 'function') {
        const result = schema.safeParse(req.body);

        if (!result.success) {
          const errors = result.error.errors.map((e) => e.message);
          return next({
            status: 400,
            message: 'Validation Error',
            errors,
          });
        }

        req.body = result.data;
        return next();
      }

      // ── Pattern 2: nested { body?, query?, params? } ──────────────────────────
      const parts = ['body', 'query', 'params'];

      for (const part of parts) {
        if (!schema[part]) continue;

        const partSchema = schema[part];
        let result;

        // Support both Zod schemas and Joi-style schemas
        if (typeof partSchema.safeParse === 'function') {
          // Zod
          result = partSchema.safeParse(req[part]);
          if (!result.success) {
            return next({
              status: 400,
              message: `${part.charAt(0).toUpperCase() + part.slice(1)} Validation Error`,
              errors: result.error.errors.map((e) => e.message),
            });
          }
          req[part] = result.data;
        } else if (typeof partSchema.validate === 'function') {
          // Joi
          const { error, value } = partSchema.validate(req[part], {
            abortEarly: false,
            stripUnknown: true,
          });
          if (error) {
            return next({
              status: 400,
              message: `${part.charAt(0).toUpperCase() + part.slice(1)} Validation Error`,
              errors: error.details.map((e) => e.message),
            });
          }
          req[part] = value;
        }
      }

      next();
    } catch (err) {
      next(err);
    }
  };
}