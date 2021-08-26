// this adds site anchors for headers

const page = document.querySelector(".page")
const headers = page.querySelectorAll("h1, h2, h3, h4, h5, h6");

const addPermalink = function() {
  headers.forEach((element) => {
    let anchor = document.createElement('a');
    anchor.href = '#' + element.id;
    anchor.className = "header-link";
    anchor.title = "Permalink";
    anchor.innerHTML = '<span class=\"sr-only\">Permalink</span><i class=\"fas fa-link fa-xs\"></i>';
    anchor.style.margin = "0.25em";
    element.append(anchor);
  })
}

addPermalink();
