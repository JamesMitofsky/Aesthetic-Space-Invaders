import type { Key } from '@/types/key'

export default class GameObject {
  x: number
  y: number
  width: number
  height: number
  image: any
  speed: number
  children: GameObject[]
  tag: 'enemy' | 'player' | 'default'
  directionX: number
  directionY: number
  speedY: number

  constructor() {
    this.x = 0
    this.y = 0
    this.width = 0
    this.height = 0
    this.image = null
    this.speed = 0
    this.children = []
    this.tag = 'default'
    this.directionX = 1
    this.directionY = 0
    this.speedY = 3
  }

  mainUpdate(dt: number, key: Key) {
    this.update(dt, key)
    for (const child of this.children) {
      child.mainUpdate(dt, key)
    }
  }

  update(dt: number, key: Key) {}

  setPosition(x: number, y: number) {
    // set x and y position
    this.x = x
    this.y = y
  }

  setImage(imagePath: string, width: number, height: number) {
    // set an instance of image class and its size
    this.width = width
    this.height = height
    this.image = new Image(width, height)
    this.image.src = imagePath
  }

  setSpeed(speed: number) {
    this.speed = speed
  }

  move(dirX: number, dirY: number, deltaTime: number) {
    this.x += dirX * this.speed * deltaTime
    this.y += dirY * this.speed * deltaTime
  }

  draw(context: CanvasRenderingContext2D | null) {
    if (this.image) {
      context?.drawImage(this.image, this.x, this.y, this.width, this.height)
      for (const child of this.children) {
        child.draw(context)
      }
    } else {
      console.error('image is not set')
      return
    }
  }
}
