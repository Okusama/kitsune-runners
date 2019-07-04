import {cubeBezier, Ease} from "./math";

export default class Particle {

    constructor(p0, p1, p2, p3, ctx, timeStep) {

        this.p0 = p0;
        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;

        this.ctx = ctx;
        this.timeStep = timeStep;

        this.time = 0;
        this.duration = 3 + Math.random() * 2;
        this.color =  'hsl(' + Math.floor(Math.random() * 360) + ',100%,50%)';

        this.w = 10;
        this.h = 7;

        this.complete = false;

    }

    update = () => {

        this.time = Math.min(this.duration, this.time + this.timeStep);

        let f = Ease.outCubic(this.time, 0, 1, this.duration);
        let p = cubeBezier(this.p0, this.p1, this.p2, this.p3, f);

        let dx = p.x - this.x;
        let dy = p.y - this.y;

        this.r =  Math.atan2(dy, dx) + (Math.PI * 0.5);
        this.sy = Math.sin(Math.PI * f * 10);
        this.x = p.x;
        this.y = p.y;

        this.complete = this.time === this.duration;

    }

    draw = () => {

        this.ctx.save();
        this.ctx.translate(this.x, this.y);
        this.ctx.rotate(this.r);
        this.ctx.scale(1, this.sy);

        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(-this.w * 0.5, -this.h * 0.5, this.w, this.h);

        this.ctx.restore();

    }

}
