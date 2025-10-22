import fs from "fs";
import path from "path";

const domain = "https://nationalfibre.net";
const folderPath = "./";

const linksToModify = [
  {
    from: "sign-in.html",
    to: "/auth/login",
  },
  {
    from: "sign-up.html",
    to: "/auth/sign-up",
  },
  {
    from: "../sign-in.html",
    to: "/auth/login",
  },
  {
    from: "../sign-up.html",
    to: "/auth/sign-up",
  },
  {
    from: "fr/sign-in.html",
    to: "/auth/login",
  },
  {
    from: "fr/sign-up.html",
    to: "/auth/sign-up",
  },
  {
    from: "../fr/sign-in.html",
    to: "/auth/login",
  },
  {
    from: "../fr/sign-up.html",
    to: "/auth/sign-up",
  },
];

const linksToReplace = [
  "/auth/login",
  "/auth/sign-up",
  "/contact",
  "/legal/terms",
  "/legal/privacy",
];

function replaceLinks(content) {
  linksToModify.forEach((link) => {
    const regex = new RegExp(`href=["']${link.from}`, "g");
    content = content.replace(regex, `href="${link.to}`);
  });
  linksToReplace.forEach((link) => {
    const regex = new RegExp(`href=["']${link}`, "g");
    content = content.replace(regex, `href="${domain}${link}`);
  });
  return content;
}

function updateHtmlFilesInDirectory(dir) {
  fs.readdir(dir, (err, files) => {
    if (err) {
      return console.error("Error", err);
    }

    files.forEach((file) => {
      const filePath = path.join(dir, file);

      fs.stat(filePath, (err, stats) => {
        if (err) {
          return console.error("Error", err);
        }

        if (stats.isDirectory()) {
          updateHtmlFilesInDirectory(filePath);
        } else if (path.extname(file) === ".html") {
          fs.readFile(filePath, "utf8", (err, data) => {
            if (err) {
              return console.error("Error", err);
            }

            const updatedContent = replaceLinks(data);

            fs.writeFile(filePath, updatedContent, "utf8", (err) => {
              if (err) {
                return console.error("Error", err);
              }

              console.log(`Update ${filePath}`);
            });
          });
        }
      });
    });
  });
}

updateHtmlFilesInDirectory(folderPath);
