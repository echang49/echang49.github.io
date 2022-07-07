document.addEventListener("DOMContentLoaded", init);
function init() {
	new Granim({
		element: "#canvas-image-blending",
		name: "granim",
		elToSetClassOn: "body",
		direction: "diagonal",
		isPausedWhenNotInView: false,
		scrollDebounceThreshold: 300,
		stateTransitionSpeed: 1000,
		image: {
			source: "./assets/bg.jpg",
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

	const burger = document.querySelector(".navbar-hamburger");
	const menu = document.querySelector(".navbar-menu");
	burger.addEventListener("click", toggleNavbar);

	function toggleNavbar() {
		burger.toggleAttribute("open");
		menu.toggleAttribute("open");
	}
}
