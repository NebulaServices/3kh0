/*
Hello epic hacker (maybe skid) you are looking at one of the many scripts that powers the site,
this script has extra comments and info to help you understand what is going on.

This is a JavaScript code that generates random splash messages and sets them in the DOM.

The code declares two variables for caching splash messages, "splashCacheAll" and "splashCache".

The "randomSay" function fetches a set of splash messages and selects a random one from the set,
caching the remaining messages in the "splashCache" variable.

If the selected message contains special placeholders like "%REAL_IP%", "%GAMES_NUMBER%", or "%SPLASH_NUMBER%",
the placeholders are replaced with corresponding values, such as the user's IP address, the number of available games,
or the total number of splash messages. The "setRandomSay" function sets the selected splash message in the DOM.

If there is an element with class "message", the "setRandomSay" function is called to set a random splash message in the DOM.
*/

// Declare variables for caching splash messages
var splashCacheAll;
var splashCache;

// Async function that returns a random splash message
async function randomSay() {
  // If splashCache is defined and not empty
  if (splashCache) {
    // If splashCache is empty, set it equal to the full set of splash messages
    if (!splashCache.length) {
      splashCache = splashCacheAll;
    }
    // Set says variable to the current splashCache
    var says = splashCache;
  } else {
    // If splashCache is undefined or empty, fetch the full set of splash messages
    var say = await fetch("./assets/json/say.json");
    var says = await say.json();
    // Store the full set of splash messages in both splashCacheAll and splashCache
    splashCacheAll = says;
    splashCache = says;
  }

  // Get a random splash message from the current says set
  var getRandomSay = says[Math.floor(Math.random() * says.length)];

  // Remove the randomly selected splash message from the cache
  splashCache = splashCache.filter((splash) => splash !== getRandomSay);

  // Return the randomly selected splash message
  return getRandomSay;
}

// Async function that sets a random splash message in the DOM
async function setRandomSay() {
  // Get a random splash message using the randomSay() function
  var randomSplash = await randomSay();

  // If the random message is "%REAL_IP%", replace it with the user's IP address
  if (randomSplash == "%REAL_IP%") {
    var ips = await getIPs();
    if (ips[0]) {
      randomSplash = "Your real IP is " + ips[0];
    } else {
      randomSplash = "Cannot get your real IP :(";
    }
  }
  // If the random message is "%GAMES_NUMBER%", replace it with the number of games available
  else if (randomSplash == "%GAMES_NUMBER%") {
    var gamesFetch = await fetch(location.origin + "/assets/json/games.json");
    var games = await gamesFetch.json();
    randomSplash = "There are " + games.length + " games currently";
  }
  // If the random message is "%SPLASH_NUMBER%", replace it with the total number of splash messages
  else if (randomSplash == "%SPLASH_NUMBER%") {
    randomSplash = "There are " + splashCacheAll.length + " of these messages!";
  }

  // Set the random splash message in the DOM
  document.querySelector(".message").innerText = randomSplash;
}

// If there is an element with class "message", set a random splash message in the DOM
if (document.querySelector(".message")) {
  setRandomSay();
}