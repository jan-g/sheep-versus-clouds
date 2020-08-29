import Game from './game.js';

let game;
let ctx;

export function start(canvas, assets) {
    ctx = canvas.getContext("2d");
    game = new Game(canvas, assets);

    lastTime = 0;
    requestAnimationFrame(gameLoop);
    gameLoop();
}

let lastTime;

function gameLoop(ts) {
    let dt = ts - lastTime;
    lastTime = ts;

    game.update(dt);
    game.draw(ctx);

    requestAnimationFrame(gameLoop);
}