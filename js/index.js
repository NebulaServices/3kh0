/*
Hello epic hacker (maybe skid) you are looking at one of the many scripts that powers the site,
this script has extra comments and info to help you understand what is going on.

This code starts off with a script to check if the browser has a cookie, if not, it will display a message kindly asking for the user to turn off their adblocker. Then it sets the cookie so the message is not seen for another year.

The code sets up several variables and functions that are used to fetch data from the server,
manipulate the document's content, and create custom HTML elements.

The isBlocked function checks if a URL is blocked by fetching the content of its README.md
file and returning true if it does not start with "# 3kh0 Assets",
or if there is an error while fetching the file.

The getCDN function iterates through a list of CDN URLs, calls isBlocked on each of them,
and returns the first URL that is not blocked,
or the first URL in the list if they are all blocked.

The rest of the code sets up various event listeners and HTML elements, loads the main.js file,
and sets the website's theme and theme colors based on values in local storage.

The code is mostly concerned with setting up the website's initial state and is executed when the website loads.
*/

// This function checks if a cookie with the given key exists.
function checkCookie(key) {
  var value = "; " + document.cookie; // get the cookie value
  var parts = value.split("; " + key + "="); // split the value by the key
  if (parts.length == 2) {
    return true; // the key exists
  } else {
    return false; // the key does not exist
  }
}

var key = "myKey"; // set the key to check for
if (!checkCookie(key)) { // if the key does not exist in the cookie
  alert("Hello! This website is free to use but it costs alot money to maintain with the servers for games which is really expensive, so if you have ad blocker it would be nice of you to turn it off so we can keep the site running! Thank you for supporting us! <3"); // display an alert message
  var expirationDate = new Date(); // create a new date object
  expirationDate.setFullYear(expirationDate.getFullYear() + 1); // set the expiration date to one year from now
  document.cookie = key + "=true; expires=" + expirationDate.toUTCString(); // create the cookie with the key and expiration date
}

var crate;

// Checks if a CDN is blocked by testing the README.md file
async function isBlocked(url) {
  try {
    var README = await fetch(url + '/README.md');
    var content = await README.text();
    if (content.startsWith('# 3kh0 Assets')) {
      // The CDN is not blocked
      return false;
    } else {
      // The CDN is not returning a valid response or is blocked
      return true;
    }
  } catch {
    return true;
  }
}

async function getCDN(cdns) {
  for (let cdn of cdns) {
    var blocked = await isBlocked(cdn);
    if (!blocked) {
      return cdn;
    }
  }
  return cdns[0];
}

// Define some varibles for later
const path = location.pathname;
const origin = localStorage.getItem('instance');
const cdn = localStorage.getItem('cdn');
const queryString = window.location.search;
window.history.pushState({}, '', path);
const urlParams = new URLSearchParams(queryString);
const onLoadData = urlParams.get('onload');

const base = document.createElement('base');
base.href = location.origin + path.replace(path.split('\\').pop().split('/').pop(), '');
document.head.appendChild(base);

// If we do not have the origin var, we make it
if (!origin) {
  localStorage.setItem('instance', base.href);
  location.reload();
}

// If we do not have the cdn var, we make it
if (!cdn) {
  fetch('./assets/json/cdns.json')
    .then((res) => res.json())
    .then(async (cdns) => {
      localStorage.setItem('cdn', await getCDN(cdns));
      location.reload();
    });
}

const instance = encodeURIComponent(origin.replace(location.origin, ''));

// If we have onLoadData, we run it now

window.addEventListener('load', () => {
  if (onLoadData) {
    try {
      eval(onLoadData);
    } catch(e) {
      console.error(e);
    }
  }

  // Set up the WidgetBot crate
  if(Crate) {
    crate = new Crate({
      server: '971769908205604864', // EchoDev
      channel: '1017203047388160050', // #guest-chat
      // notifications: false,
  })
  }
});

// If we have any errors, we will log it
window.addEventListener('error', (e) => {
  console.error(e);
});

// Add the main script in the <head> tags
const jsdelivr = document.createElement('script');
jsdelivr.setAttribute('src', 'https://cdn.jsdelivr.net/gh/3kh0/3kh0.github.io/js/main.js');
document.head.append(jsdelivr);

// Collect Tab Cloak data from local storage
var tab = localStorage.getItem('tab');
if (tab) {
  try {
    // Parse the data, it is in JSON
    var tabData = JSON.parse(tab);
  } catch {
    var tabData = {};
  }
} else {
  var tabData = {};
}

// Set the Tab title if the Tab cloak data is there
if (tabData.title) {
  document.title = tabData.title;
}

// Set the Tab icon if the Tab cloak data is there
if (tabData.icon) {
  document.querySelector('link[rel="icon"]').href = tabData.icon;
}

