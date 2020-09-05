export default class Backdrop {
    canvas: HTMLCanvasElement;
    hills: any[];

    constructor(game) {
        this.canvas = document.createElement("canvas");
        this.canvas.width = game.canvas.width;
        this.canvas.height = game.canvas.height;
        let ctx = this.canvas.getContext("2d");
        let hills = [];

        let colours = ["#063", "#043", "#086", "#0b3"];
        let i = 0;
        for (let col of colours) {
            let theta = Math.random() * 2 * Math.PI;
            let dTheta = (Math.random() + 1.5) * Math.PI / this.canvas.width;
            let penTheta = Math.random() * 2 * Math.PI;

            let dPenTheta = (Math.random() + 2) * 2 * Math.PI / this.canvas.width;
            let vTheta = (Math.random() - 0.5) * Math.PI * (i + 5) / 10;

            hills.push({
                theta, dTheta, penTheta, dPenTheta, y: (i + 5) / 10 * this.canvas.height, col, vTheta,
            });
            i ++;
        }
        this.hills = hills;

        this.paint(ctx);
    }

    update(dt) {
        return;
        if (!dt) return;
        dt /= 1000;
        for (let hill of this.hills) {
            hill.theta += hill.vTheta * dt;
            hill.penTheta += hill.vTheta * (Math.random() / 10 + 0.95) * dt;
        }
    }

    draw(ctx) {
        ctx.drawImage(this.canvas, 0, 0);
        // this.paint(ctx);
    }

    paint(ctx) {
        ctx.fillStyle = "#8cf";
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        for (let hill of this.hills) {
            this.rollingHillside(ctx, hill);
        }
    }

    rollingHillside(ctx, {y, col, theta, dTheta, penTheta, dPenTheta}) {
        ctx.globalAlpha = 1;
        let height = this.canvas.height / 8;
        let rad = 2;

        ctx.strokeStyle = col;
        ctx.lineWidth = rad;
        ctx.fillStyle = "black";
        for (let x = 0; x < this.canvas.width; x++) {

            theta += dTheta;
            penTheta += dPenTheta;

            let dy = height * Math.sin(theta);
            let r = rad * (2 + Math.sin(penTheta));
            ctx.beginPath();
            ctx.moveTo(x, y + dy);
            ctx.lineTo(x, this.canvas.height);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(x, y + dy, r, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

}