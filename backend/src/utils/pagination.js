export const getPagination = ({ page = 1, limit = 10 }) => {
  const safePage = Number(page);
  const safeLimit = Number(limit);

  return {
    skip: (safePage - 1) * safeLimit,
    limit: safeLimit
  };
};
