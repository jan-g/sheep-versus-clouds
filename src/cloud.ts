interface bounds {x: {min: number, max: number}, y: {min: number, max: number}};
interface vec {x: number, y: number};

export default class Cloud {
    width: number;
    height: number;
    alive: boolean;
    dying: number;
    bounds: bounds;
    position: vec;
    velocity: vec;
    circles: any[];

    constructor(game) {
        this.width = 80;
        this.height = 40;
        this.bounds = {
            x: {min: -this.width, max: this.width + game.canvas.width},
            y: {min: this.height / 2, max: game.canvas.height / 2},
        }
        this.fire();
    }

    fire() {
        this.alive = true;
        this.dying = 0;

        this.position = {
            x: (Math.random() * (this.bounds.x.max - this.bounds.x.min)) + this.bounds.x.min,
            y: (Math.random() * (this.bounds.y.max - this.bounds.y.min)) + this.bounds.y.min,
        };
        this.velocity = {
            x: (Math.random() - 0.5) * this.width / 6,
            y: 0,
        }

        // A cloud is drawn as a series of circles, white overlapping black
        this.circles = [];
        for (let i=6; i > 2; i--) {
            let r = i * this.height / 5;
            this.circles.push({
                x0: (Math.random() - 0.5) * this.width,
                y0: (Math.random() - 0.5) * this.height,
                theta0x: Math.random() * Math.PI * 2,
                dtheta0x: (Math.random() + 2.5) * 720,
                theta0y: Math.random() * Math.PI * 2,
                dtheta0y: (Math.random() + 7.5) * 360,
                r0: r * 1.2,
                r1: r,
                r1b: this.height / 15,
                theta1: Math.random() * Math.PI * 2,
                dtheta1: (Math.random() + 1) * 540,
            });
        }
    }

    update(dt) {
        if (!dt) return;
        if (!this.alive && this.dying === 0) return;
        for (let circle of this.circles) {
            circle.theta0x += Math.PI * dt / circle.dtheta0x;
            circle.theta0y += Math.PI * dt / circle.dtheta0y;
            circle.x0 = this.width * Math.cos(circle.theta0x) / 2;
            circle.y0 = this.height * -Math.abs(Math.cos(circle.theta0y)) / 2;
            circle.theta1 += Math.PI * dt / circle.dtheta1;
            circle.x1 = circle.x0 + circle.r1b * Math.cos(circle.theta1);
            circle.y1 = circle.y0 + circle.r1b * Math.sin(circle.theta1);
            if (this.dying > 0) {
                circle.r0 *= 0.95;
                circle.r1 *= 0.95;
            }
        }
        this.position.x += this.velocity.x;
        if (this.position.x < this.bounds.x.min) this.position.x = this.bounds.x.max;
        else if (this.position.x > this.bounds.x.max) this.position.x = this.bounds.x.min;
        this.position.y += this.velocity.y;
        if (this.dying > 0) {
            this.dying -= 1;
        }
    }

    draw(ctx) {
        if (!this.alive && this.dying === 0) return;
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.fillStyle = "black";
        for (const circle0 of this.circles) {
            ctx.beginPath();
            ctx.arc(circle0.x0, circle0.y0, circle0.r0, 0, 2 * Math.PI);
            ctx.fill();
        }
        ctx.fillStyle = "white";
        for (const circle1 of this.circles) {
            ctx.beginPath();
            ctx.arc(circle1.x1, circle1.y1, circle1.r1, 0, 2 * Math.PI);
            ctx.fill();
        }
        ctx.restore();
    }

    collide(ball) {
        if (!this.alive) return null;
        const {x, y, r} = ball.position;
        if (x + r < this.position.x - this.width / 2 || x - r > this.position.x + this.width / 2) return null;
        if (y + r < this.position.y - this.height / 2 || y - r > this.position.y + this.height / 2) return null;
        // return a unit vector pointing from the cloud to the ball
        let dx = x - this.position.x;
        let dy = y - this.position.y;
        let dr = Math.sqrt(dx * dx + dy * dy);
        dx /= dr;
        dy /= dr;
        return {dx, dy};
    }

    pop() {
        this.alive = false;
        this.dying = 20;
    }
}
