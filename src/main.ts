import { Application, Assets, Container, Graphics, Sprite, Text } from 'pixi.js'
import { clamp, resize, easeOutElastic, easeInOutQuad } from './lib'
// import { Spine } from '@pixi/spine-pixi'
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

  document.body.style.overscrollBehavior = 'none'
  document.getElementById('app')!.appendChild(app.canvas)

  // Loading assets

  const assetsToLoad = [
    'Back_P_4.png',
    'Map_icon.png',
    'button_X.png',
    'button_Xd.png',
    'era_window/icon_diego.png',
    'era_window/icon_izabel.png',
    'era_window/era_map_0.jpg',
    'era_window/era_map_1.jpg',
    'era_window/era_map_2.jpg',
    'era_window/era_map_3.jpg',
    'era_window/era_map_4.jpg',
    'era_window/era_map_5.jpg',
    'era_window/era_map_6.jpg'
  ]

  assetsToLoad.forEach((asset) => Assets.add({ src: asset }))

  await Assets.load(assetsToLoad)

  // Map and masking

  const mapDimensions = {
    x: 100,
    y: 100,
    width: window.innerWidth - 200,
    height: window.innerHeight - 200
  }

  const mapContainer = new Container({
    x: mapDimensions.x + mapDimensions.width / 2,
    y: mapDimensions.y + mapDimensions.height / 2,
    pivot: {
      x: mapDimensions.width / 2,
      y: mapDimensions.height / 2
    },
    scale: 0
  })

  const mapIcon1 = new Sprite({
    texture: Assets.get('Map_icon.png'),
    anchor: 0.5,
    zIndex: 1,
    x: mapDimensions.width / 2,
    width: 64,
    height: 64
  })

  mapContainer.addChild(mapIcon1)

  app.stage.addChild(mapContainer)

  const maskContainer = new Container()
  const maskedContentContainer = new Container()
  const mask = new Graphics()
    .roundRect(0, 0, mapDimensions.width, mapDimensions.height, 6)
    .fill(0xffffff)

  maskContainer.mask = mask
  maskContainer.addChild(mask)
  maskContainer.addChild(maskedContentContainer)
  mapContainer.addChild(maskContainer)

  // Buttons

  const mapButtonDimensions = {
    x: innerWidth / 2,
    y: innerHeight / 2,
    width: 64,
    height: 64
  }

  const openMapButtonContainer = new Container({
    ...mapButtonDimensions,
    eventMode: 'static',
    cursor: 'pointer'
  })

  const buttonFrame = new Sprite({
    texture: Assets.get('Back_P_4.png'),
    anchor: 0.5,
    width: mapButtonDimensions.width,
    height: mapButtonDimensions.height
  })

  const mapIcon = new Sprite({
    texture: Assets.get('Map_icon.png'),
    anchor: 0.5,
    y: 2,
    width: mapButtonDimensions.width,
    height: mapButtonDimensions.height
  })

  openMapButtonContainer.addChild(buttonFrame, mapIcon)
  app.stage.addChildAt(openMapButtonContainer, 0)

  const closeMapButtonContainer = new Container({
    x: mapDimensions.width,
    scale: 0.6,
    eventMode: 'static',
    cursor: 'pointer'
  })

  const closeIcon = new Sprite({
    texture: Assets.get('button_X.png'),
    anchor: 0.5
  })

  openMapButtonContainer.onpointerdown = () => {
    openMapButtonContainer.scale.set(0.9)

    document.onpointerup = () => {
      openMapButtonContainer.scale.set(1)
      document.onpointerup = null
      openMapButtonContainer.onpointerup = null
    }

    openMapButtonContainer.onpointerup = () => {
      app.ticker.add(openMap)

      const duration = 1500
      const startTime = Date.now()

      function openMap() {
        const currentTime = Date.now()
        const progress = clamp((currentTime - startTime) / duration, 0, 1)

        mapContainer.scale.set(easeOutElastic(progress))

        if (progress >= 0.4) app.ticker.remove(openMap)
      }
    }
  }

  closeMapButtonContainer.onpointerdown = () => {
    closeIcon.scale.set(0.9)
    closeIcon.texture = Assets.get('button_Xd.png')

    document.onpointerup = () => {
      closeIcon.scale.set(1)
      closeIcon.texture = Assets.get('button_X.png')
      document.onpointerup = null
      closeMapButtonContainer.onpointerup = null
    }

    closeMapButtonContainer.onpointerup = () => {
      app.ticker.add(closeMap)

      const duration = 250
      const startTime = Date.now()

      function closeMap() {
        const currentTime = Date.now()
        const progress = clamp((currentTime - startTime) / duration, 0, 1)

        mapContainer.scale.set(easeInOutQuad(1 - progress))

        if (progress === 1) app.ticker.remove(closeMap)
      }
    }
  }

  closeMapButtonContainer.addChild(closeIcon)
  mapContainer.addChild(closeMapButtonContainer)

  // Scrolling

  maskContainer.cursor = 'grab'
  maskContainer.eventMode = 'static'

  maskContainer.onwheel = (event) => {
    maskedContentContainer.x = clampNewX(
      maskedContentContainer.x + event.deltaX
    )
  }

  maskContainer.onpointerdown = (event) => {
    let prevX = event.clientX

    maskContainer.cursor = 'grabbing'
    document.onpointermove = (event) => {
      const deltaX = event.clientX - prevX

      prevX = event.clientX
      maskedContentContainer.x = clampNewX(maskedContentContainer.x + deltaX)
    }
    document.onpointerup = () => {
      prevX = 0
      document.onpointerup = null
      document.onpointermove = null
      maskContainer.cursor = 'grab'
    }
  }

  function clampNewX(newX: number) {
    if (newX > 0) {
      return 0
    } else if (newX + maskedContentContainer.width < mapDimensions.width) {
      return mapDimensions.width - maskedContentContainer.width
    } else {
      return newX
    }
  }

  // Epoch

  let epochs: {
    icon: Sprite
    title: string
    window: Sprite
    container: Container
  }[] = []

  epochs.push({
    title: 'Title',
    icon: new Sprite(Assets.get('era_window/icon_izabel.png')),
    window: new Sprite(Assets.get('era_window/era_map_0.jpg')),
    container: new Container()
  })
  epochs.push({
    title: 'Title',
    icon: new Sprite(Assets.get('era_window/icon_diego.png')),
    window: new Sprite(Assets.get('era_window/era_map_1.jpg')),
    container: new Container()
  })
  epochs.push({
    title: 'Title',
    icon: new Sprite(Assets.get('era_window/icon_izabel.png')),
    window: new Sprite(Assets.get('era_window/era_map_2.jpg')),
    container: new Container()
  })
  epochs.push({
    title: 'Title',
    icon: new Sprite(Assets.get('era_window/icon_diego.png')),
    window: new Sprite(Assets.get('era_window/era_map_3.jpg')),
    container: new Container()
  })
  epochs.push({
    title: 'Title',
    icon: new Sprite(Assets.get('era_window/icon_izabel.png')),
    window: new Sprite(Assets.get('era_window/era_map_4.jpg')),
    container: new Container()
  })
  epochs.push({
    title: 'Title',
    icon: new Sprite(Assets.get('era_window/icon_diego.png')),
    window: new Sprite(Assets.get('era_window/era_map_5.jpg')),
    container: new Container()
  })
  epochs.push({
    title: 'Coming Soon',
    icon: new Sprite(Assets.get('era_window/icon_diego.png')),
    window: new Sprite(Assets.get('era_window/era_map_6.jpg')),
    container: new Container()
  })

  epochs.forEach(async (epoch, index) => {
    const previousEpoch = epochs[index - 1]

    const resizedWindow = resize({
      orig: epoch.window.texture.orig,
      height: mapDimensions.height
    })

    epoch.container.x =
      index === 0
        ? 0
        : previousEpoch.container.x + previousEpoch.container.width
    epoch.container.width = resizedWindow.width
    epoch.container.height = resizedWindow.height
    epoch.window.width = resizedWindow.width
    epoch.window.height = resizedWindow.height

    const resizedIcon = resize({
      orig: epoch.icon.texture.orig,
      width: 80
    })

    epoch.icon.position.set(42, 42)
    epoch.icon.width = resizedIcon.width
    epoch.icon.height = resizedIcon.height

    const title = new Text({
      text: epoch.title,
      x: epoch.icon.x + epoch.icon.width + 16,
      y: epoch.icon.y + epoch.icon.height / 3,
      style: {
        fill: 0x000000,
        fontSize: 24
      }
    })

    epoch.container.addChild(epoch.window, epoch.icon, title)
    maskedContentContainer.addChild(epoch.container)
  })

  // Spine

  // Assets.add({
  //   alias: 'EpochMapPathData',
  //   src: 'EpochMap_path/EpochMap_path.json'
  // })
  // Assets.add({
  //   alias: 'EpochMapPathAtlas',
  //   src: 'EpochMap_path/EpochMap_path.atlas'
  // })

  // await Assets.load(['EpochMapPathData', 'EpochMapPathAtlas'])

  // const EpochMapPathAnimation = Spine.from({
  //   skeleton: 'EpochMapPathData',
  //   atlas: 'EpochMapPathAtlas',
  //   scale: 1
  // })

  // EpochMapPathAnimation.state.data.defaultMix = 0.2

  // EpochMapPathAnimation.x = window.innerWidth / 2
  // EpochMapPathAnimation.y =
  //   window.innerHeight / 2 + EpochMapPathAnimation.getBounds().height / 2

  // EpochMapPathAnimation.state.setAnimation(0, 'start', true)

  // app.stage.addChild(EpochMapPathAnimation)
})()
