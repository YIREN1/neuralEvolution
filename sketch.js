let pipes = [];
let score = 0;
let bestScoreOfPipes = 0;
let fontsize = 40;

// How big is the population
let totalPopulation = 500;
// All active birds (not yet collided with pipe)
let activeBirds = [];
// All birds for any given population
let allBirds = [];

let bestBird;

// counter if pipes
let counter = 0;

let highScore = 0;

// Interface elements
let speedSlider;
let speedSpan;
let highScoreSpan;
let allTimeHighScoreSpan;
let bestScoreOfPipesSpan;
let saveButton;
let loadButton;
let runBestButton;

// Training or just showing the current best
let runBest = false;

let bestBrain;
let loadedBrain;
let loadedBird;

function preload() {
  bestBrain = loadJSON('bird.json');

}

const buildDOM = () => {
  let canvas = createCanvas(600, 400);
  canvas.parent('canvascontainer');

  // Access the interface elements
  speedSlider = select('#speedSlider');
  speedSpan = select('#speed');
  highScoreSpan = select('#hs');
  allTimeHighScoreSpan = select('#ahs');
  bestScoreOfPipesSpan = select('#bs');

  runBestButton = select('#best');
  runBestButton.mousePressed(toggleState);

  saveButton = select('#save');
  saveButton.mousePressed(saveBird);

  loadButton = select('#load');
  loadButton.mousePressed(loadBird);

  textSize(fontsize);
  textAlign(CENTER, CENTER);
}

const firstGen = () => {
  for (let i = 0; i < totalPopulation; i++) {
    let bird = new Bird();
    activeBirds[i] = bird;
    allBirds[i] = bird;
  }
}

function setup() {
  buildDOM();
  firstGen();
}

const saveBird = () => {
  console.log(bestBird.score);
  saveJSON(bestBird.brain, 'bird.json');
};

const loadBird = async () => {
  loadedBrain = NeuralNetwork.deserialize(bestBrain);
  loadedBird = new Bird(loadedBrain);
  bestBird = loadedBird;
};

// Toggle the state of the simulation
const toggleState = () => {
  runBest = !runBest;
  // Show the best bird
  if (runBest) {
    resetGame();
    runBestButton.html('continue training');
    // Go train some more
  } else {
    nextGeneration();
    runBestButton.html('run best');
  }
}

const cycleEvolution = () => {
  let cycles = speedSlider.value();
  speedSpan.html(cycles);

  for (let n = 0; n < cycles; n++) {

    for (var i = 0; i < pipes.length; i++) {
      pipes[i].update();

      if (pipes[i].offScreen()) {
        pipes.splice(i, 1);
        score++;
      }
    }

    if (runBest) {
      bestBird.think(pipes);
      bestBird.update();

      for (let j = 0; j < pipes.length; j++) {
        // Start over, bird hit pipe
        if (pipes[j].hit(bestBird)) {
          resetGame();
          break;
        }
      }

      if (bestBird.bottomTop()) {
        resetGame();
      }

    } else {
      for (let i = 0; i < activeBirds.length; i++) {
        let bird = activeBirds[i];
        bird.think(pipes);
        bird.update();

        for (let j = pipes.length - 1; j >= 0; j--) {
          if (pipes[j].hit(activeBirds[i])) {
            // Remove this bird
            activeBirds.splice(i, 1);
            break;
          }
        }

        if (bird.bottomTop()) {
          activeBirds.splice(i, 1);
        }
      }
    }

    if (counter % 75 == 0) {
      pipes.push(new Pipe());
    }
    counter++;
  }
}

function draw() {
  background(0);
  fill(230, 230, 250);
  text(score, width / 2, 150);

  cycleEvolution();

  updateScoreAndBird();

  drawStuff();
}

const updateScoreAndBird = () => {
  // What is highest score of the current population
  let tempHighScore = 0;
  // If we're training
  if (!runBest) {
    // Which is the best bird?
    let tempBestBird = null;
    for (let i = 0; i < activeBirds.length; i++) { // TODO: do we need this loop? they all have the same score
      let s = activeBirds[i].score;
      if (s > tempHighScore) {
        tempHighScore = s;
        tempBestBird = activeBirds[i];
      }
    }

    // Is it the all time high scorer?
    if (tempHighScore > highScore) {
      highScore = tempHighScore;
      bestBird = tempBestBird;
    }

    if (score > bestScoreOfPipes) {
      bestScoreOfPipes = score;
    }
  } else {
    // Just one bird, the best one so far
    tempHighScore = bestBird.score;
    if (tempHighScore > highScore) {
      highScore = tempHighScore;
    }

    if (score > bestScoreOfPipes) {
      bestScoreOfPipes = score;
    }
  }

  // Update DOM Elements
  highScoreSpan.html(tempHighScore);
  allTimeHighScoreSpan.html(highScore);
  bestScoreOfPipesSpan.html(bestScoreOfPipes);
}

const drawStuff = () => {
  for (let i = 0; i < pipes.length; i++) {
    pipes[i].show();
  }

  if (runBest) {
    bestBird.show();
  } else {
    for (let i = 0; i < activeBirds.length; i++) {
      activeBirds[i].show();
    }
    // If we're out of birds go to the next generation
    if (activeBirds.length == 0) {
      nextGeneration();
    }
  }
}