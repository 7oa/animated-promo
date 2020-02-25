"use strict";

(function() {
  let slider = sliderEl => {
    let slider = sliderEl.querySelector(".slider");
    let sliderItem = slider.querySelectorAll(".slider__item");
    let nextSlide = sliderEl.querySelector(".next");
    let prevSlide = sliderEl.querySelector(".prev");
    let slideCount = sliderItem.length;

    sliderItem.forEach(el => {
      let img = el.querySelector("img");
      img.remove();
      let fragment = new DocumentFragment();
      for (let i = 1; i <= 3; i++) {
        let div = document.createElement("div");
        div.className = `slider__part slider__part${i}`;
        div.append(img.cloneNode());
        fragment.append(div);
      }
      el.append(fragment);
    });

    let sliderPart1 = slider.querySelectorAll(".slider__part1");
    let sliderPart2 = slider.querySelectorAll(".slider__part2");
    let sliderPart3 = slider.querySelectorAll(".slider__part3");

    let movePart = (el, value, transition = false) => {
      el.forEach(el => {
        el.style.transform = `translateY(${value})`;
        el.style.transition = transition
          ? `1s cubic-bezier(.68,.03,.24,1.05)`
          : ``;
      });
    };

    let moveLastEl = (direction, el) => {
      let lastEl = direction === "next" ? el[slideCount - 1] : el[0];
      lastEl.remove();
      if (direction === "next") slider.prepend(lastEl);
      if (direction === "prev") slider.append(lastEl);
      movePart(sliderPart1, "0%");
      movePart(sliderPart2, "0%");
      movePart(sliderPart3, "0%");
    };

    let changeSlide = direction => {
      let translateVal = direction === "next" ? "100%" : "-100%";
      sliderItem = document.querySelectorAll(".slider__item");
      setTimeout(() => movePart(sliderPart1, translateVal, true), 190);
      setTimeout(() => movePart(sliderPart2, translateVal, true), 120);
      setTimeout(() => movePart(sliderPart3, translateVal, true), 0);
      setTimeout(() => moveLastEl(direction, sliderItem), 1000);
    };

    if (nextSlide)
      nextSlide.addEventListener("click", () => changeSlide("next"));
    if (prevSlide)
      prevSlide.addEventListener("click", () => changeSlide("prev"));
  };

  slider(document.querySelector(".slider-wrapper"));
})();