// Set theme colors if the user has set it
function getContrastHex(hexcolor) {
  hexcolor = hexcolor.replace('#', '');
  var r = parseInt(hexcolor.substr(0, 2), 16);
  var g = parseInt(hexcolor.substr(2, 2), 16);
  var b = parseInt(hexcolor.substr(4, 2), 16);
  var yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? '#1c1c1c' : 'white';
}

// Set theme colors if the user has set it
function getColorHex(hexcolor) {
  hexcolor = hexcolor.replace('#', '');
  var r = parseInt(hexcolor.substr(0, 2), 16);
  var g = parseInt(hexcolor.substr(2, 2), 16);
  var b = parseInt(hexcolor.substr(4, 2), 16);
  var yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? 'white' : 'black';
}

// Set theme colors if the user has set it
var theme = localStorage.getItem('theme') || 'default';
let themes;

// Fetching themes
fetch(origin + 'assets/json/themes.json')
  .then((res) => res.json())
  .then((data_themes) => {
    themes = data_themes;

    if (theme !== 'custom') {
      document.body.setAttribute('theme', theme);

      if (location.pathname.includes('/settings')) {
        themes.forEach((palette) => {
          if (palette.theme == theme) {
            console.log(palette.theme);
            document.querySelector('#theme_color').value = palette.color;
          }
        });
      }
    } else {
      // Get custom theme
      const theme = localStorage.getItem('theme_color');

      document.body.setAttribute('theme', 'custom');
      document.body.style = `--theme: ${theme}; --background: ${getContrastHex(theme)}; --text: ${getColorHex(theme)}; --text-secondary: ${getColorHex(theme)};`;

      if (location.pathname.includes('/settings')) {
        // Make the custom theme color selector
        document.querySelector('#theme_color').value = theme;
      }
    }
  })
  .catch((e) => {
    // Houston, we have a problem.
    console.error(e);
    throw new Error('Failed to load themes');
  });

// Add the changelogAdded element for the changelog
class changelogAdded extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
        <div class="changelog-item">
        <div class="changelog-type" added></div>
        ${this.innerText}
        </div>
        `;
  }
}

customElements.define('changelog-added', changelogAdded);

// Add the changelogRemoved element for the changelog
class changelogRemoved extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
        <div class="changelog-item">
        <div class="changelog-type" removed></div>
        ${this.innerText}
        </div>
        `;
  }
}
customElements.define('changelog-removed', changelogRemoved);

// Add the changelogChanged element for the changelog
class changelogChanged extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
        <div class="changelog-item">
        <div class="changelog-type" changed></div>
        ${this.innerText}
        </div>
        `;
  }
}
customElements.define('changelog-changed', changelogChanged);

// Parrot theme random colors
function setParrotColors() {
  var parrotColor = "rgb(195, 158, 31)"
  var parrotColors = ["#ff4c4b", "#c39e1f", "#b42e63"]

  document.querySelectorAll("*").forEach((item) => {
    if (getComputedStyle(item).color == parrotColor) {
        item.style.color = parrotColors[Math.floor((Math.random()*parrotColors.length))]
    }
  })
}

if (localStorage.getItem("theme") == "parrot") {
    setParrotColors()
}

// Handle secret themes
function foundSecretTheme(name) {
  document.body.setAttribute('theme', name);
  localStorage.setItem('theme', name);
  localStorage.setItem(name, 'true');
  if (document.querySelector('.' + name)) {
    document.querySelector('.' + name).removeAttribute('hidden');
  }
}

// Handle the secret theme button
function secretThemeButton(name) {
  if (localStorage.getItem(name) == 'true') {
    if (document.querySelector('.' + name)) {
      document.querySelector('.' + name).removeAttribute('hidden');
    }
  }
}

// Keybind themes
function createSecretThemeType(name, pattern) {
  window[name + 'pattern'] = pattern;
  window[name + 'current'] = 0;

  var themePattern = window[name + 'pattern'];
  var themeCurrent = window[name + 'current'];

  // Log key presses to see if the user got the theme
  document.addEventListener('keydown', function (e) {
    if (e.key !== themePattern[themeCurrent]) {
      return (themeCurrent = 0);
    }

    // Add this to the theme list
    themeCurrent++;

    if (themePattern.length == themeCurrent) {
      themeCurrent = 0;
      foundSecretTheme(name);
    }
  });

  secretThemeButton(name);
}

// Define the cool themes, stop using this as a cheatsheet
createSecretThemeType('nebelung', ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']);
createSecretThemeType('piplup', ['p', 'i', 'p', 'l', 'u', 'p', 'i', 's', 'c', 'o', 'o', 'l']);
createSecretThemeType('forternish', ['c', 'o', 'm', 'i', 'c', 's', 'a', 'n', 's']);
createSecretThemeType('russell2259', ['l', 'o', 'l']);

// Define the secret theme button, stop using this as a cheatsheet
secretThemeButton('hacker');

// Handle the secret theme button
window.nebelung_the_hacker = function () {
  foundSecretTheme('hacker');
};
