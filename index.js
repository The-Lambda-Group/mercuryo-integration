const express = require("express");
const crypto = require("crypto");
const cors = require('cors');
const app = express();
const port = 3000;

const secretKey = "ABCDEFG";
const widgetId = "55555555555555";

app.use(cors());

const removePrefix = (inputString) => {
  if (inputString.startsWith("0x")) {
    return inputString.slice(2);
  }
  return inputString;
};

const computeHash = (inputString) => {
  const hash = crypto.createHash("sha512");
  hash.update(inputString);
  return hash.digest("hex");
};

app.get("/make-a-url", (req, res) => {
  const addressParameter = req.query.address;
  if (!addressParameter) {
    return res
      .status(400)
      .json({ error: 'Invalid or missing "address" query parameter' });
  }
  const address = removePrefix(addressParameter);
  const hashInput = `${address}${secretKey}`;
  const signature = computeHash(hashInput);
  const url = `https://exchange.mercuryo.io/?widget_id=${widgetId}&address=${address}&hide_address=true&signature=${signature}`;
  res.json({ url });
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
