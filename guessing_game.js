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
      return `You Win!`;
    } else if (this.pastGuesses.includes(num)) {
      return `You have already guessed that number.`;
    } else {
      this.pastGuesses.push(num);
    }

    if (this.pastGuesses.length === 5) {
      this.gameEnd = true;
      return `You Lose.`;
    }

    if (this.difference() < 10) {
      return `You're burning up!`;
    } else if (this.difference() < 25) {
      return `You're lukewarm.`;
    } else if (this.difference() < 50) {
      return `You're a bit chilly.`;
    } else if (this.difference() < 100) {
      return `You're ice cold!`;
    }
  }
  provideHint() {
    this.hintCounter ++;
    this.hints.push(this.winningNumber);
    while (this.hints.length < 3) {
      this.hints.push(generateWinningNumber());
    }
    shuffle(this.hints);
    this.hintPrompt = `The winning number is either ${this.hints[0]}, ${
      this.hints[1]
    }, or ${this.hints[2]}.`;
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
    document.getElementById(`${i}`).innerHTML = '';
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