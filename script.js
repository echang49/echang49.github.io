class TypeWriter {
  constructor(txtElement, words, wait = 3000) {
    this.txtElement = txtElement;
    this.words = words;
    this.txt = "";
    this.wordIndex = 0;
    this.wait = parseInt(wait, 10);
    this.type();
    this.isDeleting = false;
  }

  type() {
    const current = this.wordIndex % this.words.length;
    const fullTxt = this.words[current];
    if (this.isDeleting) {
      this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
      this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    this.txtElement.innerHTML = `<span class="txt">${this.txt}</span>`;

    let typeSpeed = 150;

    if (this.isDeleting) {
      typeSpeed = 90;
    }

    if (!this.isDeleting && this.txt === fullTxt) {
      typeSpeed = this.wait;
      this.isDeleting = true;
    } else if (this.isDeleting && this.txt === "") {
      this.isDeleting = false;
      this.wordIndex++;
      typeSpeed = 150;
    }

    setTimeout(() => this.type(), typeSpeed);
  }
}
document.addEventListener("DOMContentLoaded", init);

function init() {
  const txtElement = document.querySelector(".txt-type");
  const words = JSON.parse(txtElement.getAttribute("data-words"));
  const wait = txtElement.getAttribute("data-wait");
  new TypeWriter(txtElement, words, wait);

  declareGarmin();
}

window.onresize = changeSize;
window.onload = changeSize;
function changeSize() {
  let aboutWidth = document.getElementById("aboutMe").clientWidth;
  let professionalWidth = document.getElementById("professionalExperience");
  let academicWidth = document.getElementById("education");
  let portfolioWidth = document.getElementById("portfolio");
  professionalWidth.style.width = aboutWidth.toString().concat("px");
  academicWidth.style.width = aboutWidth.toString().concat("px");
  portfolioWidth.style.width = aboutWidth.toString().concat("px");
}

function declareGarmin() {
  return new Granim({
    element: "#canvas-image-blending",
    name: "granim",
    elToSetClassOn: "body",
    direction: "diagonal",
    isPausedWhenNotInView: false,
    scrollDebounceThreshold: 300,
    stateTransitionSpeed: 1000,
    image: {
      source: "./assets/bg.jpg",
      position: ["center", "bottom"],
      stretchMode: ["stretch", "stretch"],
      blendingMode: "multiply",
    },
    states: {
      "default-state": {
        gradients: [
          ["rgba(197, 211, 247, 1)", "rgba(197, 235, 235, 1)"],
          ["rgba(64, 41, 181, .8)", "rgba(204, 208, 255, 1)"],
          ["rgba(28, 18, 81, .95)", "rgba(98, 89, 178, .95)"],
          ["rgba(23, 23, 33, .90)", "rgba(28, 18, 81, .95)"],
          ["rgba(17, 14, 33, .85)", "rgba(33, 33, 53, .80)"],
          ["rgba(25, 17, 178, .8)", "rgba(28, 18, 81, .85)"],
          ["rgba(126, 124, 175, 1)", "rgba(25, 17, 178, .80)"],
          ["rgba(255, 58, 96, .7)", "rgba(255, 155, 158, .6)"],
          ["rgba(255, 125, 33, .5)", "rgba(255, 102, 104, .5)"],
          ["rgba(150, 255, 178, .5)", "rgba(200, 240, 150, .5)"],
          ["rgba(198, 181, 255, 1)", "rgba(205, 232, 252, 1)"],
        ],
        transitionSpeed: 3000,
        loop: true,
      },
    },
  });
}
