document.addEventListener("DOMContentLoaded", init);
function init() {
	new Granim({
		element: "#canvas-granim",
		direction: "diagonal",
		isPausedWhenNotInView: false,
		states: {
			"default-state": {
				gradients: [
					["#c5d3f7", "#c5ebeb"],
					["#4029b5", "#ccd0ff"],
					["#1c1251", "#6259b2"],
					["#171721", "#1c1251"],
					["#110e21", "#212135"],
					["#1911b2", "#1c1251"],
					["#7e7caf", "#1911b2"],
					["#ff3a60", "#ff9b9e"],
					["#ff7d21", "#ff6668"],
					["#96ffb2", "#c8f096"],
					["#c6b5ff", "#cde8fc"],
				],
				transitionSpeed: 3000,
				loop: true,
			},
		},
	});

	const burger = document.querySelector(".navbar-hamburger");
	const menu = document.querySelector(".navbar-menu");
	burger.addEventListener("click", toggleNavbar);

	function toggleNavbar() {
		if (burger.hasAttribute("open")) {
			burger.setAttribute("aria-expanded", false);
			burger.removeAttribute("open");
			menu.removeAttribute("open");
		} else {
			burger.setAttribute("aria-expanded", true);
			burger.setAttribute("open", "");
			menu.setAttribute("open", "");
		}
	}
}
