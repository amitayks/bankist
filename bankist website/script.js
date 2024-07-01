'use strict';

////////////////////////////////////////////
/*
// Modal window
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const section2 = document.querySelector('#section--2');
const section3 = document.querySelector('#section--3');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const formInput = document.querySelectorAll('.form1');
const navigation = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const header = document.querySelector('.header');

////////////////////////////////////////////
// open floating window //
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

////////////////////////////////////////////
// closing the floating window //
const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
  formInput.forEach(form => {
    form.value = '';
  });
};

////////////////////////////////////////////
// event handlers //
// opening model handler //
btnsOpenModal.forEach(button => button.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

////////////////////////////////////////////
// scroll handler //
btnScrollTo.addEventListener('click', e => {
  section1.scrollIntoView({ behavior: 'smooth' });
});

// document.querySelectorAll('.nav__link').forEach(el => {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();

//     document
//       .querySelector(el.getAttribute('href'))
//       .scrollIntoView({ behavior: 'smooth' });
//   });
// });

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  if (
    e.target.classList.contains('nav__link') &&
    e.target.classList.length === 1
  ) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

tabContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  if (!clicked) return;

  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

/////////////////////////////////////////////////////////
// blurring the links //

const hovering = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;

    const sibling = link.closest('nav').querySelectorAll('.nav__link');

    sibling.forEach(el => {
      if (el !== link) {
        el.style.opacity = this;
      }
    });
  }
};
navigation.addEventListener('mouseover', hovering.bind(0.5));

navigation.addEventListener('mouseout', hovering.bind(1));

/////////////////////////////////////////////////////
// sticky header //
const navSticky = function (entries) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) {
    navigation.classList.add('sticky');
  } else {
    navigation.classList.remove('sticky');
  }
};

const headerObserver = new IntersectionObserver(navSticky, {
  root: null,
  threshold: 0,
  rootMargin: '-90px',
});

headerObserver.observe(header);

/////////////////////////////////////////////////////
// transparent section //
const allSection = document.querySelectorAll('.section');

const transSection = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const transObserver = new IntersectionObserver(transSection, {
  root: null,
  threshold: 0.15,
});

allSection.forEach(section => {
  transObserver.observe(section);
  // section.classList.add('section--hidden');
});

/////////////////////////////////////////////////////
// lazy load image //
const lazyCallback = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const lazyObserver = new IntersectionObserver(lazyCallback, {
  root: null,
  threshold: 0,
  rootMargin: '400px',
});

const images = document.querySelectorAll('img[data-src]');

images.forEach(img => {
  lazyObserver.observe(img);
});

/////////////////////////////////////////////////////
// sliders //
const sliders = function () {
  const slides = document.querySelectorAll('.slide');
  const slider = document.querySelector('.slider');
  const buttonLeft = document.querySelector('.slider__btn--left');
  const buttonRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  // slider.style.transform = 'scale(0.4)';
  // slider.style.overflow = 'visible';

  let curSlide = 0;
  let maxSlide = slides.length;

  const createDots = function () {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-dot="${i}"></button>`
      );
    });
  };

  const dotActivate = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-dot="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
    dotActivate(curSlide);
  };

  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    goToSlide(curSlide);
  };

  const previousSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
  };

  // initial //
  const init = function () {
    createDots();
    goToSlide(0);
    dotActivate(0);
  };
  init();

  // event listener //
  buttonRight.addEventListener('click', nextSlide);
  buttonLeft.addEventListener('click', previousSlide);
  document.addEventListener('keydown', function (e) {
    if (e.code === 'ArrowRight') nextSlide();
    if (e.code === 'ArrowLeft') previousSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const slide = e.target.dataset.dot;
      goToSlide(slide);
      dotActivate(slide);
    }
    // console.log(e);
  });
};
sliders();
*/
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
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
  const openModal = function () {
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
  };

  const closeModal = function () {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');

    modalForm.forEach(form => (form.value = ''));
  };

  btnShowModal.forEach(btn => btn.addEventListener('click', openModal));
  btnCloseModal.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);
};
showMOdalFunc();

/////////////////////////////////////////////////////
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
// transparentSectionFunc();

