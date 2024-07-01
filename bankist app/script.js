'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Amitay Keisar',
  movements: [2594.3, 5243.54, -3435, 583.5, 500, -243, -5489.3, 2344],
  interestRate: 2,
  pin: 3333,

  movementsDates: [
    '2023-10-26T12:01:20.894Z',
    '2023-11-25T18:49:59.371Z',
    '2023-12-10T14:43:26.374Z',
    '2024-01-05T16:33:06.386Z',
    '2024-02-25T14:18:46.235Z',
    '2024-06-08T06:04:23.907Z',
    '2024-06-13T11:00:41.437Z',
    '2024-06-14T11:14:06.364Z',
  ],
  currency: 'ILS',
  locale: 'he-IL',
};

const accounts = [account1, account2, account3];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

// calculating 'past day from new' to movements //
/////////////////////////////////////////////////
const calcDaysPast = date2 => {
  return Math.abs(new Date() - date2) / (1000 * 60 * 60 * 24);
};

// displaying the dates on the movements //
/////////////////////////////////////////////////
const formattingMoveDate = (acc, date) => {
  // console.log(calcDaysPast(now, date));

  const dayPast = Math.round(calcDaysPast(date));
  if (dayPast === 0) return `today`;
  if (dayPast === 1) return `yesterday`;
  if (dayPast <= 7) return `${dayPast} days ago`;

  return new Intl.DateTimeFormat(acc.locale).format(date);
};

// calculating the currency //
/////////////////////////////////////////////////
const CalcCurrency = (acc, money) => {
  return new Intl.NumberFormat(acc.locale, {
    style: 'currency',
    currency: acc.currency,
  }).format(money);
};

// displaying the movements in the UI //
/////////////////////////////////////////////////
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formattingMoveDate(acc, date);

    const money = CalcCurrency(acc, Math.abs(mov.toFixed(2)));

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${money}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// displaying the balance in the UI //
/////////////////////////////////////////////////
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  const balance = CalcCurrency(acc, acc.balance.toFixed(2));
  labelBalance.textContent = balance;
};

// calculating the summery //
/////////////////////////////////////////////////
const calcDisplaySummary = function (acc) {
  const income = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = CalcCurrency(acc, income.toFixed(2));

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumOut.textContent = CalcCurrency(acc, Math.abs(out).toFixed(2));

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = CalcCurrency(
    acc,
    Math.trunc(interest).toFixed(2)
  );
};

// creating the user name in the account object //
/////////////////////////////////////////////////
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

// updating the UI //
/////////////////////////////////////////////////
const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);

  // set timer to log out
  if (timer) clearInterval(timer);
  timer = setTimerOut();
};

// using api date //

// const option1 = {
//   weekday: 'long',
//   year: 'numeric',
//   month: 'numeric',
//   day: 'numeric',
//   hour: 'numeric',
//   minute: 'numeric',
//   // second: 'numeric',
// };

// const option2 = {
//   dateStyle: 'full',
//   timeStyle: 'long',
//   timeZone: 'israel',
// };

// const local = navigator.language;
// console.log(local);

// const now = new Date();
// const dateFor = new Intl.DateTimeFormat(local, option1).format(now);
// labelDate.textContent = dateFor;

const setTimerOut = function () {
  const tick = function () {
    // set the time and secondes
    const min = `${Math.trunc(time / 60)}`.padStart(2, 0);
    const sec = `${time % 60}`.padStart(2, 0);

    // re-write the timer
    labelTimer.textContent = `${min}:${sec}`;

    // checking if the timer reached 0
    if (time === 0) {
      clearInterval(timer);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = 'Log in to grt started';
    }
    // decrease the time by 1
    time--;
  };
  // set time out
  let time = 10;

  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};
// return timer
// fake entering //
// currentAccount = account3;
// containerApp.style.opacity = 1;
// updateUI(currentAccount);

// Event handlers
let currentAccount, timer;
// login to the account //
///////////////////////////////////////
btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;

    // implanting the custom date
    const option = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    };

    const now = new Date();

    labelDate.textContent = Intl.DateTimeFormat(
      currentAccount.locale,
      option
    ).format(now);

    labelDate.style.color = '#444';
    containerApp.style.opacity = 1;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Update UI
    updateUI(currentAccount);
  }
});

// transfer mony to other account //
/////////////////////////////////////////////////
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(inputTransferAmount.value);
  // const amount = +(+inputTransferAmount.value).toFixed(0);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    currentAccount.movementsDates.push(new Date().toISOString());

    receiverAcc.movements.push(amount);
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);
  }
});

