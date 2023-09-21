import Alien from '../assets/invaders.png'
import GameObject from './GameObject'

export default class Enemy extends GameObject {
  constructor() {
    super()
    this.speed = 0.2
    this.setImage(Alien, 50, 50)
    this.tag = 'enemy'
  }

  update(deltaTime: number, pressedKey: string | null) {
    if (this.x < 400 - 20 - this.width) {
      this.move(1, 0, deltaTime)
    }

    if (this.x > 20) {
      this.move(-1, 0, deltaTime)
    }
  }
}
