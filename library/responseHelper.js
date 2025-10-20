const successResponse = (res, message, data = null, statusCode = 200) => {
  const response = { status: statusCode, message: message };
  if (data !== null) {
    response.data = data;
  }
  return res.status(statusCode).json(response);
};

const errorResponse = (res, message, statusCode = 500, errors = null) => {
  const response = { status: statusCode, message: message };
  if (errors !== null) {
    response.errors = errors;
  }
  return res.status(statusCode).json(response);
};

const cursorPaginatedResponse = (
  res,
  message,
  data,
  pagingInfo,
  statusCode = 200
) => {
  return res.status(statusCode).json({
    status: statusCode,
    message: message,
    data: data,
    paging: {
      has_next_page: pagingInfo.hasNextPage,
      has_prev_page: pagingInfo.hasPrevPage,
      cursors: { next: pagingInfo.nextCursor, prev: pagingInfo.prevCursor },
    },
    links: { next: pagingInfo.nextLink, prev: pagingInfo.prevLink },
  });
};

module.exports = { successResponse, errorResponse, cursorPaginatedResponse };