// taking a loan from the bank //
/////////////////////////////////////////////////
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = +(+inputLoanAmount.value).toFixed(0);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(() => {
      // Add movement
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);
    }, 3000);
  }
  inputLoanAmount.value = '';
});

// closing the account and delete it //
/////////////////////////////////////////////////
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

// re-ordering the movements in the UI //
/////////////////////////////////////////////////
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

/*
const clock = () => {
  const theFunc = () => {
    const currentTime = new Date();

    const hour = currentTime.getHours();
    const min = currentTime.getMinutes();
    const seco = currentTime.getSeconds();

    console.log(`${hour}:${min}:${seco}`);
    // console.log(typeof sec);
  };
  setInterval(theFunc, 1000);
  // location.reload();
};

// clock();

let time = 10;
const timer = setInterval(() => {
  // set time countdown

  const minute = `${Math.trunc(time / 60)}`.padStart(2, 0);
  const seconde = `${time % 60}`.padStart(2, 0);

  //decrease by one
  time--;

  // display the timer
  const displayTimer = `${minute}:${seconde}`;

  // stop timer if fet to 0
  if (time === 0) clearInterval(timer);

  console.log(displayTimer);
}, 1000);

const word = ['what'];

const timer = setTimeout(() => {
  console.log('what');
}, 3000);

if (word.includes('what')) clearTimeout(timer);

setInterval(() => {
  const now = new Date();
  const option = {
    // year: 'numeric',
    // month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    seconde: 'numeric',
  };

  console.log(new Intl.DateTimeFormat().format(now));
}, 1000);

const USnumber = 12453.34;

console.log(
  new Intl.NumberFormat(currentAccount.locale, {
    style: 'currency',
    currency: currentAccount.currency,
  }).format(USnumber)
);

console.log(
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'ILS',
    maximumSignificantDigits: 3,
  }).format(USnumber)
);

const future = new Date(2025, 4, 1, 12, 30);
console.log(+future);

const calcTimePast = (day1, day2) =>
  Math.abs(day1 - day2) / (1000 * 60 * 60 * 24);

const day1 = calcTimePast(new Date(2025, 4, 1), new Date(2025, 4, 10));

console.log(day1);

const now = new Date(); // .getTime();
console.log(now);
console.log(new Date('may 01 2002 10:03:22'));

console.log(new Date(account1.movementsDates[0]));
console.log(new Date(2024, 11, 13, 10, 20, 3));

console.log(new Date(24 * 60 * 60 * 1000));

const future = new Date(2024, 11, 1, 10, 20);
console.log(future);
console.log(future.getFullYear());
console.log(future.getMonth());
console.log(future.getDate());
console.log(future.getDay());
console.log(future.getHours());
console.log(future.getMinutes());
console.log(future.getSeconds());
console.log(future.getMilliseconds());
console.log(future.toISOString());
console.log(future.getTime());

console.log(new Date(future.getTime()));
console.log(Date.now());

future.setFullYear(2040);
future.setMonth(4);
console.log(future);

// console.log(new Date(now));



console.log(Number.parseInt('20.3ksS', 10));
console.log(Number.parseInt('e20', 10));

console.log(Number.parseFloat('2.3er'));

console.log(Number.isNaN('2.3er'));
console.log(Number.isNaN(+'23f'));
console.log(Number.isNaN(20 / 0));

console.log(Number.isFinite(20));
console.log(Number.isFinite('20'));
console.log(Number.isFinite(+'20'));
console.log(Number.isFinite('20ef'));
console.log(Number.isFinite(20 / 0));


// console.log(Math.sqrt(25));
// console.log(Math.sqrt(8));
// console.log(8 ** (1 / 3));

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min) + 1) + min;

// console.log(randomInt(10, 20));

// delete the after point //
console.log(Math.trunc(23.3));
console.log(Math.trunc(23.9));

// round the number to the nearest integer //
console.log(Math.round(23.3));
console.log(Math.round(23.9));

// round the number up //
console.log(Math.ceil(23.3));
console.log(Math.ceil(23.9));

// round the number down //
console.log(Math.floor(23.3));
console.log(Math.floor(23.9));

// rounding decimals //
console.log((2.3).toFixed(0));
console.log((2.3).toFixed(2));
console.log(+(2.334).toFixed(4));
console.log((2.334).toFixed(4));
console.log(+(+'2.5').toFixed(0));
*/
