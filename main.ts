namespace SpriteKind {
    export const Item = SpriteKind.create()
    export const SpriteWall = SpriteKind.create()
    export const HUD = SpriteKind.create()
    export const StatusBar = SpriteKind.create()
}
/**
 * Enemy types:
 * 
 * - The idiot: Runs at the player and hurts the player once touched.
 * 
 * - The slinger: Trys to reach a certain distance from the player and fires at them.
 * 
 * - The ninja: Pathfinds to the player once spotted. Only hurts when touching
 * 
 * - The headshot: Like the slinger, but with a spread blaster.
 * 
 * - The heavy: Like the slinger, but with a mini blaster. Gives a sort of warning before firing its barrage of blasts.
 * 
 * Boss types:
 * 
 * - The tree
 * 
 * - 
 * 
 * -
 */
function INIT () {
    Blaster = 0
    Maps = [tilemap`Testing Level`, tilemap`TheLab`]
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
    500,
    0.05,
    -1
    ],
    [
    10,
    1,
    250,
    0.075,
    200
    ],
    [
    15,
    5,
    1500,
    0.35,
    16
    ],
    [
    5,
    2,
    20,
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
function InitEnemy (Sprite2: Sprite) {
    console.log("OH SHOOT, AN ENEMY")
    if (Sprite2.image.getPixel(3, 0) == 0) {
        sprites.setDataNumber(Sprite2, "Range", 100)
        sprites.setDataNumber(Sprite2, "Speed", 30)
        sprites.setDataNumber(Sprite2, "Firerate", 0)
        sprites.setDataNumber(Sprite2, "HP", 25)
        sprites.setDataNumber(Sprite2, "Damage", 2)
        sprites.setDataNumber(Sprite2, "Accuracy", 0)
        sprites.setDataImageValue(Sprite2, "Walk", assets.image`idiotWalk`)
        sprites.setDataImageValue(Sprite2, "Fire", assets.image`idiotWalk`)
        sprites.setDataImageValue(Sprite2, "Damage", assets.image`idiotWalk`)
        sprites.setDataImageValue(Sprite2, "Dead", assets.image`idiotWalk`)
    }
}
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
function CropAndPortImage (Og: Image, StartX: number, StartY: number, EndX: number, EndY: number) {
    _xImg = image.create(Math.abs(StartX - EndX), Math.abs(StartY - EndY))
    for (let _xNum = 0; _xNum <= Math.abs(StartX - EndX); _xNum++) {
        for (let _yNum = 0; _yNum <= Math.abs(StartY - EndY); _yNum++) {
            _xImg.setPixel(_xNum + StartX, _yNum + StartY, Og.getPixel(_xNum + StartX, _yNum + StartY))
        }
    }
    return _xImg
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
                if (_xImg.getPixel(1, 0) == 5) {
                    mySprite2.setKind(SpriteKind.Enemy)
                    sprites.setDataNumber(mySprite2, "Type", _xImg.getPixel(2, 0))
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
    _xImg = RecreateImage(Original.image, 16, 16)
    _xImg.drawLine(0, 0, 3, 0, 0)
    if (Direction) {
        Original.y += -6
    } else {
        Original.x += -6
    }
    for (let index = 0; index <= 3; index++) {
        WallSprites.push(sprites.create(RecreateImage(_xImg, 4, 16), SpriteKind.SpriteWall))
        mySprite3 = 0
        WallSprites[WallSprites.length - 1].setFlag(SpriteFlag.GhostThroughWalls, true)
        for (let index2 = 0; index2 < 4; index2++) {
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
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    Render.toggleViewMode()
})
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
let BlastTimer = false
let mySprite3 = 0
let mySprite2: Sprite = null
let WallSprites: Sprite[] = []
let Song = 0
let _xImg: Image = null
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
let mySprite4 = sprites.create(CropAndPortImage(assets.image`idiotWalk`, 4, 0, 16, 16), SpriteKind.Food)
game.onUpdate(function () {
    if (!(BlastTimer) && controller.A.isPressed()) {
        for (let index = 0; index < BlasterData[Blaster][1]; index++) {
            projectile = sprites.createProjectileFromSprite(assets.image`StandardFire`, mySprite, 0, 0)
            spriteutils.setVelocityAtAngle(projectile, GetPlayerDirection() + randint(0 - BlasterData[Blaster][3] / 2, BlasterData[Blaster][3] / 2), 175)
        }
        music.play(music.createSoundEffect(
        WaveShape.Sawtooth,
        randint(1650, 1550),
        randint(150, 0),
        255,
        0,
        300,
        SoundExpressionEffect.Vibrato,
        InterpolationCurve.Linear
        ), music.PlaybackMode.InBackground)
        BlastTimer = true
        timer.after(BlasterData[Blaster][2], function () {
            BlastTimer = false
        })
    }
    if (BlastTimer) {
        BlasterVisual.setImage(BlasterImg[Blaster][1])
    } else {
        BlasterVisual.setImage(BlasterImg[Blaster][0])
    }
})
forever(function () {
    if (Song == 1) {
        music.play(music.createSong(assets.song`FactoryPump`), music.PlaybackMode.UntilDone)
    } else if (Song == 2) {
        music.play(music.createSong(assets.song`Binary Terror`), music.PlaybackMode.UntilDone)
    } else if (Song == 3) {
        music.play(music.createSong(assets.song`Halt and Catch Fire`), music.PlaybackMode.UntilDone)
    } else if (false) {
    	
    }
})
