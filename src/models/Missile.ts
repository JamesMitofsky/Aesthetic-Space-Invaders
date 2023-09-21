import GameObject from "./Game0bject";
import Bullet from "../assets/bullets.png";

export default class Missile extends GameObject {
    constructor() {
        super();
        this.setImage(Bullet, 10, 10);
        this.speed = 0.5;
    }

    update(deltaTime: number, pressedKey: string | null) {
        this.move(0, -1, deltaTime);
    }
}