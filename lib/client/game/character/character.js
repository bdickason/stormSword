/* Character Base Class */

import {ChatTyping} from './chattyping.js'
import {ChatBubble} from './chatbubble.js'

export class Character extends Phaser.Sprite {
  constructor(id, game, x, y, name) {
    super(game, x, y, name)
    this.id = id
    this.name = name

    this.animationSpeed = 15

    // Add event so other modules can listen for load to be complete
    this.events.onLoad = new Phaser.Signal()

    window.socket.emit('data:request', this.name) // Request new data from the server

    // Load data from the server
    window.socket.once(`data:load:${this.name}`, (data) => {
      // Listen to data updates for this character
      this.loadData(data)
    })
  }

  update() {
    let anim

    if(this.body.velocity.x != 0 || this.body.velocity.y != 0) {
      anim = 'walk'
    } else {
      anim = 'idle'
    }

    // Player is walking
    switch(this.body.facing) {
      case Phaser.UP:
        this.animations.play(`${anim}:up`)
        break
      case Phaser.DOWN:
        this.animations.play(`${anim}:down`)
        break
      case Phaser.LEFT:
        this.animations.play(`${anim}:left`)
        break
      case Phaser.RIGHT:
        this.animations.play(`${anim}:right`)
        break
    }

    // Display chat typing animation
    if(this.chatting) {
      if(!this.chatTyping) {
        this.chatTyping = new ChatTyping(this.game, this.x+16, this.y, 'chattyping', this)
      }
    } else {
      if(this.chatTyping) {
        this.chatTyping.kill()
        this.chatTyping = null
      }
    }
  }

  showChatBubble(message) {
    this.chatBubble = new ChatBubble(this.game, this.x, this.y, 'chatbubble', this, message)

    this.chatBubble.events.onDone.add(this.hideChatBubble, this) // Destroy chat bubble
  }

  hideChatBubble(message) {
    this.chatBubble.kill()
    this.chatBubble = null
  }

  loadData(data) {
    // Grab data from server for this character from its definition file
    // this.data = data
    // Configure animations - see /tools/spritesheet

    for(let anim in data.anims) {
      this.animations.add(anim, data.anims[anim].frames, data.anims[anim].speed)
    }

    this.events.onLoad.dispatch()
  }
}
