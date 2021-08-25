// this controls the follow button among other things for the sidebar

// follow button object
const followButton = document.querySelector("button.follow_button");
// author links object
const authorURLS = document.querySelector("ul.social_icons--active");
// get screen width so links isn't displayed by default
const screenWidth = window.screen.width;

const buttonClick = function() {
  let authorClass = authorURLS.getAttribute('class');
  if (authorClass == "social_icons--inactive") {
    authorURLS.setAttribute('class', 'social_icons--active');
  } else if (authorClass == "social_icons--active") {
    authorURLS.setAttribute('class', 'social_icons--inactive');
  }
}

// the button.follow_button class in author_urls
followButton.addEventListener('click', function(event) {
  buttonClick();
});

const checkWidth = function() {
  // if our screen is small, make sure the follow links aren't visible
  if (screenWidth <= 1100) {
    authorURLS.setAttribute('class', 'social_icons--inactive');
  }
}

window.onload = function() {
  checkWidth();
}
