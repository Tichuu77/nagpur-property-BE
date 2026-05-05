// validateProperty.middleware.js

import { validatePropertyPayload } from "./property.schema.js";

export function validateProperty(req, _res, next) {
  console.log('Validating request...', req.parsedBody);
  const { errors, data } = validatePropertyPayload(req.parsedBody); // ✅ errors not error

  if (errors) {
    return next({
      statusCode: 400,
      message: 'Validation Error',
      errors,
    });
  }

  req.validatedBody = data;
  next();
}

export function validatePropertyUpdate(req, _res, next) {
  const body = req.parsedBody;

  if (body.listingCategory && body.propertyType) {
    const { errors, data } = validatePropertyPayload(body); // ✅ errors not error

    if (errors) {
      return next({
        statusCode: 400,
        message: 'Validation Error',
        errors,
      });
    }

    req.validatedBody = data;
  } else {
    req.validatedBody = body;
  }

  next();
}