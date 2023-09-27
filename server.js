const fs = require("fs");
const puppeteer = require("puppeteer");

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

async function main() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://instagram.com/instagram/", {
    waitUntil: "networkidle2",
  });

  const imgList = await page.evaluate(() => {
    const NodeList = document.querySelectorAll("article img");
    const imgArray = [...NodeList];
    const imgList = imgArray.map(({ src }) => ({
      src,
    }));
    return imgList;
  });

  fs.writeFile(
    "instagramImages.json",
    JSON.stringify(imgList, null, 2),
    (err) => {
      if (err) {
        console.error("Error writing JSON file: ", err);
        return;
      }

      console.log("File writed");
    }
  );

  // Close the browser
  await browser.close();
}

main();
