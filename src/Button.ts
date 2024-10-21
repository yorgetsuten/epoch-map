import type { EventMode, FederatedEventHandler, Sprite } from 'pixi.js'
import type { EntityParams } from './Entity'

import { Entity } from './Entity'

export interface ButtonParams extends EntityParams {
  onClick: FederatedEventHandler
  eventMode: EventMode
  staticSprite: Sprite
  clickedSprite?: Sprite
}

export class Button extends Entity {
  constructor({
    onClick,
    eventMode,
    staticSprite,
    clickedSprite,
    ...rest
  }: ButtonParams) {
    super(rest)

    this.container.cursor = 'pointer'
    this.container.eventMode = eventMode
    this.container.addChild(staticSprite)

    this.container.onpointerdown = () => {
      this.container.scale.x -= 0.1
      this.container.scale.y -= 0.1

      document.onpointerup = () => {
        document.onpointerup = null
        this.container.onpointerup = null
        this.container.scale.x += 0.1
        this.container.scale.y += 0.1
      }

      this.container.onpointerup = onClick
    }
  }
}
