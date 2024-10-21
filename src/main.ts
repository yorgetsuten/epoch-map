import {
  Application,
  Assets,
  Container,
  Graphics,
  Sprite,
  Text,
  TextStyle,
  Texture
} from 'pixi.js'

import { clamp, easeOutElastic, easeInOutQuad } from './lib'
import { MaskedEntity } from './MaskedEntity'
import { Button } from './Button'
import { Spine } from '@pixi/spine-pixi'
import 'normalize.css'

const app = new Application()

;(async () => {
  await app.init({
    width: innerWidth,
    height: innerHeight,
    resizeTo: window,
    resolution: devicePixelRatio,
    autoDensity: true,
    backgroundColor: 0x2c3e50
  })

  document.body.style.overflow = 'hidden'
  document.body.style.overscrollBehavior = 'none'
  document.getElementById('app')!.appendChild(app.canvas)

  // Loading assets

  const assetsToLoad = [
    'Montserrat.ttf',

    'Back_P_4.png',
    'Map_icon.png',
    'button_X.png',
    'button_Xd.png',

    'era_window/icon_diego.png',
    'era_window/icon_izabel.png',
    'era_window/icon_done.png',
    'era_window/icon_active.png',
    'era_window/icon_inactive.png',

    'era_window/era_map_0.jpg',
    'era_window/era_map_1.jpg',
    'era_window/era_map_2.jpg',
    'era_window/era_map_3.jpg',
    'era_window/era_map_4.jpg',
    'era_window/era_map_5.jpg',
    'era_window/era_map_6.jpg',
    'era_window/era_map_shadow.png',

    'era_window/path/gray/map_path_0.png',
    'era_window/path/gray/map_path_1.png',
    'era_window/path/gray/map_path_2.png',
    'era_window/path/gray/map_path_3.png',
    'era_window/path/gray/map_path_4.png',
    'era_window/path/gray/map_path_5.png',
    'era_window/path/gray/map_path_6.png',

    'era_window/path/green/map_path_0.png',
    'era_window/path/green/map_path_1.png',
    'era_window/path/green/map_path_2.png',
    'era_window/path/green/map_path_3.png',
    'era_window/path/green/map_path_4.png',
    'era_window/path/green/map_path_5.png',
    'era_window/path/green/map_path_6.png',

    'EpochMap_path/EpochMap_path.json',
    'EpochMap_path/EpochMap_path.atlas',

    'era_window/icons/District01.png',
    'era_window/icons/District01_inactive.png',
    'era_window/icons/District02.png',
    'era_window/icons/District02_inactive.png',
    'era_window/icons/District03.png',
    'era_window/icons/District03_inactive.png',
    'era_window/icons/District04.png',
    'era_window/icons/District04_inactive.png',
    'era_window/icons/District05.png',
    'era_window/icons/District05_inactive.png',
    'era_window/icons/District06.png',
    'era_window/icons/District06_inactive.png',
    'era_window/icons/District07.png',
    'era_window/icons/District07_inactive.png',
    'era_window/icons/District08.png',
    'era_window/icons/District08_inactive.png',
    'era_window/icons/District09.png',
    'era_window/icons/District09_inactive.png',
    'era_window/icons/District10.png',
    'era_window/icons/District10_inactive.png',
    'era_window/icons/District11.png',
    'era_window/icons/District11_inactive.png',
    'era_window/icons/District12.png',
    'era_window/icons/District12_inactive.png',
    'era_window/icons/District13.png',
    'era_window/icons/District13_inactive.png',
    'era_window/icons/District14.png',
    'era_window/icons/District14_inactive.png',
    'era_window/icons/District15.png',
    'era_window/icons/District15_inactive.png',
    'era_window/icons/District16.png',
    'era_window/icons/District16_inactive.png',
    'era_window/icons/District17.png',
    'era_window/icons/District17_inactive.png',
    'era_window/icons/District18.png',
    'era_window/icons/District18_inactive.png',
    'era_window/icons/District19.png',
    'era_window/icons/District19_inactive.png',
    'era_window/icons/District20.png',
    'era_window/icons/District20_inactive.png',
    'era_window/icons/iconComingSoon.png'
  ]

  assetsToLoad.forEach((asset) => Assets.add({ src: asset }))

  await Assets.load(assetsToLoad)

  // Map

  const epochMapDimensions = {
    x: 100,
    y: 100,
    width: window.innerWidth - 200,
    height: window.innerHeight - 200
  }

  const epochMap = new MaskedEntity({
    dimensions: epochMapDimensions,
    // x: epochMapDimensions.x + epochMapDimensions.width / 2,
    // y: epochMapDimensions.y + epochMapDimensions.height / 2,
    // pivot: {
    //   x: epochMapDimensions.width / 2,
    //   y: epochMapDimensions.height / 2
    // },
    mask: new Graphics()
      .roundRect(0, 0, epochMapDimensions.width, epochMapDimensions.height, 6)
      .fill(0xffffff)
  })

  const SCALE_FACTOR =
    epochMap.dimensions.height /
    Assets.get<Texture>('era_window/era_map_1.jpg').height

  const openMapButton = new Button({
    scale: SCALE_FACTOR,
    cursor: 'pointer',
    eventMode: 'static',
    dimensions: { x: innerWidth / 2, y: innerHeight / 2 },
    staticSprite: new Sprite({
      texture: Assets.get('Map_icon.png'),
      anchor: 0.5,
      y: 2
    }),
    onClick: () => {
      app.ticker.add(openMap)

      const duration = 1500
      const startTime = Date.now()

      function openMap() {
        const currentTime = Date.now()
        const progress = clamp((currentTime - startTime) / duration, 0, 1)

        epochMap.container.scale.set(easeOutElastic(progress))

        if (progress >= 0.4) app.ticker.remove(openMap)
      }
    }
  })

  const closeMapButton = new Button({
    dimensions: { x: epochMap.dimensions.width },
    scale: SCALE_FACTOR,
    eventMode: 'static',
    staticSprite: new Sprite({
      texture: Assets.get('button_X.png'),
      anchor: 0.5
    }),
    onClick: () => {
      app.ticker.add(closeMap)

      const duration = 250
      const startTime = Date.now()

      function closeMap() {
        const currentTime = Date.now()
        const progress = clamp((currentTime - startTime) / duration, 0, 1)

        epochMap.container.scale.set(easeInOutQuad(1 - progress))

        if (progress === 1) app.ticker.remove(closeMap)
      }
    }
  })

  epochMap.container.addChild(closeMapButton.container)

  app.stage.addChild(openMapButton.container, epochMap.container)

  epochMap.addChild(
    new Sprite({
      texture: Assets.get('Map_icon.png'),
      anchor: 0.5,
      zIndex: 1,
      x: epochMap.dimensions.width / 2,
      width: 64,
      height: 64
    })
  )

  const textStyle = new TextStyle({
    fontFamily: 'Montserrat',
    fontSize: 38 * SCALE_FACTOR,
    fill: 'white',
    stroke: { width: 12 * SCALE_FACTOR, color: 0x000000 }
  })

  // Epochs

  let epochs: {
    title: string
    icon: Sprite
    road: Sprite
    window: Sprite
    container: Container
    batalions: {
      x: number
      y: number
      title: string
      state: 'active' | 'inactive' | 'done'
      roadAnimation: Spine
      iconActive: Sprite
      iconInactive: Sprite
      container: Container
    }[]
  }[] = []

  epochs.push({
    title: 'Title',
    icon: new Sprite(Assets.get('era_window/icon_izabel.png')),
    road: new Sprite(Assets.get('era_window/path/gray/map_path_0.png')),
    window: new Sprite(Assets.get('era_window/era_map_0.jpg')),
    container: new Container(),
    batalions: [
      {
        x: 308 * SCALE_FACTOR,
        y: 436 * SCALE_FACTOR,
        title: 'The Batalion',
        state: 'done',
        roadAnimation: Spine.from({
          skeleton: 'EpochMap_path/EpochMap_path.json',
          atlas: 'EpochMap_path/EpochMap_path.atlas',
          scale: SCALE_FACTOR
        }),
        iconActive: new Sprite(Assets.get('era_window/icons/District01.png')),
        iconInactive: new Sprite(
          Assets.get('era_window/icons/District01_inactive.png')
        ),
        container: new Container()
      }
    ]
  })
  epochs.push({
    title: 'Title',
    road: new Sprite(Assets.get('era_window/path/gray/map_path_1.png')),
    icon: new Sprite(Assets.get('era_window/icon_diego.png')),
    window: new Sprite(Assets.get('era_window/era_map_1.jpg')),
    container: new Container(),
    batalions: [
      {
        x: 268 * SCALE_FACTOR,
        y: 412 * SCALE_FACTOR,
        title: 'The Batalion',
        state: 'active',
        roadAnimation: Spine.from({
          skeleton: 'EpochMap_path/EpochMap_path.json',
          atlas: 'EpochMap_path/EpochMap_path.atlas',
          scale: SCALE_FACTOR
        }),
        iconActive: new Sprite(Assets.get('era_window/icons/District02.png')),
        iconInactive: new Sprite(
          Assets.get('era_window/icons/District02_inactive.png')
        ),
        container: new Container()
      },
      {
        x: 652 * SCALE_FACTOR,
        y: 612 * SCALE_FACTOR,
        title: 'The Batalion',
        state: 'inactive',
        roadAnimation: Spine.from({
          skeleton: 'EpochMap_path/EpochMap_path.json',
          atlas: 'EpochMap_path/EpochMap_path.atlas',
          scale: SCALE_FACTOR
        }),
        iconActive: new Sprite(Assets.get('era_window/icons/District03.png')),
        iconInactive: new Sprite(
          Assets.get('era_window/icons/District03_inactive.png')
        ),
        container: new Container()
      },
      {
        x: 1076 * SCALE_FACTOR,
        y: 512 * SCALE_FACTOR,
        title: 'The Batalion',
        state: 'inactive',
        roadAnimation: Spine.from({
          skeleton: 'EpochMap_path/EpochMap_path.json',
          atlas: 'EpochMap_path/EpochMap_path.atlas',
          scale: SCALE_FACTOR
        }),
        iconActive: new Sprite(Assets.get('era_window/icons/District04.png')),
        iconInactive: new Sprite(
          Assets.get('era_window/icons/District04_inactive.png')
        ),
        container: new Container()
      }
    ]
  })
  epochs.push({
    title: 'Title',
    icon: new Sprite(Assets.get('era_window/icon_izabel.png')),
    road: new Sprite(Assets.get('era_window/path/gray/map_path_2.png')),
    window: new Sprite(Assets.get('era_window/era_map_2.jpg')),
    container: new Container(),
    batalions: [
      {
        x: 240 * SCALE_FACTOR,
        y: 510 * SCALE_FACTOR,
        title: 'The Batalion',
        state: 'inactive',
        roadAnimation: Spine.from({
          skeleton: 'EpochMap_path/EpochMap_path.json',
          atlas: 'EpochMap_path/EpochMap_path.atlas',
          scale: SCALE_FACTOR
        }),
        iconActive: new Sprite(Assets.get('era_window/icons/District05.png')),
        iconInactive: new Sprite(
          Assets.get('era_window/icons/District05_inactive.png')
        ),
        container: new Container()
      },
      {
        x: 668 * SCALE_FACTOR,
        y: 436 * SCALE_FACTOR,
        title: 'The Batalion',
        state: 'inactive',
        roadAnimation: Spine.from({
          skeleton: 'EpochMap_path/EpochMap_path.json',
          atlas: 'EpochMap_path/EpochMap_path.atlas',
          scale: SCALE_FACTOR
        }),
        iconActive: new Sprite(Assets.get('era_window/icons/District06.png')),
        iconInactive: new Sprite(
          Assets.get('era_window/icons/District06_inactive.png')
        ),
        container: new Container()
      },
      {
        x: 1138 * SCALE_FACTOR,
        y: 392 * SCALE_FACTOR,
        title: 'The Batalion',
        state: 'inactive',
        roadAnimation: Spine.from({
          skeleton: 'EpochMap_path/EpochMap_path.json',
          atlas: 'EpochMap_path/EpochMap_path.atlas',
          scale: SCALE_FACTOR
        }),
        iconActive: new Sprite(Assets.get('era_window/icons/District07.png')),
        iconInactive: new Sprite(
          Assets.get('era_window/icons/District07_inactive.png')
        ),
        container: new Container()
      },
      {
        x: 1526 * SCALE_FACTOR,
        y: 440 * SCALE_FACTOR,
        title: 'The Batalion',
        state: 'inactive',
        roadAnimation: Spine.from({
          skeleton: 'EpochMap_path/EpochMap_path.json',
          atlas: 'EpochMap_path/EpochMap_path.atlas',
          scale: SCALE_FACTOR
        }),
        iconActive: new Sprite(Assets.get('era_window/icons/District08.png')),
        iconInactive: new Sprite(
          Assets.get('era_window/icons/District08_inactive.png')
        ),
        container: new Container()
      }
    ]
  })
  epochs.push({
    title: 'Title',
    icon: new Sprite(Assets.get('era_window/icon_diego.png')),
    road: new Sprite(Assets.get('era_window/path/gray/map_path_3.png')),
    window: new Sprite(Assets.get('era_window/era_map_3.jpg')),
    container: new Container(),
    batalions: [
      {
        x: 316 * SCALE_FACTOR,
        y: 378 * SCALE_FACTOR,
        title: 'The Batalion',
        state: 'inactive',
        roadAnimation: Spine.from({
          skeleton: 'EpochMap_path/EpochMap_path.json',
          atlas: 'EpochMap_path/EpochMap_path.atlas',
          scale: SCALE_FACTOR
        }),
        iconActive: new Sprite(Assets.get('era_window/icons/District09.png')),
        iconInactive: new Sprite(
          Assets.get('era_window/icons/District09_inactive.png')
        ),
        container: new Container()
      },
      {
        x: 720 * SCALE_FACTOR,
        y: 526 * SCALE_FACTOR,
        title: 'The Batalion',
        state: 'inactive',
        roadAnimation: Spine.from({
          skeleton: 'EpochMap_path/EpochMap_path.json',
          atlas: 'EpochMap_path/EpochMap_path.atlas',
          scale: SCALE_FACTOR
        }),
        iconActive: new Sprite(Assets.get('era_window/icons/District10.png')),
        iconInactive: new Sprite(
          Assets.get('era_window/icons/District10_inactive.png')
        ),
        container: new Container()
      },
      {
        x: 1156 * SCALE_FACTOR,
        y: 452 * SCALE_FACTOR,
        title: 'The Batalion',
        state: 'inactive',
        roadAnimation: Spine.from({
          skeleton: 'EpochMap_path/EpochMap_path.json',
          atlas: 'EpochMap_path/EpochMap_path.atlas',
          scale: SCALE_FACTOR
        }),
        iconActive: new Sprite(Assets.get('era_window/icons/District11.png')),
        iconInactive: new Sprite(
          Assets.get('era_window/icons/District11_inactive.png')
        ),
        container: new Container()
      },
      {
        x: 1604 * SCALE_FACTOR,
        y: 336 * SCALE_FACTOR,
        title: 'The Batalion',
        state: 'inactive',
        roadAnimation: Spine.from({
          skeleton: 'EpochMap_path/EpochMap_path.json',
          atlas: 'EpochMap_path/EpochMap_path.atlas',
          scale: SCALE_FACTOR
        }),
        iconActive: new Sprite(Assets.get('era_window/icons/District12.png')),
        iconInactive: new Sprite(
          Assets.get('era_window/icons/District12_inactive.png')
        ),
        container: new Container()
      }
    ]
  })
  epochs.push({
    title: 'Title',
    icon: new Sprite(Assets.get('era_window/icon_izabel.png')),
    road: new Sprite(Assets.get('era_window/path/gray/map_path_4.png')),
    window: new Sprite(Assets.get('era_window/era_map_4.jpg')),
    container: new Container(),
    batalions: [
      {
        x: 218 * SCALE_FACTOR,
        y: 560 * SCALE_FACTOR,
        title: 'The Batalion',
        state: 'inactive',
        roadAnimation: Spine.from({
          skeleton: 'EpochMap_path/EpochMap_path.json',
          atlas: 'EpochMap_path/EpochMap_path.atlas',
          scale: SCALE_FACTOR
        }),
        iconActive: new Sprite(Assets.get('era_window/icons/District13.png')),
        iconInactive: new Sprite(
          Assets.get('era_window/icons/District13_inactive.png')
        ),
        container: new Container()
      },
      {
        x: 644 * SCALE_FACTOR,
        y: 312 * SCALE_FACTOR,
        title: 'The Batalion',
        state: 'inactive',
        roadAnimation: Spine.from({
          skeleton: 'EpochMap_path/EpochMap_path.json',
          atlas: 'EpochMap_path/EpochMap_path.atlas',
          scale: SCALE_FACTOR
        }),
        iconActive: new Sprite(Assets.get('era_window/icons/District14.png')),
        iconInactive: new Sprite(
          Assets.get('era_window/icons/District14_inactive.png')
        ),
        container: new Container()
      },
      {
        x: 1102 * SCALE_FACTOR,
        y: 394 * SCALE_FACTOR,
        title: 'The Batalion',
        state: 'inactive',
        roadAnimation: Spine.from({
          skeleton: 'EpochMap_path/EpochMap_path.json',
          atlas: 'EpochMap_path/EpochMap_path.atlas',
          scale: SCALE_FACTOR
        }),
        iconActive: new Sprite(Assets.get('era_window/icons/District15.png')),
        iconInactive: new Sprite(
          Assets.get('era_window/icons/District15_inactive.png')
        ),
        container: new Container()
      },
      {
        x: 1570 * SCALE_FACTOR,
        y: 476 * SCALE_FACTOR,
        title: 'The Batalion',
        state: 'inactive',
        roadAnimation: Spine.from({
          skeleton: 'EpochMap_path/EpochMap_path.json',
          atlas: 'EpochMap_path/EpochMap_path.atlas',
          scale: SCALE_FACTOR
        }),
        iconActive: new Sprite(Assets.get('era_window/icons/District16.png')),
        iconInactive: new Sprite(
          Assets.get('era_window/icons/District16_inactive.png')
        ),
        container: new Container()
      }
    ]
  })
  epochs.push({
    title: 'Title',
    icon: new Sprite(Assets.get('era_window/icon_diego.png')),
    road: new Sprite(Assets.get('era_window/path/gray/map_path_5.png')),
    window: new Sprite(Assets.get('era_window/era_map_5.jpg')),
    container: new Container(),
    batalions: [
      {
        x: 270 * SCALE_FACTOR,
        y: 396 * SCALE_FACTOR,
        title: 'The Batalion',
        state: 'inactive',
        roadAnimation: Spine.from({
          skeleton: 'EpochMap_path/EpochMap_path.json',
          atlas: 'EpochMap_path/EpochMap_path.atlas',
          scale: SCALE_FACTOR
        }),
        iconActive: new Sprite(Assets.get('era_window/icons/District17.png')),
        iconInactive: new Sprite(
          Assets.get('era_window/icons/District17_inactive.png')
        ),
        container: new Container()
      },
      {
        x: 740 * SCALE_FACTOR,
        y: 498 * SCALE_FACTOR,
        title: 'The Batalion',
        state: 'inactive',
        roadAnimation: Spine.from({
          skeleton: 'EpochMap_path/EpochMap_path.json',
          atlas: 'EpochMap_path/EpochMap_path.atlas',
          scale: SCALE_FACTOR
        }),
        iconActive: new Sprite(Assets.get('era_window/icons/District18.png')),
        iconInactive: new Sprite(
          Assets.get('era_window/icons/District18_inactive.png')
        ),
        container: new Container()
      },
      {
        x: 1162 * SCALE_FACTOR,
        y: 408 * SCALE_FACTOR,
        title: 'The Batalion',
        state: 'inactive',
        roadAnimation: Spine.from({
          skeleton: 'EpochMap_path/EpochMap_path.json',
          atlas: 'EpochMap_path/EpochMap_path.atlas',
          scale: SCALE_FACTOR
        }),
        iconActive: new Sprite(Assets.get('era_window/icons/District19.png')),
        iconInactive: new Sprite(
          Assets.get('era_window/icons/District19_inactive.png')
        ),
        container: new Container()
      },
      {
        x: 1552 * SCALE_FACTOR,
        y: 466 * SCALE_FACTOR,
        title: 'The Batalion',
        state: 'inactive',
        roadAnimation: Spine.from({
          skeleton: 'EpochMap_path/EpochMap_path.json',
          atlas: 'EpochMap_path/EpochMap_path.atlas',
          scale: SCALE_FACTOR
        }),
        iconActive: new Sprite(Assets.get('era_window/icons/District20.png')),
        iconInactive: new Sprite(
          Assets.get('era_window/icons/District20_inactive.png')
        ),
        container: new Container()
      }
    ]
  })
  epochs.push({
    title: 'Coming Soon',
    icon: new Sprite(Assets.get('era_window/icon_diego.png')),
    road: new Sprite(Assets.get('era_window/path/gray/map_path_6.png')),
    window: new Sprite(Assets.get('era_window/era_map_6.jpg')),
    container: new Container(),
    batalions: [
      {
        x: 308 * SCALE_FACTOR,
        y: 436 * SCALE_FACTOR,
        title: 'The Threshold',
        state: 'inactive',
        roadAnimation: Spine.from({
          skeleton: 'EpochMap_path/EpochMap_path.json',
          atlas: 'EpochMap_path/EpochMap_path.atlas',
          scale: SCALE_FACTOR
        }),
        iconActive: new Sprite(
          Assets.get('era_window/icons/iconComingSoon.png')
        ),
        iconInactive: new Sprite(
          Assets.get('era_window/icons/iconComingSoon.png')
        ),
        container: new Container()
      }
    ]
  })

  epochs.forEach((epoch, epochIndex) => {
    const previousEpoch = epochs[epochIndex - 1]

    epoch.window.scale.set(SCALE_FACTOR)
    epoch.container.x =
      epochIndex === 0
        ? 0
        : previousEpoch.container.x + previousEpoch.container.width

    epoch.icon.scale.set(SCALE_FACTOR)
    epoch.icon.position.set(42, 42)

    const title = new Text({
      text: epoch.title,
      x: epoch.icon.x + epoch.icon.width + 16,
      y: epoch.icon.y + epoch.icon.height / 3,
      style: textStyle
    })

    epoch.container.addChild(epoch.window, epoch.icon, title)

    epoch.road.scale.set(SCALE_FACTOR)
    epoch.road.position.set(
      epochIndex === 0 ? 0 : previousEpoch.road.x + previousEpoch.road.width,
      510 * SCALE_FACTOR
    )

    epochMap.addMaskedChild(epoch.container, epoch.road)

    epoch.batalions.forEach((batalion, batalionIndex) => {
      batalion.container.x = batalion.x + epoch.container.x
      batalion.container.y = batalion.y

      const nextBatalion =
        batalionIndex === epoch.batalions.length - 1
          ? epochIndex === epochs.length - 1
            ? null
            : epochs[epochIndex + 1].batalions[0]
          : epoch.batalions[batalionIndex + 1]

      const batalionSprite = new Sprite({
        texture:
          batalion.state === 'inactive'
            ? batalion.iconInactive.texture
            : batalion.iconActive.texture,
        anchor: 0.5,
        scale: SCALE_FACTOR
      })

      const batalionTitle = new Text({
        text: batalion.title,
        anchor: 0.5,
        style: textStyle
      })

      const statusMarker = new Sprite({
        texture: Assets.get(`era_window/icon_${batalion.state}.png`),
        anchor: 0.5,
        scale: SCALE_FACTOR
      })

      batalionTitle.y = batalionSprite.height / 2 + batalionTitle.height / 2
      statusMarker.y = batalionTitle.y + statusMarker.height + 6 * SCALE_FACTOR

      if (nextBatalion && nextBatalion.state !== 'inactive') {
        batalion.roadAnimation.state.data.defaultMix = 0.2
        batalion.roadAnimation.state.setAnimation(0, 'start', false)

        batalion.roadAnimation.x =
          batalion.container.x +
          batalion.roadAnimation.width / 2 +
          6 * SCALE_FACTOR
        batalion.roadAnimation.y =
          batalion.container.y + statusMarker.y + 22 * SCALE_FACTOR
        batalion.roadAnimation.zIndex = 100

        epochMap.addMaskedChild(batalion.roadAnimation)
      }

      batalion.container.addChild(batalionSprite, batalionTitle, statusMarker)
      epochMap.addMaskedChild(batalion.container)
    })
  })
})()
