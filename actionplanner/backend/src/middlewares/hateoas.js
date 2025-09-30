export default (req, res, next) => {
  res.hateoas_item = (data) => {
    res.json({
      ...data,
      _links: [
        { rel: "self", href: req.originalUrl, method: req.method },
        { rel: "list", href: req.baseUrl, method: "GET" },
        {
          rel: "update",
          href: `${req.baseUrl}/${data.id || data._id}`,
          method: "PUT",
        },
        {
          rel: "delete",
          href: `${req.baseUrl}/${data.id || data._id}`,
          method: "DELETE",
        },
      ],
    });
  };

  res.hateoas_list = (data, totalPages, extra = {}) => {
    const page = parseInt(req.query._page) || 1;
    res.json({
      data,
      totalPages,
      page,
      ...extra,
    });
  };

  next();
};
