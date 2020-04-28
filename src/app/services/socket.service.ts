import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor(
    private socket: Socket
  ) { }

  public sendOffer(offer: any) {
    console.log('Offered ->', offer);
    this.socket.emit('offer', offer);
  }

  public getOffer() {
    return this.socket.fromEvent('offer');
  }

  public sendAnswer(answer: any) {
    this.socket.emit('answer', answer);
  }

  public getAnswer() {
    return this.socket.fromEvent('answer');
  }

}