/////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
/*
const obsCallback = function (entries, observer) {
  console.log(entries.forEach(e => console.log(e)));
  // console.log(observer);

  if (entries.IntersectionRect > 10) {
    console.log('hi');
  }
};

const obsOption = {
  root: null,
  threshold: 0.1,
};

const observer = new IntersectionObserver(obsCallback, obsOption);
observer.observe(section1);

const initial = section1.getBoundingClientRect();
console.log(initial);
window.addEventListener('scroll', function (e) {
  console.log(window.scrollY);

  if (this.window.scrollY > initial.top) navigation.classList.add('sticky');
  else navigation.classList.remove('sticky');
});

/////////////////////////////////////////////////////


const content1 = document.querySelector('.operations__content--1');
const content2 = document.querySelector('.operations__content--2');
const content3 = document.querySelector('.operations__content--3');

const contents = [content1, content2, content3];

const button1 = document.querySelector('.operations__tab--1');
const button2 = document.querySelector('.operations__tab--2');
const button3 = document.querySelector('.operations__tab--3');

const buttons = [button1, button2, button3];
buttons.forEach(but =>
  but.addEventListener('click', function (e) {
    e.preventDefault();

    buttons.forEach(but => but.classList.remove('operations__tab--active'));
    but.classList.add('operations__tab--active');

    contents.forEach(con =>
      con.classList.remove('operations__content--active')
    );

    if (+but.dataset.tab === 1) {
      content1.classList.add('operations__content--active');
    } else if (+but.dataset.tab === 2) {
      content2.classList.add('operations__content--active');
    } else if (+but.dataset.tab === 3) {
      content3.classList.add('operations__content--active');
    }

    // if (+but.dataset.tab === 1) {
    //   buttons.forEach(but => but.classList.remove('operations__tab--active'));
    //   // contents.forEach(con =>
    //   //   con.classList.remove('operations__content--active')
    //   // );
    //   button1.classList.add('operations__tab--active');
    // } else if (+but.dataset.tab === 2) {
    //   button2.classList.add('operations__tab--active');

    //   console.log(but.dataset.tab);
    // } else if (+but.dataset.tab === 3) {
    //   button3.classList.add('operations__tab--active');

    //   console.log(but.dataset.tab);
    // }
  })
);

// going downward: childe elements
const h1 = document.querySelector('h1');
console.log(h1.querySelectorAll('.highlight'));
console.log(h1.childNodes);
console.log(h1.children);
h1.firstElementChild.style.color = 'red';
h1.lastElementChild.style.color = 'blue';

// going upward: parents elements
console.log(h1.parentNode);
console.log(h1.parentElement);

// closest function - fide the parent of the element //
h1.closest('.header').style.background = 'var(--gradient-secondary)';
h1.closest('h1').style.background = 'var(--gradient-primary)';

// going sideway - sibling elements
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

console.log(h1.parentElement.children);
[...h1.parentElement.children].forEach(el => {
  if (el === h1) el.style.transform = 'scale(0.5)';
});
btnScrollTo.addEventListener('click', e => {
  const s1coord = section1.getBoundingClientRect();
  console.log(s1coord.left, ':', s1coord.top);

  // console.log(e.target.getBoundingClientRect());

  console.log('current scroll (x/y) ', window.pageXOffset, window.pageYOffset);

  console.log(
    'height width viewport',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );
  // window.scrollTo(
  //   s1coord.left + window.pageXOffset,
  //   s1coord.top + window.pageYOffset
  // );

  // window.scrollTo({
  //   left: s1coord.left + window.pageXOffset,
  //   top: s1coord.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  section1.scrollIntoView({ behavior: 'smooth' });
});

// rgb(255, 255, 255)
const randomINeger = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const randColor = (min, max) =>
  `rgb(${randomINeger(min, max)}, ${randomINeger(min, max)}, ${randomINeger(
    min,
    max
  )})`;

console.log(randColor(0, 255));

document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randColor(0, 255);
  console.log(e.target);

  // e.stopPropagation();
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randColor(0, 255);
  // e.stopPropagation();
});

document.querySelector('nav').addEventListener(
  'click',
  function (e) {
    this.style.backgroundColor = randColor(0, 255);
  },
  false
);
const h1 = document.querySelector('h1');

const h1Alert = function () {
  alert('addEventListener');

  h1.removeEventListener('mouseenter', h1Alert);
};

h1.addEventListener('mouseenter', h1Alert);

h1.onmouseenter = () => {
  alert('onMouseEnter');
};

// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);

const header = document.querySelector('.header');
// console.log(header);

const section = document.querySelectorAll('.section');
// console.log(section);

const idSection = document.getElementById('section--1');
// console.log(idSection);

const allButton = document.getElementsByTagName('button');
// console.log(allButton);

const cssSelector = document.getElementsByClassName('btn');
// console.log(cssSelector);

const message = document.createElement('div');
message.classList.add('cookie--message');

// message.textContent = '';
// message.innerHTML =
//   'We use cookied for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';

message.innerHTML =
  'We use cookied for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';

// header.prepend(message);
header.append(message);
// header.before(message);
// header.after(message);

// cloning html element //
// header.prepend(message.cloneNode(true));

document.querySelector('.btn--close-cookie').addEventListener('click', () => {
  message.remove();
});

// style
message.style.backgroundColor = '#37383d';
message.style.width = '110%';

console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).height);

message.style.height =
  Number.parseFloat(getComputedStyle(message).height) + 40 + 'px';

message.style.alignContent = 'center';

document.documentElement.style.setProperty('--color-primary', 'orangered');

const logo = document.querySelector('.nav__logo');

console.log(logo.alt);
console.log(logo.className);

logo.alt = 'very beautiful';

console.log(logo.designer);
console.log(logo.getAttribute('designer'));
logo.setAttribute('company', 'keisar');

console.log(logo.src);
console.log(logo.getAttribute('src'));

const link = document.querySelector('.twitter-link');

console.log(link.getAttribute('href'));
console.log(link.href);

console.log(logo.dataset.versionApp);

// logo.classList.add('btn');
logo.classList.remove('v');
logo.classList.toggle('v');
logo.classList.contains('v');
*/
