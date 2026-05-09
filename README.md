# <img src="public/icons/icon-48.png" width="45" align="left"> Mountain Project Send Pyramid

![image](https://user-images.githubusercontent.com/3220734/235268616-d0d1c637-403b-4816-8723-ea01694db482.png)

View your rock climbing sends on [Mountain Project](https://www.mountainproject.com/), organized by climb type (boulder, sport, or trad climbs).

## Install

[**Chrome** extension](https://chrome.google.com/webstore/detail/mountain-project-send-pyr/fdnfbapicfkfkplchkelkecchbcniaie)

## Contribution

You'll need to have [Node.js](https://nodejs.org/en) and [npm](https://www.npmjs.com/) installed if you want to play around with the code.

1. This project was bootstrapped with [Chrome Extension CLI](https://github.com/dutiyesh/chrome-extension-cli). Install this tool globally:

```
npm install -g chrome-extension-cli
```

2. Clone this repository:

```
git clone https://github.com/melissapthai/mountain-project-send-pyramid.git
cd mountain-project-send-pyramid
```

3. Install dependencies, and build the app to get it ready to add to Chrome:

```
npm install && npm run build
```

You should now see a `/build` directory at the project root.

You can also run a suite of other nifty commands to make development easier, just check out the [Chrome Extension CLI docs](https://github.com/dutiyesh/chrome-extension-cli#npm-run-watch).

4. Load the app into Chrome:

   a) Open **chrome://extensions**

   b) Check the **Developer mode checkbox**

   c) Click on the **Load unpacked extension** button

   d) Select the folder **mountain-project-send-pyramid/build**

And that's it!

## Privacy Policy

Mountain Project Send Pyramid does not collect, sell, or share user data.

The extension runs only on Mountain Project user profile pages. It reads page content and tick-export data from Mountain
Project only to generate a send pyramid chart in the user's browser.

All processing happens locally in the browser. The extension does not transmit tick data, browsing data, personal
information, analytics, or usage information to the developer or to third parties.

The extension stores only a local display preference for the selected chart tab using browser local storage.

---

Feel free to reach out to me through email at melissapthai@gmail.com if you have any questions or suggestions!
