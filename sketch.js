var PLAY = 1;// estados de Jogo - play
var END = 0;// estados de Jogo - end
var gameState = PLAY;// estados de Jogo - inicio

var trex, trex_running, trex_collided;// declaração da variavel TREX
var ground, invisibleGround, groundImage;// declaração da variavel solo (chão)
var cloudsGroup, cloudImage;// declaração da variavel Nuvens

// declaração da variavel obstaculos
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var score = 0;//  declaração da variavel placar
var gameOver, restart;// declaração da variavel Gamer Over e Restart
var jumpSound, checkPointSound, dieSound; // declaração da variavel dos sons de jogo

var backgroundImg;

function preload() {



  trex_running = loadAnimation("assets/trex_2.png", "assets/trex_1.png", "assets/trex_3.png");// carregando a Animação do TREX correndo
  trex_collided = loadAnimation("assets/trex_collided.png");// carregando a Animação do TREX collide


  groundImage = loadImage("assets/ground.png");  // carregando a Imagem do chão
  cloudImage = loadImage("assets/cloud.png");// carregando a Imagem da Nuvem

  // carregando as Imagens dos Obstaculos
  obstacle1 = loadImage("assets/obstacle1.png");
  obstacle2 = loadImage("assets/obstacle2.png");
  obstacle3 = loadImage("assets/obstacle3.png");
  obstacle4 = loadImage("assets/obstacle4.png");
  // obstacle5 = loadImage("assets/obstacle5.png");
  // obstacle6 = loadImage("assets/obstacle6.png");

  gameOverImg = loadImage("assets/gameOver.png");// carregando a Animação Gamer Over
  restartImg = loadImage("assets/restart.png");// carregando a Animação   Restart

  jumpSound = loadSound("assets/sounds/jump.wav"); // carregando os sons de jogo - Pular
  collidedSound = loadSound("assets/sounds/collided.wav");
  // dieSound = loadSound("die.mp3"); // carregando os sons de jogo - Colide 
  // checkPointSound = loadSound("checkPoint.mp3");// carregando os sons de jogo - a cada 100pts

  backgroundImg = loadImage("assets/backgroundImg.png");
  sunAnimation = loadImage("assets/sun.png");
}

function setup() {
  // createCanvas(600, 200); 
  createCanvas(windowWidth, windowHeight);// criando o canvas

  // criando o sol
  sun = createSprite(width - 50, 100, 10, 10);
  sun.addAnimation("sun", sunAnimation);
  sun.scale = 0.1;

  // trex = createSprite(50, 180, 20, 50);
  trex = createSprite(50, height - 70, 20, 50);// criando o sprite trex

  trex.addAnimation("running", trex_running);// Chamando a animação o sprite trex correndo
  trex.addAnimation("collided", trex_collided);// Chamando a animação o sprite trex colidindo 
  trex.setCollider("circle", 0, 0, 350);
  trex.scale = 0.10;


  // ground = createSprite(200, 180, 400, 20); 
  ground = createSprite(width / 2, height, width, 2);// criando o sprite (chão)
  ground.addImage("ground", groundImage);  // Chamando a animação o sprite chão
  ground.x = width / 2;// repetição para o chão não terminar
  // ground.x = ground.width / 2;
  ground.velocityX = -(6 + 3 * score / 100); // velocidade do chão

  // gameOver = createSprite(300, 100);
  gameOver = createSprite(width / 2, height / 2 - 50);// criando o sprite (gamerOver)
  gameOver.addImage(gameOverImg);// Chamando a imagem o sprite GameOver
  gameOver.scale = 0.5;
  gameOver.visible = false;

  restart = createSprite(width / 2, height / 2);// criando o sprite (restart)
  restart.addImage(restartImg);// Chamando a imagem o sprite restart
  restart.scale = 0.1;
  restart.visible = false;//Tornando o restart invisivel


  invisibleGround = createSprite(width / 2, height - 10, width, 125);
  invisibleGround.shapeColor = "#f4cbaa";

  cloudsGroup = new Group(); //criando grupo de Nuvens
  obstaclesGroup = new Group();//criando grupo de obstaculos

  score = 0;//atualizando os pontos para 0

  // area de colisão
  //trex.debug = false;
}

function draw() {
  // cor do fundo
  background(backgroundImg);

  textSize(20);
  fill("black");
  // pontos exibidos na tela
  text("Score: " + score, 500, 50);

  if (gameState === PLAY) {
    
    score = score + Math.round(getFrameRate() / 60);
    ground.velocityX = -(6 + 3 * score / 100);

    //     // a cada 100 pontos executada o som de check point
    // if (score > 0 && score % 100 === 0) {
    //   checkPointSound.play();
    // }


    //mudar a animação do trex
    // trex.changeAnimation("running", trex_running);

    // pular quando a tecla espaço for selecionada
    // if (keyDown("space") && trex.y >= 159) {
    //   trex.velocityY = -12;
    //   jumpSound.play();
    // }

    if ((touches.length > 0 || keyDown("SPACE")) && trex.y >= height - 120) {
      jumpSound.play()
      trex.velocityY = -10;
      touches = [];
    }


    // adiciona a gravidade ao trex
    trex.velocityY = trex.velocityY + 0.8

    // duplicar a animação do solo pra sempre aparecer na tela
    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    // trex colide no solo invisivel 
    trex.collide(invisibleGround);

    // chamando a função grupo de nuvens
    spawnClouds();

    // chamando a função grupo de Obstaculos
    spawnObstacles();

    // Se o Trex tocar nos obstaculos muda o estado de jogo
    if (obstaclesGroup.isTouching(trex)) {
      gameState = END;  
      collidedSound.play();
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;

    //definir a velocidade de cada objeto do jogo para 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);

    //mudar a animação do trex
    trex.changeAnimation("collided", trex_collided);

    //definir tempo de vida aos objetos do jogo para que nunca sejam destruídos
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);

    if(touches.length>0 || keyDown("SPACE")) {      
      reset();
      touches = []
    }
  }


  drawSprites();
}

function spawnClouds() {
  //escreva o código aqui para gerar as nuvens
  if (frameCount % 60 === 0) {
    var cloud = createSprite(width+20,height-300,40,10);
    cloud.y = Math.round(random(100, 220));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;

    //atribua tempo de vida à variável
    cloud.lifetime = 300;

    //ajustar a profundidade
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

    //adicione cada nuvem ao grupo
    cloudsGroup.add(cloud);
  }

}

function reset() {
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;

  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("running",trex_running);   
  score = 0;
}

function spawnObstacles() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(600,height-95,20,30);
    obstacle.setCollider('circle',0,0,45);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3 * score / 100);

    //gerar obstáculos aleatórios
    var rand = Math.round(random(1, 2));
    switch (rand) {
      case 1: obstacle.addImage(obstacle1);
        break;
      case 2: obstacle.addImage(obstacle2);
        break;
      default: break;
    }

    //atribua dimensão e tempo de vida aos obstáculos           
    obstacle.scale = 0.4           ;
    obstacle.lifetime = 300;
    obstacle.depth = trex.depth;
    trex.depth +=1;             
    //adicione cada obstáculo ao grupo
    obstaclesGroup.add(obstacle);
  }
}

