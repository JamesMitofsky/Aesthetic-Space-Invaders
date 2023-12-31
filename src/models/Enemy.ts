import Alien from '../assets/invaders.png'
import GameObject from './GameObject'

export default class Enemy extends GameObject {
  constructor() {
    super()
    this.speed = 0.05
    this.setImage(Alien, 60, 60)
    this.tag = 'enemy'
    this.directionX = 1
    this.speedY = 7;
  }

  update(deltaTime: number, pressedKey: string | null) {
    this.move(this.directionX, 0, deltaTime)
  }
}
