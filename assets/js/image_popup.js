// this script pops up images

// const page = document.querySelector(".page");
// imported from anchor.js
const images = page.querySelectorAll("img");

const createImageDiv = function() {
  let outerDiv = document.createElement('div');
  outerDiv.className = "blog__image";
  return outerDiv;
}

const eventFunction = function(event) {
  // let clickedObject = event.target.querySelector("img");
  let clickedObject = event.target.parentNode;
  console.log(clickedObject);
  if (clickedObject.className === "blog__image") {
    clickedObject.className = "blog__image--fullscreen";
  } else if (clickedObject.className === "blog__image--fullscreen") {
    clickedObject.className = "blog__image";
  }
};

const addClass = function() {
  images.forEach((element) => {
    let imgDiv = createImageDiv();
    let parent = element.parentNode;
    parent.appendChild(imgDiv);
    imgDiv.appendChild(element);
  })
}

addClass();
document.addEventListener('click', eventFunction);
