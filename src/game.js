import Paddle from "./paddle.js";
import InputHandler from "./input.js";
import Ball from "./ball.js";

export default class Game {
    constructor(canvas, assets) {
        this.canvas = canvas;
        this.assets = assets;
        this.start();
    }

    start() {
        this.paddle = new Paddle(this);
        this.input = new InputHandler(this.paddle);
        this.balls = [new Ball(this, this.assets),
                      new Ball(this, this.assets),
                      new Ball(this, this.assets)];
    }

    update(dt) {
        if (!dt) return;
        this.paddle.update(dt);
        for (let ball of this.balls) ball.update(dt);
    }

    draw(ctx) {
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.paddle.draw(ctx);
        for (let ball of this.balls) ball.draw(ctx);
    }
}