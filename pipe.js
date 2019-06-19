function Pipe() {

  var spacing = random(123, 150);
  var center = random(spacing, height - spacing);

  this.top = center - spacing / 2;
  this.bot = height - center - spacing / 2;
  this.x = width;
  this.w = 30;
  this.speed = 4;
  this.gap = height - this.top - this.bot;

  this.hurt = false;

  // ! Don't do this, crash the UI
  // while (this.gap < 80 || this.gap > 120) {
  //   this.top = random(height / 2);
  //   this.bot = random(height / 2);
  // }

  // this.getpipe = function () {
  //   while (gap > 80 && gap < 120) {
  //     this.top = random(height / 2);
  //     this.bot = random(height / 2);
  //   }
  // }

  this.show = function () {
    if (this.hurt) {
      fill(255, 0, 0);
    } else {
      fill(255);
    }

    rect(this.x, 0, this.w, this.top);
    rect(this.x, height - this.bot, this.w, this.bot);

  }

  this.update = function () {
    this.x -= this.speed;
  }

  this.offScreen = function () {
    return this.x < - this.w;
  }

  this.hit = function (bird) {

    if ((bird.y < this.top || bird.y > height - this.bot)
      && (bird.x > this.x && bird.x < this.x + this.w)) {
      this.hurt = true;
      return true;
    }
    this.hurt = false;
    return false;
  }
}

