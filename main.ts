namespace SpriteKind {
    export const Item = SpriteKind.create()
    export const SpriteWall = SpriteKind.create()
    export const HUD = SpriteKind.create()
}
function INIT () {
    Blaster = 0
    Maps = [tilemap`Testing Level`, tilemap`level`]
    BlasterImg = [
    [assets.image`Single`, assets.image`SingleFired`],
    [assets.image`Dual`, assets.image`DualFired`],
    [assets.image`Spread`, assets.image`SpreadFired`],
    [assets.image`Mini`, assets.image`MiniFired`]
    ]
    BlasterName = [
    "Single",
    "Double",
    "Spread",
    "Mini"
    ]
    // Don't know what each spot in the arrays are for? Heres a guide:
    // Damage, Bullets (On the field), Speed (MS), Range (Radians), and Bullets (Supply).
    // 
    // nice.
    BlasterData = [
    [
    5,
    1,
    25,
    0.05,
    -1
    ],
    [
    10,
    1,
    12,
    0.075,
    200
    ],
    [
    15,
    5,
    44,
    0.35,
    16
    ],
    [
    20,
    10,
    5,
    0.1,
    400
    ]
    ]
    BlasterHave = [
    true,
    true,
    true,
    true
    ]
}
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    Blaster += 1
    console.log("BLASTER CHANGED")
    console.log(BlasterHave[Blaster])
    while (BlasterHave[Blaster] == false) {
        Blaster += 1
        if (0 >= BlasterHave.length) {
            Blaster = 0
        }
    }
    if (Blaster >= BlasterHave.length) {
        Blaster = 0
    }
})
function CreateHUD () {
    BlasterVisual = sprites.create(assets.image`Single`, SpriteKind.HUD)
    BlasterVisual.setFlag(SpriteFlag.RelativeToCamera, true)
    BlasterVisual.setPosition(80, 88)
    BlasterVisual.setScale(2, ScaleAnchor.Middle)
    Face = sprites.create(assets.image`face0idleNorm`, SpriteKind.HUD)
    Face.setFlag(SpriteFlag.RelativeToCamera, true)
    Face.setPosition(80, 112)
    Face.setScale(1, ScaleAnchor.Middle)
}
function GetPlayerDirection () {
    return Math.atan2(Render.getAttribute(Render.attribute.dirY), Render.getAttribute(Render.attribute.dirX))
}
// Story:
// 
// You wake up in this
function CreateMap (Map: number) {
    Song = 0
    WallSprites = []
    tiles.setCurrentTilemap(Maps[Map])
    tiles.placeOnRandomTile(mySprite, assets.tile`spawn`)
    scene.setBackgroundImage(assets.image`BackgroundPlay`.clone())
    for (let _xNum = 0; _xNum <= tileUtil.tilemapProperty(tileUtil.currentTilemap(), tileUtil.TilemapProperty.Columns); _xNum++) {
        for (let _yNum = 0; _yNum <= tileUtil.tilemapProperty(tileUtil.currentTilemap(), tileUtil.TilemapProperty.Rows); _yNum++) {
            _xImg = tiles.tileImageAtLocation(tiles.getTileLocation(_xNum, _yNum))
            if (_xImg.getPixel(0, 0) == 0) {
                mySprite2 = sprites.create(_xImg, SpriteKind.Item)
                tiles.placeOnTile(mySprite2, tiles.getTileLocation(_xNum, _yNum))
                if (_xImg.getPixel(1, 0) == 2) {
                    if (!(mySprite2.tileKindAt(TileDirection.Left, assets.tile`transparency16`)) || !(mySprite2.tileKindAt(TileDirection.Right, assets.tile`transparency16`))) {
                        DrawSpriteWall(mySprite2, false)
                    } else {
                        DrawSpriteWall(mySprite2, true)
                    }
                    sprites.destroy(mySprite2)
                }
                if (_xImg.getPixel(1, 0) == 3) {
                    scene.backgroundImage().replace(2, _xImg.getPixel(2, 0))
                    scene.backgroundImage().replace(8, _xImg.getPixel(3, 0))
                    sprites.destroy(mySprite2)
                }
                if (_xImg.getPixel(1, 0) == 4) {
                    Song = _xImg.getPixel(2, 0)
                    sprites.destroy(mySprite2)
                }
                if (_xImg.equals(img`
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    `)) {
                    sprites.destroy(mySprite2)
                }
                if (!(spriteutils.isDestroyed(mySprite2))) {
                    mySprite2.image.drawLine(0, 0, 15, 0, 0)
                }
            } else {
                tiles.setWallAt(tiles.getTileLocation(_xNum, _yNum), true)
            }
        }
    }
}
function DrawSpriteWall (Original: Sprite, Direction: boolean) {
    Original.setFlag(SpriteFlag.Ghost, true)
    _xImg = RecreateImage(Original.image, 4, 16)
    _xImg.drawLine(0, 0, 3, 0, 0)
    if (Direction) {
        Original.y += -6
    } else {
        Original.x += -6
    }
    for (let index = 0; index <= 3; index++) {
        WallSprites.push(sprites.create(_xImg, SpriteKind.SpriteWall))
        mySprite3 = 0
        WallSprites[WallSprites.length - 1].setFlag(SpriteFlag.GhostThroughWalls, true)
        for (let index2 = 0; index2 < 2; index2++) {
            WallSprites[WallSprites.length - 1].setPosition(Original.x, Original.y)
        }
        if (Direction) {
            Original.y += 4
        } else {
            Original.x += 4
        }
    }
    if (Direction) {
        Original.y += -4
    } else {
        Original.x += -4
    }
    Original.setFlag(SpriteFlag.Ghost, false)
}
function RecreateImage (Og: Image, NewX: number, NewY: number) {
    _xImg = image.create(NewX, NewY)
    for (let _xNum = 0; _xNum <= NewX; _xNum++) {
        for (let _yNum = 0; _yNum <= NewY; _yNum++) {
            _xImg.setPixel(_xNum, _yNum, Og.getPixel(_xNum, _yNum))
        }
    }
    return _xImg
}
let projectile: Sprite = null
let BlastTimer = 0
let mySprite3 = 0
let mySprite2: Sprite = null
let _xImg: Image = null
let WallSprites: Sprite[] = []
let Song = 0
let Face: Sprite = null
let BlasterVisual: Sprite = null
let BlasterHave: boolean[] = []
let BlasterData: number[][] = []
let BlasterName: string[] = []
let BlasterImg: Image[][] = []
let Maps: tiles.TileMapData[] = []
let Blaster = 0
let mySprite: Sprite = null
game.splash("HYPERPOLYX", "By Ominouswolf")
game.splash("Inspired by", "Those games in the 90's with the cool raycasting and bsp tree rendering thingys :D")
INIT()
mySprite = Render.getRenderSpriteVariable()
CreateMap(1)
CreateHUD()
game.onUpdate(function () {
    if (BlastTimer <= 0 && controller.A.isPressed()) {
        for (let index = 0; index < BlasterData[Blaster][1]; index++) {
            projectile = sprites.createProjectileFromSprite(assets.image`StandardFire`, mySprite, 0, 0)
            spriteutils.setVelocityAtAngle(projectile, GetPlayerDirection() + randint(0 - BlasterData[Blaster][3] / 2, BlasterData[Blaster][3] / 2), 175)
        }
        BlastTimer = BlasterData[Blaster][2]
        music.play(music.createSoundEffect(WaveShape.Sawtooth, 1600, 1, 255, 0, 300, SoundExpressionEffect.Vibrato, InterpolationCurve.Linear), music.PlaybackMode.InBackground)
    } else {
        console.logValue("NO NOT YET, TIMR IS AT", BlastTimer)
    }
    if (BlastTimer <= 0) {
        BlasterVisual.setImage(BlasterImg[Blaster][0])
    } else {
        BlasterVisual.setImage(BlasterImg[Blaster][1])
    }
})
game.onUpdateInterval(1, function () {
    BlastTimer += -1
})
forever(function () {
    if (Song == 1) {
        music.play(music.createSong(assets.song`FactoryPump`), music.PlaybackMode.UntilDone)
    } else if (Song == 2) {
        music.play(music.createSong(assets.song`Binary Terror`), music.PlaybackMode.UntilDone)
    } else if (Song == 3) {
    	
    } else if (false) {
    	
    }
})
