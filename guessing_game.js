function generateWinningNumber() {
  return Math.ceil(Math.random() * 100);
}

function shuffle(arr) {
  let n = arr.length,
    rand = 0,
    temp = 0;
  while (n) {
    rand = Math.floor(Math.random() * n--);
    temp = arr[n];
    arr[n] = arr[rand];
    arr[rand] = temp;
  }
  return arr;
}

class Game {
  constructor() {
    this.gameEnd = false;
    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();
    this.hints = [];
    this.hintCounter = 0;
    this.hintPrompt = '';
  }
  difference() {
    return Math.abs(this.playersGuess - this.winningNumber);
  }
  isLower() {
    return this.playersGuess < this.winningNumber;
  }
  playersGuessSubmission(num) {
    if (num && num >= 1 && num <= 100) {
      this.playersGuess = num;
    } else {
      return `That is an invalid guess.`;
    }
    return this.checkGuess(this.playersGuess);
  }
  checkGuess(num) {
    if (num === this.winningNumber) {
      this.gameEnd = true;
      return `You Win! The winning number is ${this.winningNumber}.`;
    } else if (this.pastGuesses.includes(num)) {
      return `You have already guessed that number.`;
    } else {
      this.pastGuesses.push(num);
    }

    if (this.pastGuesses.length === 5) {
      this.gameEnd = true;
      return `You Lose. The winning number is ${this.winningNumber}.`;
    }

    let difference = this.difference();
    if (this.playersGuess > this.winningNumber) {
      if (difference <= 10) {
        return `You're very close. Guess Lower!`;
      } else if (difference <= 25) {
        return `You're close. Guess Lower!`;
      } else if (difference <= 100) {
        return `You're off quite a bit. Guess Lower!`;
      }
    } else {
      if (difference <= 10) {
        return `You're very close. Guess Higher!`;
      } else if (difference <= 25) {
        return `You're close. Guess Higher!`;
      } else if (difference <= 100) {
        return `You're off quite a bit. Guess Higher!`;
      }
    }
  }
  provideHint() {
    this.hintCounter++;
    this.hints.push(this.winningNumber);
    while (this.hints.length < 8) {
      let num = generateWinningNumber();
      if(!this.hints.includes(num)){
        this.hints.push(num);
      }
    }
    shuffle(this.hints);
    this.hintPrompt = `The winning number is one of the following numbers:<br/>
    ${this.hints.join(', ')}`
  }
}

function newGame() {
  return new Game();
}

let replay = document.getElementById('replay');
let curGame = new Game();
replay.addEventListener('click', () => {
  curGame = new Game();
  //reset past guesses
  for (let i = 0; i <= 4; +i++) {
    document.getElementById(`${i}`).innerHTML = '--';
  }
  document.getElementById('prompt').innerHTML =
    'Can you guess the winning number?!';
});

let submission = document.getElementById('submission');

submission.addEventListener('click', function() {
  const submitNum = document.querySelector('input');
  checkInputAndUpdate(parseInt(submitNum.value));
  submitNum.value = '';
});

function checkInputAndUpdate(val) {
  if (curGame.gameEnd === false) {
    document.getElementById(
      'prompt'
    ).innerHTML = curGame.playersGuessSubmission(val);
    //Update past guesses list in html
    curGame.pastGuesses.forEach(val => {
      let i = curGame.pastGuesses.indexOf(val);
      document.getElementById(`${i}`).innerHTML = val;
    });
  } else {
    document.getElementById(
      'prompt'
    ).innerHTML = `Please click on 'Play Again' for a new game.`;
  }
}

let hintRequest = document.getElementById('hint');
hintRequest.addEventListener('click', () => {
  if (curGame.hintCounter < 1) {
    curGame.provideHint();
    document.getElementById('prompt').innerHTML = curGame.hintPrompt;
  } else {
    document.getElementById('prompt').innerHTML = curGame.hintPrompt;
  }
});
