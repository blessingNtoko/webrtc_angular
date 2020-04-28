import { Injectable } from '@angular/core';
import { SocketService } from '../services/socket.service';

declare let RTCPeerConnection: any;

@Injectable({
  providedIn: 'root'
})
export class AudioStreamService {

  public localConnect;
  public remoteConnect;
  public sendChannel;
  public receiveChannel;

  constructor(
    private sockServe: SocketService
  ) { }

  public connectPeers() {
    console.log('Connecting peers');

    this.localConnect = new RTCPeerConnection();

    this.sendChannel = this.localConnect.createDataChannel('sendChannel');
    console.log('sendChannel ->', this.sendChannel);

    this.sendChannel.onopen = () => {
      console.log('Channel is open');
    };

    this.sendChannel.onclose = () => {
      console.log('Channel is closed');
    };

    this.remoteConnect = new RTCPeerConnection();
    console.log('remoteConnect ->', this.remoteConnect);

    this.remoteConnect.ondatachannel = this.receiveChannelCallback;

    this.localConnect.createOffer().then(offer => {
      console.log('Offer ->', offer);
      this.localConnect.setLocalDescription(offer);
      this.sockServe.sendOffer(offer);
    });
  }

  public disconnectPeers() { }

  public sendMessage() { }

  public receiveChannelCallback(event) {
    this.receiveChannel = event.channel;

    this.receiveChannel.onmessage = this.handleReceiveMessage;
    this.receiveChannel.onopen = this.handleReceiveChannelStatusChange;
    this.receiveChannel.onclose = this.handleReceiveChannelStatusChange;
  }

  public handleReceiveChannelStatusChange(event) {
    try {
      console.log('handleReceiveChannelStatusChange event->', event);

      if (this.receiveChannel) {
        console.log('Receive channel status has changed to ' + this.receiveChannel.readyState);
      }
    } catch (error) {
      console.warn('Error on handleReceiveChannelStatusChange ->', error);
    }
  }

  public handleReceiveMessage(event) {
    console.log('Message received ->', event.data);
  }

}
