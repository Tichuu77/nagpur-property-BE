/**
 * parsePropertyBody.middleware.js
 *
 * Runs AFTER multer (upload) so req.body is already populated.
 * Normalises the two supported multipart shapes into a plain JS object
 * stored on req.parsedBody, ready for Zod validation.
 *
 * Shape A — single JSON blob:
 *   Field 'data' → JSON string containing all property fields
 *
 * Shape B — flat fields:
 *   Fields 'details', 'pricing', 'location', 'amenities' may be JSON strings
 *   All other fields are passed through as-is
 */
export function parsePropertyBody(req, res, next) {
  try {
    let body;

    if (req.body?.data) {
      console.log('Shape A', req.body);
      // Shape A
      try {
        body = JSON.parse(req.body.data);
      } catch {
        return next({ statusCode: 400, message: 'Validation Error', errors: ['Invalid JSON in data field'] });
      }
    } else {
      // Shape B — parse nested JSON strings
      body = { ...req.body };
      for (const key of ['details', 'pricing', 'location', 'amenities']) {
        if (typeof body[key] === 'string') {
          try {
            body[key] = JSON.parse(body[key]);
          } catch {
            return next({ statusCode: 400, message: 'Validation Error', errors: [`Invalid JSON in ${key} field`] });
          }
        }
      }
    }

    req.parsedBody = body;
    next();
  } catch (err) {
    next(err);
  }
}