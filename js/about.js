/*
Hello epic hacker (maybe skid) you are looking at one of the many scripts that powers the site,
this script has extra comments and info to help you understand what is going on.

This script fetches version information from two JSON files and displays the current version and a warning message
if the user is not on the latest released version.
*/

// An asynchronous function is defined and immediately invoked.
(async () => {
  // The 'version' and 'version-warning' elements are assigned to variables.
  var version = document.getElementById("version");
  var versionWarning = document.getElementById("version-warning");

  // Two variables are defined to hold version information.
  var currentVersion;
  var latestVersion;

  // A fetch request is made to a local 'info.json' file to get the current version information.
  try {
    var infoFetch = await fetch(location.origin + "./assets/json/info.json");
    try {
      var infoResult = await infoFetch.json();
      // If the current version information is available in the JSON file, it is assigned to the 'currentVersion' variable.
      if (infoResult.version) {
        currentVersion = infoResult.version;
      }
    } catch {}
  } catch {}

  // A fetch request is made to a remote 'info.json' file to get the latest version information.
  try {
    var infoFetch = await fetch("https://raw.githack.com/3kh0/3kh0.github.io/main/assets/json/info.json");
    try {
      var infoResult = await infoFetch.json();
      // If the latest version information is available in the JSON file, it is assigned to the 'latestVersion' variable.
      if (infoResult.version) {
        latestVersion = infoResult.version;
      }
    } catch {}
  } catch {}

  // The 'version' element is updated with the current version information, if available.
  if (currentVersion) {
    version.innerText = "You are on version " + currentVersion;
  } else {
    version.innerText = "Cannot get current version.";
  }

  // Messages are defined for different scenarios where the user is not on the latest released version.
  var oldMessage = "Warning: You are on a older version. The current version is %VERSION%";
  var betaMessage = "You are on a pre-release version! The current release is %VERSION%";
  var otherMessage = "You not on the currently released version. The current release is %VERSION%";

  // If the latest version information is available and the current version is not the latest, a warning message is displayed to the user.
  if (latestVersion && currentVersion !== latestVersion) {
    // The version numbers are extracted from the version information and converted to a comparable format.
    var latestVersionNumber = latestVersion.replace("v", "").replaceAll("-", ".");
    var firstStr = latestVersionNumber.search(/\./) + 1;
    latestVersionNumber = Number(latestVersionNumber.substr(0, firstStr) + latestVersionNumber.slice(firstStr).replace(/\./g, ""));

    var currentVersionNumber = currentVersion.replace("v", "").replaceAll("-", ".");
    var firstStr2 = currentVersionNumber.search(/\./) + 1;
    currentVersionNumber = Number(currentVersionNumber.substr(0, firstStr2) + currentVersionNumber.slice(firstStr2).replace(/\./g, ""));

    var message;

    // Depending on the version comparison, a message is selected from the previously defined messages.
    if (isNaN(latestVersionNumber) || isNaN(currentVersionNumber)) {
      message = otherMessage;
    } else {
      if (currentVersionNumber > latestVersionNumber) {
        message = betaMessage;
      } else {
        message = oldMessage;
      }
    }

    // The 'version-warning' element is updated with the warning message and displayed.
    versionWarning.innerText = betaMessage.replace("%VERSION%", latestVersion);
    versionWarning.style.display = "block";
  }
})();