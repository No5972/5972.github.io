	const BULLET_SPEED = 800;
  const ENEMY_BULLET_SPEED = 100;
	const ENEMY_SPEED = 60;
	const PLAYER_SPEED = 120;
  const INITIAL_POWERUP_POINT_SPEED = -60;
  const INITIAL_POWERUP_POWER_SPEED = -50;

  let isFiring = false;
  let power = 1;
  let position = 0;
  let life = 3;

  gravity(200);

  const enemyALocation = [ 9, 12, 13, 14, 22, 23, 24 ];
  const enemyBLocation = [32, 34, 36, 38, 40, 52, 54, 56, 58, 60];
  const enemyCLocation = [31, 33, 35, 37, 39, 51, 53, 55, 57, 59];
  const enemyDLocation = [10, 72, 74, 76, 78, 80, 92, 94, 96, 98, 100];
  
  play("th06_02");

	const player = add([
		sprite("player01"),
		pos(width() / 2, height() - 15),
		scale(1),
    "player"
	]);

	keyDown("left", () => {
		player.move(-PLAYER_SPEED, 0);
	});

	keyDown("right", () => {
		player.move(PLAYER_SPEED, 0);
	});

  keyDown("up", () => {
		player.move(0, -PLAYER_SPEED);
	});

  keyDown("down", () => {
		player.move(0, PLAYER_SPEED);
	});

  keyDown("z", () => { isFiring = true; });

  keyRelease("z", () => { isFiring = false; });

