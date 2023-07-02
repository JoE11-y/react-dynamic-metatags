const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const PORT = process.env.PORT || 3000;
const base = process.env.BASE || '/'
const axios = require("axios");

// static resources should just be served as they are
app.use(
  express.static(path.resolve(__dirname, "..", "build"), { maxAge: "30d" })
);

app.listen(PORT, (error) => {
  if (error) {
    return console.log("Error during app startup", error);
  }
  console.log("listening on " + PORT + "...");
});

const indexPath = path.resolve(__dirname, "..", "build", "index.html");
app.get("/*", (req, res, next) => {
  
  fs.readFile(indexPath, "utf8", async (err, htmlData) => {
    if (err) {
      console.error("Error during file reading", err);
      return res.status(404).end();
    }

    const url = req.originalUrl.replace(base, '')

    if(url.includes('/') && url.split('/').length >2) {
      const urli = url.split('/')
      const index = urli[2]
      const meta = await axios.get(`https://bafybeifhofputngb7k3zqpl5otnv4utpvse66sbzutxsg6bkozks6ytt7m.ipfs.dweb.link/${index}`);
      const image = `https://bafybeies3odi24wyk3e22rnautr57tiuk3b56nxrd53fxgtvr37abmz5j4.ipfs.dweb.link/${index}.png`;
      
      htmlData = htmlData
      .replace("<title>NFT Marketplace - Buy, Sell & Collect NFTs | LooksRare</title>", `<title>${meta?.data.name} - Azuki | LooksRare</title>`)
      .replace("__META_OG_TITLE__", `${meta?.data.name} - Azuki | LooksRare`)
      .replace("__META_OG_DESCRIPTION__", `LooksRare is a Community-first Marketplace for NFT's and digital.`)
      .replace("__META_OG_IMAGE__", image)
      .replace("__META_OGT_TITLE__", `${meta?.data.name} - Azuki | LooksRare`)
      .replace("__META_OGT_DESCRIPTION__", `LooksRare is a Community-first Marketplace for NFT's and digital.`)
      .replace("__META_OGT_IMAGE__", image)
      .replace("__META_OGT_DOMAIN__", "https://looksrare.org")
      .replace("__META_OGT_URL__", "https://looksrare.org");
    }
    return res.send(htmlData);
  });
});
