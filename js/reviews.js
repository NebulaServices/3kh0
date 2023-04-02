/*
Hello epic hacker (maybe skid) you are looking at one of the many scripts that powers the site,
this script has extra comments and info to help you understand what is going on.

This JavaScript code retrieves a container element from the HTML with the ID "my-keen-slider",
fetches review data from a JSON file, shuffles the order of the reviews,
groups the reviews into subarrays of length 3, and adds "placeholder" reviews to fill out the last group if it has fewer than 3 reviews.

It then iterates over each group of reviews, creates new HTML elements to hold the reviews and their information,
and adds them to the container element.

Finally, it creates navigation buttons for the container element and adds them to the HTML,
using a KeenSlider library to create the navigation functionality.
Overall, this code generates a slideshow of randomized reviews with navigation buttons.
*/
// This is an asynchronous function that will be executed immediately
(async () => {
  // Get the element with the ID "my-keen-slider" and assign it to a variable
  var reviewsElement = document.getElementById("my-keen-slider");

  // Fetch the JSON data from the specified URL and wait for the response
  var reviewsData = await fetch("./assets/json/reviews.json");
  var reviews = await reviewsData.json();

  // Shuffle the reviews array
  for (let i = reviews.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [reviews[i], reviews[j]] = [reviews[j], reviews[i]];
  }

  // Group the shuffled reviews into groups of three
  var reviewsGroups = reviews.reduce((r, e, i) => (i % 3 ? r[r.length - 1].push(e) : r.push([e])) && r, []);

  // If there is a last review group, add placeholders to make it a group of three
  var lastReviewGroup = reviewsGroups[reviewsGroups.length - 1];
  if (lastReviewGroup) {
    if (lastReviewGroup.length == 1) {
      lastReviewGroup.push({
        placeholder: true,
      });
      lastReviewGroup.push({
        placeholder: true,
      });
    }
    if (lastReviewGroup.length == 2) {
      lastReviewGroup.push({
        placeholder: true,
      });
    }
  }

  // Loop through the review groups and create HTML elements for each group
  for (let reviewsGroup in reviewsGroups) {
    var newSlide = document.createElement("div");
    newSlide.className = "keen-slider__slide number-slide" + Number(Number(reviewsGroup) + 1);

    var reviewContainer = document.createElement("div");
    reviewContainer.className = "review-container";

    for (let review of reviewsGroups[reviewsGroup]) {
      // If the review is a placeholder, create an element with a different class name
      if (!review.placeholder) {
        var newReview = document.createElement("div");
        newReview.className = "review";

        var reviewImg = document.createElement("img");
        reviewImg.className = "review-img";
        reviewImg.src = localStorage.getItem('cdn') + review.img;
        newReview.appendChild(reviewImg);

        var reviewName = document.createElement("div");
        reviewName.className = "review-name";
        reviewName.innerText = review.name;
        newReview.appendChild(reviewName);

        var reviewContent = document.createElement("div");
        reviewContent.className = "review-content";
        reviewContent.innerText = review.review;
        newReview.appendChild(reviewContent);
      } else {
        var newReview = document.createElement("div");
        newReview.className = "review-placeholder";
      }

      reviewContainer.appendChild(newReview);
    }

    newSlide.appendChild(reviewContainer);

    reviewsElement.appendChild(newSlide);
  }

  // Define a function called "navigation" that takes a "slider" parameter
  function navigation(slider) {
    // Declare some variables used by the navigation
    let wrapper, dots, arrowLeft, arrowRight;

    // Define a function called "markup" that creates and removes the navigation elements
    function markup(remove) {
      wrapperMarkup(remove);
      dotMarkup(remove);
      arrowMarkup(remove);
    }

    // Define a function called "removeElement" that removes an element from the DOM
    function removeElement(elment) {
      elment.parentNode.removeChild(elment);
    }

    // Define a function called "createDiv" that creates a new <div> element with the specified class name
    function createDiv(className) {
      var div = document.createElement("div");
      var classNames = className.split(" ");
      classNames.forEach((name) => div.classList.add(name));
      return div;
    }

    // Define a function called "arrowMarkup" that creates or removes the arrow elements
    function arrowMarkup(remove) {
      if (remove) {
        removeElement(arrowLeft);
        removeElement(arrowRight);
        return;
      }

      arrowLeft = createDiv("arrow arrow--left");
      arrowLeft.addEventListener("click", () => slider.prev());

      arrowRight = createDiv("arrow arrow--right");
      arrowRight.addEventListener("click", () => slider.next());

      wrapper.appendChild(arrowLeft);
      wrapper.appendChild(arrowRight);
    }

    // Define a function called "wrapperMarkup" that creates or removes the wrapper element
    function wrapperMarkup(remove) {
      if (remove) {
        var parent = wrapper.parentNode;
        while (wrapper.firstChild) parent.insertBefore(wrapper.firstChild, wrapper);
        removeElement(wrapper);
        return;
      }

      wrapper = createDiv("navigation-wrapper");
      document.getElementById("reviews").appendChild(wrapper);
      wrapper.appendChild(slider.container);
    }

    // Define a function called "dotMarkup" that creates or removes the dot elements
    function dotMarkup(remove) {
      if (remove) {
        removeElement(dots);
        return;
      }

      dots = createDiv("dots");
      slider.track.details.slides.forEach((_e, idx) => {
        var dot = createDiv("dot");
        dot.addEventListener("click", () => slider.moveToIdx(idx));
        dots.appendChild(dot);
      });
      wrapper.appendChild(dots);
    }

    // Define a function called "updateClasses" that updates the classes of the navigation elements
    function updateClasses() {
      var slide = slider.track.details.rel;
      slide === 0 ? arrowLeft.classList.add("arrow--disabled") : arrowLeft.classList.remove("arrow--disabled");
      slide === slider.track.details.slides.length - 1 ? arrowRight.classList.add("arrow--disabled") : arrowRight.classList.remove("arrow--disabled");
      Array.from(dots.children).forEach(function (dot, idx) {
        idx === slide ? dot.classList.add("dot--active") : dot.classList.remove("dot--active");
      });
    }

    // Add event listeners to the slider and update the navigation when the slider changes
    slider.on("created", () => {
      markup();
      updateClasses();
      document.getElementById("reviews").style.visibility = "initial";
    });
    slider.on("optionsChanged", () => {
      markup(true);
      markup();
      updateClasses();
    });
    slider.on("slideChanged", () => {
      updateClasses();
    });
    slider.on("destroyed", () => {
      markup(true);
    });
  }

  // Create a new KeenSlider instance with the specified options and navigation function
  var slider = new KeenSlider("#my-keen-slider", {}, [navigation]);
})();
