"use strict";
(function() {
  let openButton = document.querySelector(".open-button");
  let tl0 = gsap.timeline({ paused: true });
  let tl = gsap.timeline({ paused: true });

  let slider = new Slider(document.querySelector(".slider-wrapper"));
  tl0
    .to(".slider__item .slider__part", 0.8, {
      y: "100%",
      stagger: {
        grid: [3, 3],
        from: "end",
        each: 0.15,
        axis: "x",
        ease: Power3.easeInOut
      },
      onComplete: () => slider.changeSlide("next")
    })
    .to(".animate-title", 1.2, {
      y: 0,
      ease: Power2.easeOut
    })
    .to(
      ".animate-to-store",
      0.5,
      {
        opacity: 1,
        ease: Power2.easeOut,
        onComplete: function() {
          tl.play();
        }
      },
      "-=0.5"
    );

  tl.to(".animate-bg", 1.5, {
    width: "59%",
    ease: Power2.easeInOut
  })
    .to(
      ".animate-slide",
      1.5,
      { width: "60%", ease: Power2.easeInOut },
      "-=1.5"
    )
    .to(".animate-bg-img", 1.5, { x: "-30%", ease: Power2.easeInOut }, "-=1.5")
    .to(
      ".animate-slide-img",
      1.5,
      {
        x: "-10%",
        width: "112%",
        ease: Power2.easeInOut
      },
      "-=1.5"
    )
    .to(
      ".animate-like",
      0.8,
      {
        scale: 1,
        opacity: 1,
        ease: Back.easeOut.config(1.7)
      },
      "-=0.3"
    )
    .to(
      ".animate-linked-by",
      0.8,
      {
        opacity: 1,
        ease: Power2.easeInOut
      },
      "-=0.6"
    )
    .to(
      ".animate-user-pic",
      0.5,
      {
        opacity: 1,
        stagger: 0.1,
        ease: Power3.easeOut
      },
      "-=0.4"
    )
    .to(
      ".animate-user-pic",
      0.3,
      {
        y: 0,
        stagger: 0.1,
        ease: Power2.easeInOut
      },
      "-=0.5"
    );

  function toggleTween(tween) {
    tween.reversed() ? tween.play() : tween.reverse();
  }

  document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => tl0.play(), 1000);
  });

  openButton.addEventListener("click", () => {
    toggleTween(tl);
  });
})();
