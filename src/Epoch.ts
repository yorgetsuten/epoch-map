import { Entity, type EntityParams } from './Entity'
import { Batalion, type BatalionParams } from './Batalion'
import { Assets, Sprite } from 'pixi.js'

export interface EpochParams extends EntityParams {
  title: string
  iconName: string
  roadName: string
  windowName: string
  batalions: Batalion[]
}

export class Epoch extends Entity {
  private title: string
  private iconName: string
  private roadName: string
  private windowName: string
  private batalions: Batalion[]

  constructor({ title, iconName, roadName, windowName, batalions, ...rest }: EpochParams) {
    super(rest)

    const windowSprite = new Sprite(Assets.get(`era_window/${windowName}.jpg`))
    

    this.addChild(windowSprite)

    this.title = title
    this.iconName = iconName
    this.roadName = roadName
    this.windowName = windowName
    this.batalions = batalions
  }
}
