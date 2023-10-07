import Millis from "../Millis.js"
import Entity from "./Entity.js"
import { lerp } from "../main.js"

export default class Player extends Entity {

    constructor(two, displayGroup, monde, posx, posy) {
        super(two, displayGroup, monde, posx, posy)

        this.renderDistance = 1
        this.display.fill = "red"

        this.inputToDir = {
            'z': 'up',
            'q': 'left',
            's': 'down',
            'd': 'right',
        }

        this.dirToDepl = {
            'up': { x: 0, y: -1, state: false },
            'down': { x: 0, y: 1, state: false },
            'left': { x: -1, y: 0, state: false },
            'right': { x: 1, y: 0, state: false }
        }

        this.UpdatePosChunk()

    }

    Update() {
        Object.keys(this.dirToDepl).forEach(key => {
            const value = this.dirToDepl[key]
            if (value.state) {
                if (Millis.millis() == this.deplTimer || Millis.millis() - this.deplTimer > this.deplCooldown) {
                    this.deplTimer = Millis.millis()
                    this.Deplacement(value.x, value.y)
                }
            }
        })
    }

    Render() {
        this.display.position.set(
            lerp(this.display.position.x, this.pos.x * this.monde.tailleCase + this.monde.tailleCase / 2, 0.3),
            lerp(this.display.position.y, this.pos.y * this.monde.tailleCase + this.monde.tailleCase / 2, 0.3),
        )
    }



    Input(key, state) {
        if (key in this.inputToDir)
            this.dirToDepl[this.inputToDir[key]].state = state;
    }

    Deplacement(x = 0, y = 0) {
        if (super.Deplacement(x, y)) {
            const temp = { ...this.posChunk }
            this.UpdatePosChunk()

            if (temp.x != this.posChunk.x || temp.y != this.posChunk.y) {
                //console.log("changement de chunk :", this.posChunk)
                this.monde.UpdateRenderDistance(this.posChunk, { x: this.posChunk.x - temp.x, y: this.posChunk.y - temp.y })
            }

            return true
        }
        return false
    }

    
}