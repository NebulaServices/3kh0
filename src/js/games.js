/*
Hello epic hacker (maybe skid) you are looking at one of the many scripts that powers the site,
this script has extra comments and info to help you understand what is going on.

This is a JavaScript code that creates a game catalog page with a search feature,
a game detail page, and the ability to save and load user data.

It uses fetch to load game data from a JSON file, creates game elements for each game,
and adds click event listeners to show the game in a game container.

The code also includes functions to handle saving and loading user data as well as a function to handle a specific key sequence.
*/
// Select the elements
const gamesContainer = document.querySelector('.games');
const searchBar = document.querySelector('.searchbar');
const gameContainer = document.querySelector('.gamecontainer');
const gameFrame = gameContainer.querySelector('.frame');
const gameNav = gameContainer.querySelector('.nav');

// Listen for input event on the search bar
searchBar.addEventListener('input', (e) => {
  const query = searchBar.value.trim().toLowerCase();

  // Loop through all the games in the container and show/hide them depending on whether they match the search query
  for (let game of gamesContainer.children) {
    if (game instanceof Element) {
      if (query) {
        const gameName = game.querySelector('span').innerText.trim().toLowerCase();
        if (gameName.includes(query)) {
          game.removeAttribute('hidden');
        } else {
          game.setAttribute('hidden', '');
        }
      } else {
        game.removeAttribute('hidden');
      }
    }
  }

  // If there are no games shown, display the "No games" message, otherwise hide it
  if (document.querySelectorAll('.game:not([hidden])').length == 0) {
    document.querySelector('.nogames').style.display = 'initial';
  } else {
    document.querySelector('.nogames').style.display = 'none';
  }
});

// Fetch the games data from a JSON file
fetch('./assets/json/games.json')
  .then((res) => res.json())
  .then((games) => {
    // Loop through each game and create a new game element for it
    games.forEach((game) => {
      const gameEl = document.createElement('div');
      gameEl.className = 'game';
      gameEl.innerHTML = `<img src="${cdn + "/" + game.root + "/" + game.img}" onerror="this.src='./assets/globe.svg'"/><span>${game.name}</span>`;
      gamesContainer.appendChild(gameEl);

      // Add click event listener to the game element to show the game in the game container
      gameEl.onclick = (e) => {
        gamesContainer.classList.add('hidden');
        searchBar.classList.add('hidden');
        gameContainer.classList.remove('hidden');
        document.querySelector('.saveItems').classList.add('hidden');
        document.querySelector('.navbar').classList.add('noshadow');
        gameFrame.querySelector('iframe').src = `./assets/game?game=${game.root}`;
        gameNav.querySelector('span').textContent = game.name;
      };

      // Add click event listener to the back button in the game container to go back to the games list
      gameNav.querySelector('#back').addEventListener('click', (e) => {
        gamesContainer.classList.remove('hidden');
        searchBar.classList.remove('hidden');
        gameContainer.classList.add('hidden');
        document.querySelector('.saveItems').classList.remove('hidden');
        document.querySelector('.navbar').classList.remove('noshadow');
        gameFrame.src = '';
      });

      // Add click event listener to the fullscreen button in the game container to enter fullscreen mode
      gameNav.querySelector('#fullscreen').addEventListener('click', (e) => {
        if (!document.fullscreenElement) {
          gameFrame.requestFullscreen();
        }
      });
    });
  })
  .catch((e) => {
    alert('Could not load games');
    alert(e);
  });

// Hide the spinner element after the page is loaded
document.querySelector('.spinner').style.display = 'none';

// Function to get the main save data
function getMainSave() {
  var mainSave = {};

  // List of items in localStorage that should not be saved
  var localStorageDontSave = ['theme', 'tab', 'nebelung'];

  // Convert localStorage to an array of key-value pairs and remove the items that should not be saved
  localStorageSave = Object.entries(localStorage);

  for (let entry in localStorageSave) {
    if (localStorageDontSave.includes(localStorageSave[entry][0])) {
      localStorageSave.splice(entry, 1);
    }
  }

  // Convert the localStorage array to a base64-encoded JSON string
  localStorageSave = btoa(JSON.stringify(localStorageSave));

  // Add the localStorage data to the mainSave object
  mainSave.localStorage = localStorageSave;

  // Get the cookies data and add it to the mainSave object
  cookiesSave = document.cookie;
  cookiesSave = btoa(cookiesSave);
  mainSave.cookies = cookiesSave;

  // Convert the mainSave object to a base64-encoded JSON string
  mainSave = btoa(JSON.stringify(mainSave));

  // Encrypt the mainSave data using AES encryption with the key 'save'
  mainSave = CryptoJS.AES.encrypt(mainSave, 'save').toString();

  // Return the encrypted mainSave data
  return mainSave;
}

// Function to download the main save data as a file
function downloadMainSave() {
  var data = new Blob([getMainSave()]);
  var dataURL = URL.createObjectURL(data);

  var fakeElement = document.createElement('a');
  fakeElement.href = dataURL;
  fakeElement.download = 'games.save';
  fakeElement.click();
  URL.revokeObjectURL(dataURL);
}

// Function to get the main save data from an uploaded file
function getMainSaveFromUpload(data) {
  // Decrypt the uploaded data using AES decryption with the key 'save'
  data = CryptoJS.AES.decrypt(data, 'save').toString(CryptoJS.enc.Utf8);

  // Parse the decrypted data as JSON
  var mainSave = JSON.parse(atob(data));
  var mainLocalStorageSave = JSON.parse(atob(mainSave.localStorage));
  var cookiesSave = atob(mainSave.cookies);

  // Set the items in localStorage using the uploaded data
  for (let item of mainLocalStorageSave) {
    localStorage.setItem(item[0], item[1]);
  }

  // Set the cookies using the uploaded data
  document.cookie = cookiesSave;
}

// Function to handle the file upload
function uploadMainSave() {
  var hiddenUpload = document.querySelector('.hiddenUpload');
  hiddenUpload.click();

  // Listen for the change event on the file input element
  hiddenUpload.addEventListener('change', function (e) {
    var files = e.target.files;
    var file = files[0];
    if (!file) {
      return;
    }

    // Read the contents of the uploaded file as text and call getMainSaveFromUpload with the result
    var reader = new FileReader();

    reader.onload = function (e) {
      getMainSaveFromUpload(e.target.result);

      // Show a success message to the user
      var uploadResult = document.querySelector('.uploadResult');
      uploadResult.innerText = 'Uploaded save!';
      uploadResult.style.display = 'initial';
      setTimeout(function () {
        uploadResult.style.display = 'none';
      }, 3000);
    };

    reader.readAsText(file);
  });
}

// Handle the hii pattern when keys are pressed
var hiiPattern = ['h', 'i', 'i'];
var hiiCurrent = 0;

document.addEventListener('keydown', function (e) {
  if (e.key !== hiiPattern[hiiCurrent]) {
    return (hiiCurrent = 0);
  }

  hiiCurrent++;

  if (hiiPattern.length == hiiCurrent) {
    hiiCurrent = 0;
    document.querySelector('.hii').removeAttribute('hidden');
  }
});