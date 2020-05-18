import { Component, OnInit } from '@angular/core';
import { AudioStreamService } from './services/audio-stream.service';
import { SocketService } from './services/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'webRTC-Angular';

  constructor(
    public audioServe: AudioStreamService,
    public socketServe: SocketService
  ) {}

  ngOnInit() {
    // this.socketServe.sendData('Hello World');

    // this.socketServe.getData().subscribe(data => {
    //   console.log(data);
    // });
  }
}
