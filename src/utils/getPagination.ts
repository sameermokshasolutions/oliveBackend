export const getPagination = (
  page: string | number,
  limit: string | number
) => {
  const pageNumber: number = Number(page) > 0 ? Number(page) : 1;
  const limitNumber: number = Number(limit) > 0 ? Number(limit) : 10;
  const skip: number = (pageNumber - 1) * limitNumber;

  return { pageNumber, limitNumber, skip };
};
