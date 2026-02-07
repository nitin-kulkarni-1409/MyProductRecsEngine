function validateRecsParams(req, res, next) {
  const { userId } = req.query;

  // Required parameter check
  if (!userId) {
    return res.status(400).json({
      error: "Missing required parameter: userId"
    });
  }

  // Optional parameters with defaults
  req.query.channel = req.query.channel || "general";
  req.query.limit = req.query.limit ? Number(req.query.limit) : 5;
  req.query.gender = req.query.gender || "women";
  req.query.placement = req.query.placement || "any";

  next();
}

module.exports = validateRecsParams;
