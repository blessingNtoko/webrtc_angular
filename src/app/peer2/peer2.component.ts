import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-peer2',
  templateUrl: './peer2.component.html',
  styleUrls: ['./peer2.component.scss']
})
export class Peer2Component implements OnInit {

  public connectBtn;
  public disconnectBtn;
  public sendBtn;
  public msgInputBox;
  public receiveBox;
  public localConnect;
  public remoteConnect;
  public sendChannel;
  public receiveChannel;

  constructor() { }

  ngOnInit() {
  }

}
