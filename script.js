'use strict';

function PlayerFactory(game) {
    this.createPlayer = function (index) {
        const player = new Player(index);
        return player;
    }
    const Player = function (index) {
        this.index = index;
        this.name = `Player ${Number(index) + 1}`
        this.score = 0;
        this.currentScore = 0;
        this.isWinner = false;
        this.element = playerElement(this);
        this.updateCurrentScore = setScores(this);
        this.deactivate = deactivatePlayer(this);
        this.activate = activatePlayer(this);
        setName(this);
        this.updateWinner = updateWinner(this);
        startListenBtnRoll(this);
        startListenBtnHold(this);
    }
    function playerElement() {
        const playersEl = document.getElementById('players');
        const element = document.createElement('section');
        element.innerHTML = (`<h2 class="name"></h2>
        <p class="score">0</p>
        <div class="current">
          <p class="current-label">Current</p>
          <p class="current-score" id="current--0">0</p>
          <button class="btn--img"><img class="dice-1 dice /></button>
          <div class="buttons"><button class="btn btn--hold">✋🏻</button></div>
        </div>`);
        playersEl.insertAdjacentElement('beforeend', element);
        return element;
    }
    function setName(player) {
        player.element.getElementsByClassName('name')[0].textContent = player.name;
    }
    function updateWinner(player) {
        return function () {
            player.element.classList.add('player--winner');
            player.element.getElementsByClassName('name')[0].textContent = 'Winner! 🥳';
        }
    }
    function setScores(player) {
        return function () {
            player.element.getElementsByClassName('current-score')[0].textContent = player.currentScore;
            player.element.getElementsByClassName('score')[0].textContent = player.score;
        }
    }
    function startListenBtnRoll(player) {
        player.element.getElementsByClassName('dice')[0].addEventListener('click', function () {
            const dice = Math.trunc(Math.random() * 6) + 1;
            if (player.active) {
                game.playerRolledDice(player, dice);
                player.element.getElementsByClassName('dice')[0].classList = `dice dice-${dice}`;
            }

        })
    }
    function startListenBtnHold(player) {
        player.element.getElementsByClassName('btn btn--hold')[0].addEventListener('click', function () {
            if (player.active) {
                game.playerHoldScore(player);
            }
        })
    }
    function deactivatePlayer(player) {
        return function () {
            player.active = false;
            player.element.classList.remove('player--active');
        }
    }
    function activatePlayer(player) {
        return function () {
            player.active = true;
            player.element.classList.add('player--active');
        }
    }
};

var Game = {
    scoreToWin: null,
    players: [],
    switchPlayer: function (player) {
        if (!player.isWinner) {
            console.log(player)
            let index = player.index;
            let nextIndex = Number(index) + 1;
            let playersCount = Game.players.length;
            if (nextIndex >= playersCount) {
                nextIndex = 0;
            }
            player.deactivate();
            Game.players[nextIndex].activate();
        }
    },
    playerRolledDice: function (player, dice) {
        if (dice !== 1) {
            player.currentScore += dice;
        } else {
            player.currentScore = 0;
            Game.switchPlayer(player);
        }
        player.updateCurrentScore();
    },
    playerHoldScore: function (player) {
        player.score += player.currentScore;
        player.currentScore = 0;
        player.updateCurrentScore();
        Game.checkWinner(player);
        Game.switchPlayer(player);
    },
    checkWinner: function (player) {
        if (player.score >= Number(Game.scoreToWin)) {
            player.isWinner = true;
            player.deactivate();
            player.updateWinner(player);
        }
    },
    setStyle: function () {
        const lenOfPlrs = Game.players.length;
        if (lenOfPlrs >= 11 || lenOfPlrs === 1) {
            console.log(lenOfPlrs);
            document.getElementById('players').classList.add('players')
            Game.players.forEach(player => player.element.classList.add('player'));
        }
        document.getElementById('players').classList.add(`players--${lenOfPlrs}`);
        Game.players.forEach(player => player.element.classList.add(`player--${lenOfPlrs}`))
    },
    startNewGame: function () {
        const scores = document.querySelectorAll('.score');
        scores.forEach(score => score.textContent = 0);
        Game.players.forEach(player => {
            Game.players[0].index === player.index ? 
                player.activate() : player.deactivate();
            player.element.getElementsByClassName('current-score')[0].textContent = 0;
            player.score = 0;
            if (player.isWinner) {
                player.element.classList.remove('player--winner');
                player.element.getElementsByClassName('name')[0].textContent = player.name;
                player.isWinner = false;
            }
        });
    },
    init: function () {
        Game.players = [];
        const playerAmount = document.getElementById('player--amount').value;
        const scoreToWin = document.getElementById('goal--amount').value;
        Game.scoreToWin = scoreToWin;
        const factory = new PlayerFactory(Game);
        console.log(factory);
        for (let i = 0; i < playerAmount; i++) {
            let player = factory.createPlayer([i]);
            console.log(player)
            Game.players.push(player);
        }
        Game.players[0].activate();
        return players;
    }
};
document.getElementById('start-game').addEventListener('click', function () {
    Game.init();
    Game.setStyle();
    document.getElementsByClassName('start-screen')[0].classList.add('hidden');
    document.getElementsByClassName('btn--new ')[0].classList.remove('hidden');
});

document.getElementsByClassName('btn--new')[0].addEventListener('click', function () {
    Game.startNewGame();
});

