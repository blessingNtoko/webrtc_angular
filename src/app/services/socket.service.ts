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
    this.socket.emit('message', data);
  }

  public getData() {
    return this.socket.fromEvent('message');
  }

}
