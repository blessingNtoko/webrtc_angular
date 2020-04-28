import { Injectable } from '@angular/core';

declare let RTCPeerConnection: any;

@Injectable({
  providedIn: 'root'
})
export class AudioStreamService {

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

  public connectPeers() {}

  public disconnectPeers() {}

  public sendMessage() {}
}
