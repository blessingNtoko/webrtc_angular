import { Component, OnInit } from '@angular/core';
import { AudioStreamService } from './services/audio-stream.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'webRTC-Angular';

  constructor(
    public audioServe: AudioStreamService
  ) {}

  ngOnInit() {

  }
}
