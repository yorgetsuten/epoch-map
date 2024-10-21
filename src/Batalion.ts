import { Sprite } from 'pixi.js'
import { Entity, type EntityParams } from './Entity'

export interface BatalionParams extends EntityParams {
  title: string
  iconName: string
  state: 'active' | 'inactive' | 'done'
}

export class Batalion extends Entity {
  private title: string
  private iconName: string
  protected state: 'active' | 'inactive' | 'done'

  constructor({ title, state, iconName, ...rest }: BatalionParams) {
    super(rest)

    this.title = title
    this.state = state
    this.iconName = iconName
  }
}
