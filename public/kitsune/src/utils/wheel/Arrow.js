import * as p2 from "p2";

export default class Arrow{

    constructor(x, y, w, h, ppm , physicsHeight, world, arrowMaterial, ctx){

        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.verts = [];
        this.ppm = ppm;
        this.physicsHeight = physicsHeight;
        this.world = world;
        this.arrowMaterial= arrowMaterial;
        this.ctx = ctx;

        this.pX = this.x * this.ppm;
        this.pY = (this.physicsHeight - this.y) * this.ppm;
        this.pVerts = [];

        this._createBody();

    }

    _createBody = () => {

        this.body = new p2.Body({mass:1, position:[this.x, this.y]});
        this.body.addShape(this.createArrowShape());

        let axis = new p2.Body({position:[this.x, this.y]});
        let constraint = new p2.RevoluteConstraint(this.body, axis, {
            worldPivot:[this.x, this.y]
        });
        constraint.collideConnected = false;

        let left = new p2.Body({position:[this.x - 2, this.y]});
        let right = new p2.Body({position:[this.x + 2, this.y]});
        let leftConstraint = new p2.DistanceConstraint(this.body, left, {
            localAnchorA:[-this.w * 2, this.h * 0.25],
            collideConnected:false
        });
        let rightConstraint = new p2.DistanceConstraint(this.body, right, {
            localAnchorA:[this.w * 2, this.h * 0.25],
            collideConnected:false
        });
        let s = 32,
            r = 4;

        leftConstraint.setStiffness(s);
        leftConstraint.setRelaxation(r);
        rightConstraint.setStiffness(s);
        rightConstraint.setRelaxation(r);

        this.world.addBody(this.body);
        this.world.addBody(axis);
        this.world.addConstraint(constraint);
        this.world.addConstraint(leftConstraint);
        this.world.addConstraint(rightConstraint);

    }

    createArrowShape = () => {
        this.verts[0] = [0, this.h * 0.25];
        this.verts[1] = [-this.w * 0.5, 0];
        this.verts[2] = [0, -this.h * 0.75];
        this.verts[3] = [this.w * 0.5, 0];

        this.pVerts[0] = [this.verts[0][0] * this.ppm, -this.verts[0][1] * this.ppm];
        this.pVerts[1] = [this.verts[1][0] * this.ppm, -this.verts[1][1] * this.ppm];
        this.pVerts[2] = [this.verts[2][0] * this.ppm, -this.verts[2][1] * this.ppm];
        this.pVerts[3] = [this.verts[3][0] * this.ppm, -this.verts[3][1] * this.ppm];

        let shape = new p2.Convex({vertices: this.verts});
        shape.material = this.arrowMaterial;

        return shape;
    }

    hasStopped = () => {
        let angle = Math.abs(this.body.angle % (Math.PI * 2));

        return (angle < 1e-3 || ((Math.PI * 2) - angle) < 1e-3);
    }

    draw = () => {
        this.ctx.save();
        this.ctx.translate(this.pX, this.pY);
        this.ctx.rotate(-this.body.angle);

        this.ctx.fillStyle = '#401911';

        this.ctx.beginPath();
        this.ctx.moveTo(this.pVerts[0][0], this.pVerts[0][1]);
        this.ctx.lineTo(this.pVerts[1][0], this.pVerts[1][1]);
        this.ctx.lineTo(this.pVerts[2][0], this.pVerts[2][1]);
        this.ctx.lineTo(this.pVerts[3][0], this.pVerts[3][1]);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.restore();
    }

}