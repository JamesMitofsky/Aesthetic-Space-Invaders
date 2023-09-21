import GameObject from './Game0bject'
import SpaceshipImage from '../assets/spaceship.png'
import Missile from './Missile'

export default class Player extends GameObject {
  shootDelay: number
  shootTimer: number
  constructor() {
    super()
    this.speed = 0.2
    this.setImage(SpaceshipImage, 50, 50)
    this.shootDelay = 300
    this.shootTimer = 0
  }

  update(deltaTime: number, pressedKey: string | null) {
    this.shootTimer -= deltaTime

    if (pressedKey === 'ArrowRight' && this.x < 400 - 20 - this.width) {
      this.move(1, 0, deltaTime)
    }

    if (pressedKey === 'ArrowLeft' && this.x > 20) {
      this.move(-1, 0, deltaTime)
    }

    if (pressedKey === ' ' && this.shootTimer <= 0) {
      const missile = new Missile()
      missile.setPosition(this.x + this.width / 2 - missile.width / 2, this.y)
      this.children.push(missile)
      this.shootTimer = this.shootDelay
    }
  }
}
