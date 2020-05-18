import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor(
    private socket: Socket
  ) { }

  public sendData(data: any) {
    const received = JSON.stringify(data);



    console.log('In socket service');
    this.socket.emit('message', received);
  }

  public getData() {
    return this.socket.fromEvent('message');
  }

}
