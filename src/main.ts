import kaboom from 'kaboom';

kaboom({
  width: 826,
  height: 500,
  background: [255, 255, 255],
});

const config = {
  JUMP_FORCE: 600,
  MOVE_SPEED: 300,
  FALL_DEATH: 600,
};

loadSprite('player', 'assets/Player.png');
loadSprite('player-left', 'assets/Player-Left.png');
loadSprite('player-right', 'assets/Player-Right.png');
loadSprite('player-top', 'assets/Player-Top.png');
loadSprite('tile-1', 'assets/Tile-1.png');
loadSprite('tile-2', 'assets/Tile-2.png');

scene('game', (levelNumber = 0) => {
  const gameLevels = [
    [
      '                         ',
      '                         ',
      '                         ',
      '                         ',
      '                         ',
      '                         ',
      '                         ',
      '                   $%    ',
      '=-=-=-=-=-=-=-=   -=-    ',
    ],
    [
      '                         ',
      '                         ',
      '                         ',
      '                         ',
      '                         ',
      '                         ',
      '                         ',
      '                         ',
      '=-=-=-=-=-=-=  -=-=-=-   ',
    ],
  ];

  add([text(`Level: ${levelNumber + 1}`), pos(center())]);

  addLevel(gameLevels[levelNumber], {
    // define the size of each block
    width: 55,
    height: 55,
    // define what each symbol means, by a function returning a component list (what will be passed to add())
    '=': () => [sprite('tile-1'), area(), solid(), pos(0, 0), scale(1.0)],
    '-': () => [sprite('tile-2'), area(), solid(), pos(0, 0), scale(1.0)],
    '(': () => [sprite('player'), area(), body(), pos(0, 0), scale(1.2)],
    $: () => [rect(30, 30), area(), body(), color(0, 0, 0), 'food'],
  });

  const player = add([sprite('player'), pos(5, 5), area(), body()]);

  onKeyPress('s', () => {
    if (player.isGrounded()) {
      player.jump(config.JUMP_FORCE);
      player.use(sprite('player-top'));
      // player.use(sprite('player'));
      setTimeout(() => {
        player.use(sprite('player'));
      }, 700);
    }
  });

  onKeyDown('d', () => {
    player.use(sprite('player-right'));
    player.move(config.MOVE_SPEED, 0);
  });

  onKeyDown('a', () => {
    player.use(sprite('player-left'));
    player.move(-config.MOVE_SPEED, 0);
  });

  player.onUpdate(() => {
    camPos(player.pos);
    if (player.pos.y >= config.FALL_DEATH) {
      go('lose');
    }
  });

  player.onCollide('food', (f) => {
    destroy(f);
    add([text('You win!'), pos(center()), color(0, 0, 0)]);
    let nextLevel: number = levelNumber + 1;
    go('game', nextLevel);
  });
});

go('game');

scene('lose', () => {
  // @ts-ignore
  add([text('You lose'), pos(center()), origin('center')]);
});
