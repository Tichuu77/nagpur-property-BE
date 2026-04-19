import { z } from "zod";

export default function validate(schema) {
  return (req, _res, next) => {
    try {
      // ── Pattern 1: Flat schema ─────────────────────────────
      if (typeof schema?.safeParse === "function") {
        const result = schema.safeParse(req.body);

        if (!result.success) {
          const errors =
            result.error?.issues?.map((e) => e.message) || [
              "Validation error",
            ];

          return next({
            statusCode: 400,
            message: "Validation Error",
            errors,
          });
        }

        req.body = result.data;
        return next();
      }

      // ── Pattern 2: Nested schema ───────────────────────────
      const parts = ["body", "query", "params"];

      for (const part of parts) {
        if (!schema[part]) continue;

        const partSchema = schema[part];

        // ── Zod ─────────────────────────────
        if (typeof partSchema.safeParse === "function") {
          const result = partSchema.safeParse(req[part]);

          if (!result.success) {
            const errors =
              result.error?.issues?.map((e) => e.message) || [
                `${part} validation error`,
              ];

            return next({
              statusCode: 400,
              message: `${capitalize(part)} Validation Error`,
              errors,
            });
          }

          req[part] = result.data;
        }

        // ── Joi ─────────────────────────────
        else if (typeof partSchema.validate === "function") {
          const { error, value } = partSchema.validate(req[part], {
            abortEarly: false,
            stripUnknown: true,
          });

          if (error) {
            const errors =
              error?.details?.map((e) => e.message) || [
                `${part} validation error`,
              ];

            return next({
              statusCode: 400,
              message: `${capitalize(part)} Validation Error`,
              errors,
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

// helper
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}