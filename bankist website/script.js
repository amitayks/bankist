'use strict';

// web selectors //
const header = document.querySelector('.header');
const section1 = document.querySelector('#section--1');
const section2 = document.querySelector('#section--2');
const section3 = document.querySelector('#section--3');
const btnShowModal = document.querySelectorAll('.btn--show-modal');
const btnCloseModal = document.querySelector('.btn--close-modal');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const modalForm = document.querySelectorAll('.form1');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const navLinks = document.querySelectorAll('.nav__link');
const nav = document.querySelector('.nav');

/////////////////////////////////////////////////////
const showMOdalFunc = function () {
  // function that open the floating modal to register //
  const openModal = function () {
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
  };

  // function that close the floating modal to register //
  const closeModal = function () {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');

    modalForm.forEach(form => (form.value = ''));
  };

  // the event listeners to open the register modal //
  btnShowModal.forEach(btn => btn.addEventListener('click', openModal));
  btnCloseModal.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);
};
showMOdalFunc();

/////////////////////////////////////////////////////
// function to active the links in the header //
const scrollToFunc = function () {
  btnScrollTo.addEventListener('click', function (e) {
    section1.scrollIntoView({ behavior: 'smooth' });
  });

  navLinks.forEach(el =>
    el.addEventListener('click', function (e) {
      e.preventDefault();

      if (el.classList.length === 1)
        document
          .querySelector(el.getAttribute('href'))
          .scrollIntoView({ behavior: 'smooth' });
    })
  );
};
scrollToFunc();

/////////////////////////////////////////////////////
// function that make the un-hover link to fade //
const linkTransparentFunc = function () {
  const hover = function (e) {
    if (e.target.classList.contains('nav__link')) {
      const link = e.target;
      const sibling = link.closest('nav').querySelectorAll('.nav__link');

      sibling.forEach(el => {
        if (link !== el) {
          el.style.opacity = this;
        }
      });
    }
  };

  nav.addEventListener('mouseover', hover.bind(0.5));
  nav.addEventListener('mouseout', hover.bind(1));
};
linkTransparentFunc();

/////////////////////////////////////////////////////
// function that make the header stay in place if scroll from header //
const stickyFunc = function () {
  const headerSticky = function (entries) {
    const [entry] = entries;

    if (!entry.isIntersecting) {
      nav.classList.add('sticky');
    } else {
      nav.classList.remove('sticky');
    }
  };

  const option = {
    root: null,
    threshold: 0,
    rootMargin: '-90px',
  };
  const headerObserver = new IntersectionObserver(headerSticky, option);

  headerObserver.observe(header);
};
stickyFunc();

/////////////////////////////////////////////////////
// function that fade in the section as you scroll //
const transparentSectionFunc = function () {
  const observeTrans = function (entries) {
    const [entry] = entries;

    if (entry.isIntersecting) {
      entry.target.classList.remove('hidden');
      sectionObserver.unobserve(entry.target);
    }
  };

  const sectionObserver = new IntersectionObserver(observeTrans, {
    root: null,
    threshold: 0.3,
  });

  const sections = document.querySelectorAll('.section');

  sections.forEach(sec => sec.classList.add('hidden'));
  sections.forEach(sec => sectionObserver.observe(sec));
};
transparentSectionFunc();

/////////////////////////////////////////////////////
// function that fade in the image on the page for lazyLoading //
// better for performance //
const lazyLOadFunc = function () {
  const imgs = document.querySelectorAll('.lazy-img');

  const callBack = function (entries) {
    const [entry] = entries;

    if (!entry.isIntersecting) return;

    entry.target.classList.remove('lazy-img');
    entry.target.src = entry.target.dataset.src;
    lazyImgObserver.unobserve(entry.target);
  };

  const lazyImgObserver = new IntersectionObserver(callBack, {
    root: null,
    threshold: 0,
    rootMargin: '300px',
  });

  imgs.forEach(img => lazyImgObserver.observe(img));
};
lazyLOadFunc();

/////////////////////////////////////////////////////
// functionality for the tabs to switch //
const popButtonFunc = function () {
  const tabContainer = document.querySelector('.operations__tab-container');
  const operationsTabs = document.querySelectorAll('.operations__tab');
  const operationsContent = document.querySelectorAll('.operations__content');

  tabContainer.addEventListener('click', function (e) {
    const clicked = e.target.closest('.operations__tab');
    const content = document.querySelector(
      `.operations__content--${clicked.dataset.tab}`
    );

    operationsTabs.forEach(tab => {
      tab.classList.remove('operations__tab--active');
      clicked.classList.add('operations__tab--active');
    });

    operationsContent.forEach(cont => {
      cont.classList.remove('operations__content--active');
    });
    content.classList.add('operations__content--active');
  });
};
popButtonFunc();

/////////////////////////////////////////////////////
// make the slider active by different operators //
const sliderFunc = function () {
  const sliders = document.querySelectorAll('.slide');
  const buttonLeft = document.querySelector('.slider__btn--left');
  const buttonRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  const createDots = function () {
    sliders.forEach((_, i) => {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };
  createDots();

  const dots = document.querySelectorAll('.dots__dot');
  dotContainer.addEventListener('click', function (e) {
    const dot = e.target.closest('.dots__dot');

    goToSlide(dot.dataset.slide);
  });

  const highDot = function (dotNum) {
    const dot = document.querySelector(`.dots__dot[data-slide="${dotNum}"]`);
    dots.forEach(d => {
      d.classList.remove('dots__dot--active');
    });
    dot.classList.add('dots__dot--active');
  };
  highDot(0);

  const goToSlide = function (slide) {
    sliders.forEach((sl, i) => {
      sl.style.transform = `translateX(${100 * (i - slide)}%)`;
    });
    highDot(slide);
  };
  goToSlide(0);

  const goLeft = function () {
    if (curSlide === maxSlide) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
  };

  const goRight = function () {
    if (curSlide === 0) {
      curSlide = maxSlide;
    } else {
      curSlide--;
    }

    goToSlide(curSlide);
  };
  let curSlide = 0;
  const maxSlide = sliders.length - 1;

  buttonRight.addEventListener('click', goLeft);
  buttonLeft.addEventListener('click', goRight);
  window.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') {
      goRight();
    } else if (e.key === 'ArrowRight') {
      goLeft();
    }
  });
};
sliderFunc();
