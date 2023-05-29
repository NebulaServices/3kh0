(function () {
    const { search, pathname } = window.location;
    const urlParams = new URLSearchParams(search);
    const gameSubpath = urlParams.get("game");
    const origin = localStorage.getItem("instance");
    const cdn = localStorage.getItem("cdn");
    const instance = origin.replace(location.origin, "");
  
    if (!origin || !cdn) {
      window.location.href = `../?onload=window.location.href='${pathname}${search}'`;
    }
  
    if (gameSubpath && origin) {
      fetch("./json/games.json")
        .then((res) => res.json())
        .then((games) => {
          const game = games.find((g) => g.root === gameSubpath);
          if (game) {
            const { name, root, img, file } = game;
            document.title = `Play ${name} | 3kh0`;
            window.history.pushState({}, "", `${origin}games/${gameSubpath}`);
            document.querySelector("#game").textContent = name;
            document.querySelector(".loader").innerHTML = `<img src="${cdn}${root}/${img}" class="game_img" loading="lazy" onerror="this.src='/assets/globe.svg'"/>`;
            document.querySelector("#startgame").classList.remove("hidden");
  
            const startGameHandler = (e) => {
              document.body.innerHTML = `
                <iframe frameborder="0" src="${cdn}${root}/${file}" onerror="document.write('Could not load game');console.error('The game encountered an error.');" onload="document.querySelector('.overlay').remove();"></iframe>
                <div class="overlay">
                  <div class="loader center">
                    <span class="spinner">
                      <svg viewBox="22 22 44 44">
                        <circle class="spinnerSvg" cx="44" cy="44" r="20.2" fill="none" stroke-width="3.6"></circle>
                      </svg>
                    </span>
                  </div>
                </div>
              `;
            };
  
            document.querySelector("#startgame").addEventListener("click", startGameHandler);
          } else {
            console.error(`The game "${gameSubpath}" was not found.`);
          }
        })
        .catch((e) => {
          console.error(e);
        });
    } else {
      console.error("Could not load game");
      if (!origin) {
        console.error("The origin of the instance could not be found");
      }
      if (!gameSubpath) {
        console.error("The game was not provided");
      }
    }
  
    if (window.top === window.self) {
      window.location.href = document.referrer || "../";
    }
  
    function getColorValues(hexcolor) {
      const r = parseInt(hexcolor.substr(1, 2), 16);
      const g = parseInt(hexcolor.substr(3, 2), 16);
      const b = parseInt(hexcolor.substr(5, 2), 16);
      const yiq = (r * 299 + g * 587 + b * 114) / 1000;
      return {
        contrast: yiq >= 128 ? "#1c1c1c" : "white",
        text: yiq >= 128 ? "white" : "black"
      };
    }
  
    const theme = localStorage.getItem("theme");
  
    if (!theme) {
      document.body.setAttribute("theme", "default");
    } else if (theme !== "custom") {
      document.body.setAttribute("theme", theme);
    } else if (theme === "custom") {
      const customTheme = localStorage.getItem("theme_color");
      document.body.setAttribute("theme", "custom");
      const { contrast, text } = getColorValues(customTheme);
      document.body.style = `--theme: ${customTheme}; --background: ${contrast}; --text: ${text}; --text-secondary: ${text};`;
  
      if (location.pathname.includes("/settings")) {
        document.querySelector("#theme_color").value = customTheme;
      }
    }
  })();
  