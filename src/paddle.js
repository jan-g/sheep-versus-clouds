export default class Paddle {

    constructor(game) {
        this.game = game;
        this.width = 150;
        this.height = 30;
        this.position = {
          x: game.canvas.width / 2,
          y: game.canvas.height - this.height - 10,
        };
        this.velocity = {
            x: 0,
            y: 0,
        }
        this.acceleration = {
            x: {left: false, right: false},
            y: {up: false, down: false},
        }

        this.bounds = {
            x: { min: this.width / 2, max: game.canvas.width - this.width / 2, },
            y: { min: this.height / 2, max: game.canvas.height - this.height / 2, },
        }

        this.deltaV = 35;
        this.maxV = 800;
        this.fadeV = 0.98;
    }

    draw(ctx) {
        ctx.fillStyle = "#064";
        ctx.fillRect(this.position.x - this.width / 2, this.position.y - this.height / 2, this.width, this.height);
    }

    update(dt) {
        if (!dt) return;
        this.accelerate(dt / 1000);
        this.move(dt / 1000);
    }

    // Acceleration impulses
    left() { this.acceleration.x.left = 1; }
    left_up() { this.acceleration.x.left = 0; }
    right() { this.acceleration.x.right = 1; }
    right_up() { this.acceleration.x.right = 0; }

    // Velocity changes
    accelerate(dt) {
        this.velocity.x = clamp(-this.maxV, this.maxV, (this.velocity.x + this.deltaV * (this.acceleration.x.right - this.acceleration.x.left) / dt) * this.fadeV);
        this.velocity.y = clamp(-this.maxV, this.maxV, (this.velocity.y + this.deltaV * (this.acceleration.y.down - this.acceleration.y.up) / dt) * this.fadeV);
    }

    // Position changes
    move(dt) {
        this.position.x += this.velocity.x * dt;
        if (this.position.x < this.bounds.x.min) {
            this.velocity.x = -this.velocity.x;
            this.position.x = this.bounds.x.min + this.velocity.x * dt;
        } else if (this.position.x > this.bounds.x.max) {
            this.velocity.x = -this.velocity.x;
            this.position.x = this.bounds.x.max + this.velocity.x * dt;
        }
        this.position.y += this.velocity.y * dt;
        if (this.position.y < this.bounds.y.min) {
            this.velocity.y = -this.velocity.y;
            this.position.y = this.bounds.y.min + this.velocity.y * dt;
        } else if (this.position.y > this.bounds.y.max) {
            this.velocity.y = -this.velocity.y;
            this.position.y = this.bounds.y.max + this.velocity.y * dt;
        }
    }

    fire() {
        for (let ball of this.game.balls) {
            if (!ball.alive) {
                ball.fire(this.position);
                break;
            }
        }
    }

}

function clamp(lower, upper, value) {
    return Math.max(lower, Math.min(upper, value));
}