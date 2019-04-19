import * as p2 from "p2";

export default class Wheel {

    constructor(x, y, radius, segments, pinRadius, pinDistance, ppm, physicsHeight, world, pinMaterial, ctx){

        this.x = x;
        this.y = y;
        this.radius= radius;
        this.segments = segments;
        this.pinRadius = pinRadius;
        this.pinDistance = pinDistance;
        this.ppm = ppm;
        this.physicsHeight = physicsHeight;
        this.world = world;
        this.pinMaterial= pinMaterial;
        this.ctx = ctx;

        this.posX = this.x * this.ppm;
        this.posY = (this.physicsHeight - this.y) * this.ppm;
        this.pRadius = this.radius * this.ppm;
        this.pPinRadius = this.pinRadius * this.ppm;
        this.pPinPositions = [];

        this.deltaPI = (Math.PI * 2) / this.segments;

        this.body =  new p2.Body({
            mass: 1,
            position: [this.x, this.y]
        });

        this._createBody();
        this._createPins();

    }

    _createBody = () => {

        this.body.angularDamping = 0.0;
        this.body.addShape(new p2.Circle({radius: this.radius}));
        this.body.shapes[0].sensor = true;

        let axis = new p2.Body({
            position: [this.x, this.y]
        });
        let constraint = new p2.LockConstraint(this.body, axis);
        constraint.collideConnected = false;

        this.world.addBody(this.body);
        this.world.addBody(axis);
        this.world.addConstraint(constraint);

    }

    _createPins = () => {

        let nbSegments = this.segments;

        for (let i = 0; i < nbSegments; i++){

            let pin = new p2.Circle({radius: this.pinRadius});

            pin.Material = this.pinMaterial;

            let x = Math.cos(i / nbSegments * (Math.PI * 2)) * this.pinDistance;
            let y = Math.sin(i / nbSegments * (Math.PI * 2)) * this.pinDistance;

            this.body.addShape(pin, [x, y]);
            this.pPinPositions[i] = [x * this.ppm, -y * this.ppm];

        }

    }

    gotLucky = () => {

        let currentPosition = this.body.angle % (Math.PI * 2);
        let currentSegment = Math.floor(currentPosition / this.deltaPI);

        return (currentSegment % 2 === 0);

    }

    draw = () => {

        this.ctx.save();
        this.ctx.translate(this.posX, this.posY);

        this.ctx.beginPath();
        this.ctx.fillStyle = "#DB9E36";
        this.ctx.arc(0,0, this.pRadius + 24, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.fillRect(-12,0,24,400);

        this.ctx.rotate(-this.body.angle);

        for (let i = 0; i < this.segments; i++){

            this.ctx.fillStyle = (i % 2 === 0) ? '#BD4932' : '#FFFAD5';
            this.ctx.beginPath();
            this.ctx.arc(0, 0, this.pRadius, i * this.deltaPI, (i + 1) * this.deltaPI);
            this.ctx.lineTo(0, 0);
            this.ctx.closePath();
            this.ctx.fill();

        }

        this.ctx.fillStyle = '#401911';

        for (let pin of this.pPinPositions){
            this.ctx.beginPath();
            this.ctx.arc(pin[0], pin[1], this.pPinRadius, 0, Math.PI * 2);
            this.ctx.fill();
        }

        this.ctx.restore();

    }

}