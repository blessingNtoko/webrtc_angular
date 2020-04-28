import { Component, OnInit } from '@angular/core';
import { AudioStreamService } from '../services/audio-stream.service';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'app-peer1',
  templateUrl: './peer1.component.html',
  styleUrls: ['./peer1.component.scss']
})
export class Peer1Component implements OnInit {

  public connectBtn;
  public disconnectBtn;
  public sendBtn;
  public msgInputBox;
  public receiveBox;
  // public localConnect;
  // public remoteConnect;
  // public sendChannel;
  // public receiveChannel;

  constructor(
    private audioStream: AudioStreamService,
    private sockServe: SocketService
  ) { }

  ngOnInit() {
    this.startUp();

    const offerSub = this.sockServe.getOffer().subscribe(data => {
      console.log('from subscription offer', data);
    });

    const answerSub = this.sockServe.getAnswer().subscribe(data => {
      console.log('from subscription answer', data);
    });
  }

  public startUp() {
    console.log('starting up');
    // Creating constants with references to buttons and input boxes
    this.connectBtn = document.getElementById('connectBtn');
    this.disconnectBtn = document.getElementById('disconnectBtn');
    this.sendBtn = document.getElementById('sendBtn');
    this.msgInputBox = document.getElementById('message');
    this.receiveBox = document.getElementById('receiveBox');

    // Adding event listeners on buttons for connecting, disconnecting, and send a message
    this.connectBtn.addEventListener('click', this.audioStream.connectPeers, false);
    this.disconnectBtn.addEventListener('click', this.audioStream.disconnectPeers, false);
    this.sendBtn.addEventListener('click', this.audioStream.sendMessage, false);
  }

}
