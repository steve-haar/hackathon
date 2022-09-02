import { Component, Input, OnInit } from '@angular/core';
import { IGameState, IPlayer } from '../../../../models';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss'],
})
export class LeaderboardComponent implements OnInit {
  @Input()
  state?: IGameState;

  @Input()
  player?: IPlayer;

  constructor() {}

  ngOnInit(): void {}

  coinTypes = [{ type: 'invincible', color: 'green'}, { type: 'elsa', color: 'aqua' }, { type: 'poison', color: 'black' }, { type: '20 points', color: '#a17f1a' }];
}
