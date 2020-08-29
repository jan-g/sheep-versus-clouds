export default class Ball {
    constructor(game, assets) {
        this.paddle = game.paddle;
        this.assets = assets;

        this.width = 100;
        this.height = 100;

        this.maxV = 300;
        this.gravity = 200;
        this.bounce = 15;

        this.angle = Math.random() * 2 * Math.PI;
        this.spin = Math.random() * 2 * Math.PI;

        this.position = {
            x: game.canvas.width / 2,
            y: Math.random() * game.canvas.height * 0.5 + this.height * 0.6,
        };
        this.velocity = {
            x: (Math.random() * 2 - 1) * this.maxV,
            y: 0,
        }

        this.bounds = {
            x: { min: this.width / 2, max: game.canvas.width - this.width / 2, },
            y: { min: this.height / 2, max: game.canvas.height + this.height, },
        }
        this.alive = false;
    }

    fire(position) {
        this.alive = true;
        this.position = {...position, y: this.bounds.y.max};
        this.velocity = {
            x: (Math.random() * 2 - 1) * this.maxV,
            y: (Math.random() * -3) * this.maxV,
        };
        this.assets.boing.currentTime = 0;
        this.assets.boing.play();
    }

    draw(ctx) {
        if (!this.alive) return;
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.angle);
        ctx.drawImage(this.assets.image, -this.width / 2, -this.height / 2, this.width, this.height);
        ctx.restore();
    }

    update(dt) {
        if (!dt) return;
        if (!this.alive) return;

        this.accelerate(dt / 1000);
        this.move(dt / 1000);
    }

    accelerate(dt) {
        this.velocity.y += this.gravity * dt;
        this.spin *= 0.99;
    }

    move(dt) {
        this.angle += this.spin * dt;

        this.position.x += this.velocity.x * dt;
        if (this.position.x < this.bounds.x.min || this.position.x > this.bounds.x.max) {
            this.position.x -= this.velocity.x * dt;
            this.velocity.x = -this.velocity.x;
        }
        this.position.y += this.velocity.y * dt;
        if (this.position.y < this.bounds.y.min) {
            this.position.y = this.bounds.y.min;
            this.velocity.y = 0;
        } else if (this.velocity.y > 0 &&
                   this.position.y + this.height / 2 >= this.paddle.position.y - this.paddle.height / 2 &&
                   this.position.y + this.height / 2 <= this.paddle.position.y + this.paddle.height / 2 &&
                   this.position.x >= this.paddle.position.x - this.paddle.width / 2 &&
                   this.position.x <= this.paddle.position.x + this.paddle.width / 2
        ) {
                // Bounce!
                this.position.y -= this.velocity.y * dt;
                this.velocity.y = -this.velocity.y - this.bounce;
                this.spin += 2 * Math.PI;
                this.assets.baa.currentTime = 0;
                this.assets.baa.play();
        } else if (this.position.y > this.bounds.y.max) {
            this.position.y -= this.velocity.y * dt;
            this.velocity.y = -this.velocity.y;
            this.alive = false;
            this.assets.ohNo.currentTime = 0;
            this.assets.ohNo.play();
        }
    }
}