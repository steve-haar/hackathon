import { CoinType, Commands, ICoin, IGameState, IPlayer } from './models';
import { InvinciblePower } from './powers/invincible';
import { DefaultPower } from './powers/default-power';
import { FrozenPower } from './powers/frozen';
import { UPDATES_PER_SECOND } from './game';

const coinCount = 100;
const gameLength = 180;

export function getInitialState(): IGameState {
  return {
    loopCount: 0,
    darkMode: false,
    players: [],
    coins: [],
    fieldSize: {
      width: 100,
      height: 100,
    },
    eliminatedPlayers: {},
    maxLoopCount: gameLength * UPDATES_PER_SECOND
  };
}

export function gameLogic(state: IGameState, commands: Commands, loopCounter: number): IGameState {
  state.loopCount++;

  evaluateCommands(state, commands, loopCounter);
  resolveCoinCollisions(state);
  resolvePlayerCollisions(state);
  updatePowers(state);
  addMoreCoins(state);
  return state;
}

function evaluateCommands(state: IGameState, commands: Commands, loopCounter: number) {
  Object.keys(commands).forEach((playerId) => {
    const player = state.players.find((p) => p.id === playerId);
    if (!player?.power.getCanMove()) {
      return;
    }
    const command = commands[playerId];
    if (command === 'up') {
      const newY = player.y - 1;
      if (newY < 0) {
        return;
      }
      player.y = newY;
    } else if (command === 'down') {
      const newY = player.y + 1;
      if (newY > state.fieldSize.height) {
        return;
      }
      player.y = newY;
    } else if (command === 'left') {
      const newX = player.x - 1;
      if (newX < 0) {
        return;
      }
      player.x = newX;
    } else if (command === 'right') {
      const newX = player.x + 1;
      if (newX > state.fieldSize.width) {
        return;
      }
      player.x = newX;
    }
  });
}

function resolveCoinCollisions(state: IGameState) {
  state.coins.slice().forEach((coin) => {
    const player = state.players.find((p) => p.x === coin.x && p.y === coin.y);
    if (player) {
      player.power = getCoinPower(coin) || player.power;
      
      if (coin.type === 'dark') {
        state.darkMode = !state.darkMode;
      }

      switch (coin.type) {
        case 'poison':
          player.score = 0;
          break;
        case 'bonus':
          player.score += 20;
          break;
        default:
          player.score++;
      }

      state.coins = state.coins.filter((c) => c !== coin);

      const otherPlayerPowerFn = getOtherPlayerCoinPowerFn(coin);

      if (otherPlayerPowerFn) {
        state.players.forEach(otherPlayer => {
          if (otherPlayer.id !== player.id) {
            otherPlayer.power = otherPlayerPowerFn();
          }
        });
      }
    }
  });
}

function getCoinPower(coin: ICoin) {
  switch (coin.type) {
    case 'invincible':
      return new InvinciblePower();
    default:
      return null;
  }
}

function getOtherPlayerCoinPowerFn(coin: ICoin) {
  switch (coin.type) {
    case 'elsa':
      return () => new FrozenPower();
    default:
      return null;
  }
}

function resolvePlayerCollisions(state: IGameState) {
  state.players.slice().forEach((player) => {
    if (!state.players.includes(player)) {
      return;
    }
    const otherPlayer = state.players.find(
      (p) => p !== player && p.x === player.x && p.y === player.y
    );
    if (otherPlayer) {
      const pool = 2;
      const roll = Math.floor(Math.random() * pool);
      let winner: IPlayer;
      let loser: IPlayer;

      const playerIsInvincible = player.power.getIsInvincible();
      const otherPlayerIsInvincible = otherPlayer.power.getIsInvincible();

      if (playerIsInvincible && otherPlayerIsInvincible) {
        winner = null;
        loser = null;
      } else if (playerIsInvincible) {
        winner = player;
        loser = otherPlayer;
      }  else if (otherPlayerIsInvincible) {
        winner = otherPlayer;
        loser = player;
      } else if (roll === 1) {
        winner = player;
        loser = otherPlayer;
      } else {
        winner = otherPlayer;
        loser = player;
      }

      if (winner && loser) {
        winner.score += loser.score;
        state.players = state.players.filter((p) => p !== loser);
        state.eliminatedPlayers[loser.id] = winner.id;
      }
    }
  });
}

function addMoreCoins(state: IGameState) {
  while (state.coins.length < coinCount) {
    const location = getUnoccupiedLocation(state);
    const type = getCoinType(state);
    state.coins.push({ ...location, type });
  }
}

function updatePowers(state: IGameState) {
  state.players.forEach(player => {
    player.power.remainingTime--;
    if (player.power.remainingTime === 0) {
      player.power = new DefaultPower();
    }
  });
}

function getCoinType(state: IGameState): CoinType {
  if (!state.coins.find(coin => coin.type === 'invincible') && !state.players.find(player => player.power.type === 'invincible')) {
    return 'invincible';
  } else if (!state.coins.find(coin => coin.type === 'elsa') && !state.players.find(player => player.power.type === 'frozen')) {
    return 'elsa';
  } else if (!state.coins.find(coin => coin.type === 'poison')) {
    return 'poison';
  } else if (!state.coins.find(coin => coin.type === 'bonus')) {
    return 'bonus';
  } else if (!state.coins.find(coin => coin.type === 'dark')) {
    return 'dark';
  } else {
    return 'normal';
  }
}

export function getUnoccupiedLocation(state: IGameState): {
  x: number;
  y: number;
} {
  let location = null;
  while (!location) {
    const x = Math.floor(Math.random() * state.fieldSize.width);
    const y = Math.floor(Math.random() * state.fieldSize.height);
    if (state.players.find((p) => p.x === x && p.y === y)) {
      continue;
    }
    if (state.coins.find((c) => c.x === x && c.y === y)) {
      continue;
    }
    location = { x, y };
  }
  return location;
}
