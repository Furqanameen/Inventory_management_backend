const pagyParams = (page, perPage, sortBy, order) => {
  page = parseInt(page, 10) || 1
  perPage = parseInt(perPage, 10) || 50

  page = page < 1 ? 1 : page
  perPage = perPage < 1 ? 50 : perPage

  if (order) {
    order = order.toLowerCase() === 'asc' ? 1 : -1
  }

  return { page, perPage, sortBy, order }
}

const pagyRes = (records, count, page, perPage) => {
  const params = pagyParams(page, perPage)

  page = params.page
  perPage = params.perPage

  return {
    metadata: {
      count: count || 0,
      page,
      perPage: perPage,
    },
    records: records || [],
  }
}

module.exports = {
  pagyParams,
  pagyRes,
}
