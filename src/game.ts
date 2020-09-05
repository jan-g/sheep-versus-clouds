import Paddle from "./paddle.js";
import InputHandler from "./input.js";
import Ball from "./ball.js";
import Cloud from "./cloud.js";
import Backdrop from "./backdrop.js";

export default class Game {
    backdrop: Backdrop;
    paddle: Paddle;
    input: InputHandler;
    balls: Ball[];
    assets: object;
    clouds: Cloud[];
    won: boolean;
    canvas: HTMLCanvasElement;

    constructor(canvas, assets) {
        this.canvas = canvas;
        this.assets = assets;

        this.start();
    }

    start() {
        this.backdrop = new Backdrop(this);
        this.paddle = new Paddle(this);
        this.input = new InputHandler(this.paddle);
        this.balls = [new Ball(this, this.assets),
                      new Ball(this, this.assets),
                      new Ball(this, this.assets)];
        this.clouds = [];
        for (let i=0; i < 10; i++)
            this.clouds.push(new Cloud(this));
        this.won = false;
    }

    update(dt) {
        if (!dt) return;
        this.backdrop.update(dt);
        this.paddle.update(dt);
        for (let ball of this.balls) ball.update(dt);
        let alive = 0;
        for (let cloud of this.clouds) {
            cloud.update(dt);
            if (cloud.alive) alive ++;
        }

        // Collisions
        for (let ball of this.balls) {
            if (!ball.alive) continue;
            for (let cloud of this.clouds) {
                let normal = cloud.collide(ball);
                if (normal) {
                    cloud.pop();
                    ball.bounce(normal);
                    break;
                }
            }
        }

        if (!this.won && alive === 0) this.win();
    }

    win() {
        this.won = true;
        for (let i=0; i < 20; i++) {
            this.balls.push(new Ball(this, this.assets));
        }
        for (const ball of this.balls) {
            ball.fire(this.paddle.position);
        }
    }

    draw(ctx) {
        // ctx.drawImage(this.assets.backdrop, 0, 0);
        this.backdrop.draw(ctx);
        this.paddle.draw(ctx);
        for (let ball of this.balls) ball.draw(ctx);
        for (let cloud of this.clouds) cloud.draw(ctx);
    }
}