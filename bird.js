// Mutation function to be passed into bird.brain
function mutate(x) {
  if (random(1) < 0.1) {
    let offset = randomGaussian() * 0.5;
    let newx = x + offset;
    return newx;
  } else {
    return x;
  }
}

class Bird {
  constructor(brain) {
    this.y = height / 2;
    this.x = 59;
    this.grav = 0.6;
    this.velo = 0;
    this.acce = -16;

    this.width = 32;
    this.height = 32;

    this.r = random(255);
    this.g = random(255);
    this.b = random(255);

    this.score = 0;
    this.fitness = 0;

    if (brain instanceof NeuralNetwork) {
      this.brain = brain.copy();
       // TODO: mutate or no
    } else {
      this.brain = new NeuralNetwork(5, 8, 2);
    }
  }

  mutateBrain() {
    this.brain.mutate(mutate);
  }

  copy() {
    return new Bird(this.brain);
  }

  think = (pipes) => {
    // First find the closest pipe
    let closest = null;
    let record = Infinity;
    for (let i = 0; i < pipes.length; i++) {
      let diff = pipes[i].x - this.x;
      if (diff > 0 && diff < record) {
        record = diff;
        closest = pipes[i];
      }
    }

    if (closest) {
      // Now create the inputs to the neural network
      let inputs = [];
      // x position of closest pipe
      inputs[0] = map(closest.x, this.x, width, 0, 1);
      // top of closest pipe opening
      inputs[1] = map(closest.top, 0, height, 0, 1);
      // bottom of closest pipe opening
      inputs[2] = map(closest.bot, 0, height, 0, 1);
      // bird's y position
      inputs[3] = map(this.y, 0, height, 0, 1);
      // bird's y velocity
      inputs[4] = map(this.velo, -5, 5, 0, 1);

      // Get the outputs from the network
      let action = this.brain.predict(inputs);
      // Decide to jump or not!
      if (action[1] > action[0]) {
        this.up();
      }
    }
  }

  bottomTop() {
    // Bird dies when hits bottom?
    // return (this.y > height || this.y < 0);
    return (this.y >= height);
  }

  show = function () {
    fill(this.r, this.g, this.b);
    stroke(255);
    ellipse(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
  };

  up = function () {
    this.velo += this.acce;
  };

  update = function () {
    this.score++;
    this.velo += this.grav;
    this.velo *= 0.9;
    this.y += this.velo;

    if (this.y > height) {
      this.y = height;
      this.velo = 0;
    }

    if (this.y < 16) {
      this.y = 16;
      this.velo = 0;
    }
  };
}
