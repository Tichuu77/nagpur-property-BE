/**
 * validateProperty.middleware.js
 *
 * Property-specific validation middleware that plugs into the existing
 * validate() pattern. Runs AFTER upload + parsePropertyBody.
 *
 * validateProperty       → POST (full validation, always)
 * validatePropertyUpdate → PUT  (full validation only when listingCategory
 *                               + propertyType are both present; otherwise
 *                               passes raw parsedBody through for partial updates)
 */
import { validatePropertyPayload } from './property.schema.js';

export function validateProperty(req, _res, next) {
  const { error, data } = validatePropertyPayload(req.parsedBody);

  if (error) {
    return next({
      statusCode: 400,
      message: 'Validation Error',
      errors: [error],
    });
  }

  req.validatedBody = data;
  next();
}

export function validatePropertyUpdate(req, _res, next) {
  const body = req.parsedBody;

  if (body.listingCategory && body.propertyType) {
    const { error, data } = validatePropertyPayload(body);

    if (error) {
      return next({
        statusCode: 400,
        message: 'Validation Error',
        errors: [error],
      });
    }

    req.validatedBody = data;
  } else {
    // Partial update — no listingCategory+propertyType combo present,
    // skip full matrix validation; Mongoose validators are the safety net.
    req.validatedBody = body;
  }

  next();
}