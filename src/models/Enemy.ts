import Alien from '../assets/invaders.png'
import GameObject from './GameObject'

export default class Enemy extends GameObject {
  constructor() {
    super()
    this.speed = 0.04
    this.setImage(Alien, 50, 50)
    this.tag = 'enemy'
    this.directionX = 1
  }

  update(deltaTime: number, pressedKey: string | null) {
    this.move(this.directionX, 0, deltaTime)
  }
}