/*
	keyPress("space", () => {
		add([
			sprite("bullet00"),
			pos(player.pos),
			// strings here means a tag
			"bullet",
		]);
	});
*/
	// run this callback every frame for all objects with tag "bullet"
	action("bullet", (b) => {
		b.move(Math.cos(b.direction) * BULLET_SPEED, -Math.sin(b.direction) * BULLET_SPEED);
		// remove the bullet if it's out of the scene for performance
		if (b.pos.y < 0) {
			destroy(b);
		}
	});

	function spawnEnemyA() { return add([	sprite("enemy00"),	pos(rand(0, width()), 0), "enemyA", ]);}
  function spawnEnemyB() { return add([	sprite("enemy00"),	pos(0, 48), "enemyB", ]);}
  function spawnEnemyC() { return add([	sprite("enemy00"),	pos(width(), 48), "enemyC", ]);}
  function spawnEnemyD() { return add([	sprite("enemy01"),	pos(rand(0, width()), 0), "enemyD", {
    time: 0
  }]);}

	const score = add([
		pos(width() - 120, 12),
		text("Score: 0"),
		// all objects defaults origin to center, we want score text to be top left
		origin("topleft"),
		// plain objects becomes fields of score
		{
			value: 0,
		},
	]);

  const powerText = add([
    pos(width() - 120, 20),
    text("Power: 1.0"),
    origin("topleft"),
    {}
  ])

  const lifeText = add([
    pos(width() - 120, 28),
    text("Life : 3"),
    origin("topleft"),
    {}
  ])

  function defeatAnEnemy(b, e) {
		destroy(b);
		destroy(e);
		score.value += 1;
		score.text = "Score: " + score.value;

    let rand = Math.random();
    if (rand > 0.6) {
      add([
        sprite("point"),
        pos(e.pos),
        body(),
        // strings here means a tag
        "powerup-point",
      ]);
    }

    if (rand > 0.1 && rand <= 0.4) {
      add([
        sprite("power"),
        pos(e.pos),
        body(),
        // strings here means a tag
        "powerup-power",
      ]);
    }
  }

	// if a "bullet" and a "enemy" collides, remove both of them
	collides("bullet", "enemyA", (b, e) => { defeatAnEnemy(b, e); });
  collides("bullet", "enemyB", (b, e) => { defeatAnEnemy(b, e); });
  collides("bullet", "enemyC", (b, e) => { defeatAnEnemy(b, e); });
  collides("bullet", "enemyD", (b, e) => { defeatAnEnemy(b, e); });


  collides("player", "powerup-point", (p, pp) => {
    let getScore = parseInt(100 + height() - p.pos.y);
    if (getScore > 800) {
      getScore = 800;
    }
    score.value += getScore;
    score.text = "Score: " + score.value;
    destroy(pp);
  });

  collides("player", "powerup-power", (p, pp) => {
    if (power < 10) {
      power+=2.3;
      //power+=0.3;
      powerText.text = "Power: " + power.toFixed(1);
      if (power > 10) {
        power = 10;
        powerText.text = "Power: MAX";
      }
      
    }
    destroy(pp);
  });

  function playerHit(p, e) {
    life--;
    lifeText.text = "Life : " + life;
    if (life < 0) {
      go("gameover", score);
      return;
    }
    destroy(p);
    destroy(e);
    wait(2, () => {
      player.pos.x = width() / 2;
      player.pos.y = height() - 15;
      add(player);
    });
  }

  collides("player", "enemyBullet1", (e, eb) => { playerHit(e, eb); });
  collides("player", "enemyA", (e, eb) => { playerHit(e, eb); });
  collides("player", "enemyB", (e, eb) => { playerHit(e, eb); });
  collides("player", "enemyC", (e, eb) => { playerHit(e, eb); });
  collides("player", "enemyD", (e, eb) => { playerHit(e, eb); });

	action("enemyA", (e) => {
		e.move(0, ENEMY_SPEED);
		if (e.pos.y > height()) {
			destroy(e);
		}
	});

  action("enemyB", (e) => {
		e.move(ENEMY_SPEED, 0);
		if (e.pos.x > width()) {
			destroy(e);
		}
	});

  action("enemyC", (e) => {
		e.move(-ENEMY_SPEED, 0);
		if (e.pos.x < 0) {
			destroy(e);
		}
	});

  action("enemyD", (e) => {
		e.move(0, ENEMY_SPEED);
    e.time++;
    if (e.time % 100 == 0) { // enemy shoot
      let randDirection = rand(0, Math.PI * 2);
      for (let i = 0; i < 6; i ++) {
        add([	sprite("eb1"),	pos(e.pos.x, e.pos.y), "enemyBullet1", {
          direction: randDirection + ((Math.PI / 3) * i)
        }]);
      }
    }
		if (e.pos.y > height()) {
			destroy(e);
		}
	});

  action("powerup-point", (pp) => {
    let currentSpeed = INITIAL_POWERUP_POINT_SPEED;
    pp.move(0, currentSpeed++);
    if (pp.pos > height()) {
      destroy(pp);
    }
  });

  action("powerup-power", (pp) => {
    let currentSpeed = INITIAL_POWERUP_POWER_SPEED;
    pp.move(0, currentSpeed++);
    if (pp.pos > height()) {
      destroy(pp);
    }
  });

  action("enemyBullet1", (eb) => {
    let currentSpeed = ENEMY_BULLET_SPEED;
    eb.move(Math.cos(eb.direction) * currentSpeed, Math.sin(eb.direction) * currentSpeed);
    if (eb.pos.x < 0 || eb.pos.x > width() || eb.pos.y < 0 || eb.pos.y > height()) {
      destroy(eb);
    }
  })

	// spawn an enemy every 1 second
	loop(0.3, () => {
    position++;
    if (enemyALocation.lastIndexOf(position) != -1) spawnEnemyA();
    if (enemyBLocation.lastIndexOf(position) != -1) spawnEnemyB();
    if (enemyCLocation.lastIndexOf(position) != -1) spawnEnemyC();
    if (enemyDLocation.lastIndexOf(position) != -1) spawnEnemyD();
  });

  loop(0.05, () => {
    if (isFiring) {
      console.log("fire")
      for (let i = 0; i < parseInt(power); i++) {
        add([
          sprite("bullet00"),
          pos(player.pos),
          // strings here means a tag
          "bullet",
          {
            direction: Math.PI / 2 + (0.05 * parseInt(i + 1 / 2) * Math.pow(-1, i))
          }
        ]);
      }
    } 
  });