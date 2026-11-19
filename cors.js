// CORSの設定なし
// /api のレスポンスに、CORS ヘッダを何も付けない
module.exports = (req, res, next) => {
  next();
};
