// game.js

// Iniciar o Firebase
firebase.initializeApp({
  apiKey: '<API_KEY>',
  authDomain: '<AUTH_DOMAIN>',
  databaseURL: '<DATABASE_URL>',
});

// Criar uma referência para o banco de dados
const db = firebase.database();

// Criar uma cena para o jogo
const scene = new Phaser.Scene('game');

let player;

// Preload dos assets
scene.preload = function() {
  this.load.image('player', 'assets/player.png');
  this.load.image('obstacle', 'assets/obstacle.png');
  this.load.image('power-up', 'assets/power-up.png');
};

// Criar o jogador e objetos
scene.create = function() {
  player = this.physics.add.sprite(100, 100, 'player');
  this.cursors = this.input.keyboard.createCursorKeys();

  // Obstáculo
  const obstacle = this.physics.add.sprite(200, 200, 'obstacle');
  this.physics.add.collider(player, obstacle);

  // Power-up
  const powerUp = this.physics.add.sprite(300, 300, 'power-up');
  this.physics.add.collider(player, powerUp);

  // Armazenar a posição do jogador no banco de dados
  db.ref('players/' + player.id).set({
    x: player.x,
    y: player.y,
  });

  // Sincronizar a posição do jogador com os outros jogadores
  db.ref('players').on('value', (snapshot) => {
    const players = snapshot.val();
    Object.keys(players).forEach((playerId) => {
      const playerData = players[playerId];
      // Atualize ou crie sprites de outros jogadores conforme necessário
    });
  });

  // Sistema de pontuação e ranking
  db.ref('scores').on('value', (snapshot) => {
    const scores = snapshot.val();
    Object.keys(scores).forEach((scoreId) => {
      const scoreData = scores[scoreId];
      console.log(`Pontuação: ${scoreData.score}`);
    });
  });
};

// Atualizar a posição do jogador
scene.update = function() {
  if (this.cursors.left.isDown) {
    player.x -= 5;
  } else if (this.cursors.right.isDown) {
    player.x += 5;
  }
};

// Iniciar o jogo
const game = new Phaser.Game({
  type: Phaser.CANVAS,
  parent: 'game',
  width: 800,
  height: 600,
  scene: scene,
  physics: { default: 'arcade' }
});