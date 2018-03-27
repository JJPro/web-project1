import React, { Component } from 'react';
import socket from './socket';
import Konva from 'konva';
import { Stage, Layer, Rect, Text } from 'react-konva';

export default class Game extends Component{
  constructor(props) {
    super(props);

    this.channel = props.channel;
    this.state = {
      tanks: [],
      missiles: [],
      bricks: [],
      steels: [],
    };

    this.channelInit();
  }

  componentWillMount(){
    this.animate();
  }

  render(){

    return <div>Game World
    <input  onKeyDown={this.onKeyDown.bind(this)} />
    </div>
  }

  // format game data as needed
  gotView({game}) {
    // console.log("got view: ", game);
    this.setState(game);
  }

  channelInit() {
    this.channel.join()
        .receive("ok", this.gotView.bind(this))
        .receive("error", resp => { console.error("Unable to join", resp) });

    this.channel.on("update", game => this.gotView(game) );
  }

  animate() {
    this.channel.push("get_state")
      .receive("ok", game => {
        this.setState(game);
        requestAnimationFrame(this.animate.bind(this));
      });
  }

  /***
  send fire and move actions
  */
  onKeyDown({key}) {
    // console.log(key);

    let direction = null;
    let fire = false;
    switch (key) {
      case "w":
      case "ArrowUp":
        direction = "up";
        break;
      case "s":
      case "ArrowDown":
        direction = "down";
        break;
      case "a":
      case "ArrowLeft":
        direction = "left";
        break;
      case "d":
      case "ArrowRight":
        direction = "right";
        break;
      case "Enter":
      case " ":
      case "Shift":
        fire = true;
        break;
      default:
        break;
    }

    // console.log(direction);
    // console.log(fire);
    if (direction){
      this.channel.push("move", {uid: window.user, direction: direction})
          .receive("ok", this.gotView.bind(this));
    }
    if (fire){
      this.channel.push("fire", {uid: window.user})
          .receive("ok", this.gotView.bind(this));
    }
  }
}
