import { DefaultPower } from "./powers/default-power";

export interface IGameState {
  loopCount: number;
  players: IPlayer[];
  coins: ICoin[];
  fieldSize: {
    width: number;
    height: number;
  };
  eliminatedPlayers: Record<string, string>;
}

export interface IPlayer {
  id: string;
  name: string;
  score: number;
  x: number;
  y: number;
  power: DefaultPower;
}

export interface ICoin {
  x: number;
  y: number;
  type: CoinType
}

export type PowerType = 'default' | 'invincible';
export type CoinType = 'normal' | 'fast';
export type Command = 'left' | 'right' | 'up' | 'down';
export type Commands = Record<string, Command>;
