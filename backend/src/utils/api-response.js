export const successResponse = (data, message = 'Success', pagination, ...erg) => ({ success: true, message, data, pagination, ...erg});
