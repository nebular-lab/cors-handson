// CORSの設定あり：許可リストのオリジンだけを許可する（書籍 リスト4-23）
const allowList = [
  "http://partner.site.example:3000",
  "http://site.example:3000"
];

module.exports = (req, res, next) => {
  // Origin ヘッダがあり、かつ許可リストに含まれているときだけ許可する
  if (req.headers.origin && allowList.includes(req.headers.origin)) {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
  }
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Headers", "X-Token");
  }
  next();
};
