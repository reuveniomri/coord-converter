const ALLOWED = /^(maps\.app\.goo\.gl|goo\.gl|g\.co|maps\.google\.[a-z.]+|www\.google\.[a-z.]+|google\.[a-z.]+)$/i;
module.exports = async (req, res) => {
  let u = (req.query && req.query.u) || "";
  try {
    for (let i = 0; i < 6; i++) {
      const url = new URL(u);
      if (url.protocol !== "https:" || !ALLOWED.test(url.hostname)) break;
      const r = await fetch(url, { redirect: "manual", headers: { "user-agent": "Mozilla/5.0" } });
      const loc = r.headers.get("location");
      if (!loc || r.status < 300 || r.status >= 400) break;
      u = new URL(loc, url).toString();
    }
    res.setHeader("cache-control", "s-maxage=86400");
    res.status(200).json({ url: u });
  } catch (e) {
    res.status(400).json({ error: "bad url" });
  }
};
