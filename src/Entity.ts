import { Container, type EventMode } from 'pixi.js'

interface Dimensions {
  x: number
  y: number
  width: number
  height: number
}

export interface EntityParams {
  dimensions?: Partial<Dimensions>
  scale?: number
  cursor?: string
  eventMode?: EventMode
  centerScaling?: boolean
}

export class Entity {
  readonly dimensions: Dimensions
  readonly container: Container

  constructor({
    dimensions,
    scale,
    cursor,
    eventMode
  }: EntityParams) {
    this.dimensions = {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      ...dimensions
    }

    this.container = new Container({
      scale,
      cursor,
      eventMode,
    })

    this.container.x = this.dimensions.x + this.dimensions.width / 2
    this.container.y = this.dimensions.y + this.dimensions.height / 2
    this.container.pivot = {
      x: this.dimensions.width / 2,
      y: this.dimensions.height / 2
    }
  }

  public addChild(...args: Container[]) {
    this.container.addChild(...args)
    return this
  }
}
