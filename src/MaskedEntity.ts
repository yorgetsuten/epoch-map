import type { Graphics } from 'pixi.js'

import { Entity, type EntityParams } from './Entity'
import { Container } from 'pixi.js'

export interface MaskedEntityParams extends EntityParams {
  mask: Graphics
}

export class MaskedEntity extends Entity {
  protected maskContainer: Container
  protected maskedContentContainer: Container

  constructor({ mask, ...rest }: MaskedEntityParams) {
    super(rest)

    this.maskedContentContainer = new Container()
    this.maskContainer = new Container({
      cursor: 'grab',
      eventMode: 'static'
    })

    this.maskContainer.mask = mask
    this.maskContainer.addChild(mask)
    this.maskContainer.addChild(this.maskedContentContainer)
    this.container.addChild(this.maskContainer)

    this.maskContainer.onwheel = (event) => {
      this.maskedContentContainer.x = this.clampNewX(
        this.maskedContentContainer.x + event.deltaX + event.deltaY
      )
    }

    this.maskContainer.onpointerdown = (event) => {
      let prevX = event.clientX

      this.maskContainer.cursor = 'grabbing'

      document.onpointermove = (event) => {
        const deltaX = event.clientX - prevX

        prevX = event.clientX
        this.maskedContentContainer.x = this.clampNewX(
          this.maskedContentContainer.x + deltaX
        )
      }
      document.onpointerup = () => {
        prevX = 0
        document.onpointerup = null
        document.onpointermove = null
        this.maskContainer.cursor = 'grab'
      }
    }
  }

  public addMaskedChild(...args: Container[]) {
    this.maskedContentContainer.addChild(...args)
    return this
  }

  private clampNewX(newX: number) {
    if (newX > 0) {
      return 0
    } else if (
      newX + this.maskedContentContainer.width <
      this.dimensions.width
    ) {
      return this.dimensions.width - this.maskedContentContainer.width
    } else {
      return newX
    }
  }
}
