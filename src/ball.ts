import Paddle from './paddle';
import Game from './game';

interface position {x: number, y: number, r: number};
interface vec<T> {x: T, y: T};
interface bound {min: number, max: number};

export default class Ball {
    paddle: Paddle;
    assets: any;
    width: number;
    height: number;
    maxV: number;
    gravity: number;
    bounceY: number;
    angle: number;
    spin: number;
    position: position;
    velocity: vec<number>;
    bounds: vec<bound>;
    alive: boolean;

    constructor(game: Game, assets) {
        this.paddle = game.paddle;
        this.assets = assets;

        this.width = 100;
        this.height = 100;

        this.maxV = 300;
        this.gravity = 200;
        this.bounceY = 15;

        this.angle = Math.random() * 2 * Math.PI;
        this.spin = Math.random() * 2 * Math.PI;

        this.position = {
            x: game.canvas.width / 2,
            y: Math.random() * game.canvas.height * 0.5 + this.height * 0.6,
            r: this.width / 2,
        };

        this.velocity = {
            x: (Math.random() * 2 - 1) * this.maxV,
            y: 0,
        };

        this.bounds = {
            x: { min: this.width / 2, max: game.canvas.width - this.width / 2, },
            y: { min: this.height / 2, max: game.canvas.height + this.height, },
        };
        this.alive = false;
    }

    fire(position) {
        this.alive = true;
        this.position = {...this.position, ...position, y: this.bounds.y.max};
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
                this.velocity.y = -this.velocity.y - this.bounceY;
                this.velocity.x = clamp(-this.maxV, this.maxV, this.velocity.x + this.paddle.velocity.x * (Math.random() / 2 + 0.3));
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

    bounce({dx, dy}) {
        let {x, y} = this.velocity;
        const [px, py] = [dy, -dx];     // perpendicular normal

        // console.log("normal", dx, dy, "r=", Math.sqrt(dx * dx + dy * dy));
        // console.log("perp", px, py, "r=", Math.sqrt(px * px + py * py));
        this.assets.doing.currentTime = 0;
        this.assets.doing.play();

        // Work out velocity components
        const perpR = x * px + y * py;
        const alongR = x * dx + y * dy;
        // console.log("my velocity", x, y, "r=", Math.sqrt(x * x + y * y));

        // Bounce that sucker
        const [alongX, alongY] = [alongR * dx, alongR * dy];
        const [perpX, perpY] = [perpR * px, perpR * py];

        // console.log("component of velocity along normal = ", alongX, alongY, "r=", Math.sqrt(alongX * alongX + alongY * alongY));
        // console.log("component of velocity along perp = ", perpX, perpX, "r=", Math.sqrt(perpX * perpX + perpY * perpY));

        x = -alongX + perpX;
        y = -alongY + perpY;

        // console.log("my new velocity", x, y, "r=", Math.sqrt(x * x + y * y));
        // console.stopThis();

        this.velocity.x = x;
        this.velocity.y = y;
    }
}

function clamp(lower, upper, value) {
    return Math.max(lower, Math.min(upper, value));
}