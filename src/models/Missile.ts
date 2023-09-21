import Bullet from '../assets/bullets.png'
import GameObject from './GameObject'

export default class Missile extends GameObject {
  constructor() {
    super()
    this.setImage(Bullet, 10, 10)
    this.speed = 0.5
  }

  update(deltaTime: number, pressedKey: string | null) {
    this.move(0, -1, deltaTime)
  }
}
