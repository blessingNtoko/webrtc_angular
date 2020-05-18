import { Injectable } from '@angular/core';
import { SocketService } from '../services/socket.service';

declare let MediaRecorder: any;

@Injectable({
  providedIn: 'root'
})
export class AudioStreamService {

  public mediaRecord: any;
  public mediaConstraints = {
    video: false,
    audio: true
  };
  public options = { mimeType: 'audio/webm; codecs=opus' };
  public arraysMerged = [];
  public stopped = false;
  public mediaSource;
  public mediaCodecs = 'audio/webm; codecs=opus';

  constructor(
    private sockServe: SocketService
  ) { }

  public getStream() {
    try {
      if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia(this.mediaConstraints)
          .then(stream => {
            this.record(stream);
          }).catch(error => {
            console.warn('Error when getting stream ->', error);
          });
      }
    } catch (error) {
      console.warn('Error in getStream ->', error);
    }
  }

  public record(stream) {
    try {

      this.stopped = false;
      console.log('Recording...');
      this.mediaRecord = new MediaRecorder(stream, this.options);

      this.mediaRecord.onstop = (event) => {
        console.warn('Recording stopped...');
      };

      this.mediaRecord.onstart = (event) => {
        console.warn('Recording started...')
      };

      this.mediaRecord.ondataavailable = (event) => {
        this.handleDataAvailable(event);
      };

      this.mediaRecord.start(700);

    } catch (error) {
      console.warn('Error in record ->', error);
    }
  }

  public handleDataAvailable(event) {

    try {

      if (event.data.size > 0) {
        const reader = new FileReader();

        reader.onload = () => {
          const buffer: any = reader.result;
          const uint8: any = new Uint8Array(buffer);

          this.chunk(uint8, 10);
        };
        reader.readAsArrayBuffer(event.data);
      } else {
        console.log('Next >');
      }

    } catch (error) {
      console.warn('Error in handleDataAvailable ->', error);
    }

  }

  public chunk(array: any, size: number) {
    try {

      console.log('Chunking...');
      let chunk: any;

      for (let i = 0; i < array.length; i += size) {
        chunk = array.slice(i, size + i);
        // this.sockServe.sendData(chunk);

        // this.rtc.audioObserve.subscribe(data => {
        //   console.log('From subscription in audio service ->', data);
        //   this.rejoinAudio(data);
        // });
      }

    } catch (error) {
      console.warn('Error in chunk ->', error);
    }
  }

  public getAudio() {
    try {

      const audioFile: any = document.getElementById('audioFile');
      console.warn('audioFile ->', audioFile);
      const reader = new FileReader();

      console.warn('Files in audioFile ->', audioFile.files);

      reader.onload = () => {

        let temp: any = reader.result;
        let buffer = new Uint8Array(temp);

        this.chunk(buffer, 5);

      };
      reader.readAsArrayBuffer(audioFile.files[0]);

    } catch (error) {
      console.warn('Error in getAudio ->', error);
    }
  }

  public stop() {
    this.stopped = true;
    this.mediaRecord.stop();
  }

  public rejoinAudio(data: any) {
    try {

      const objToArray: any = Object.values(data);
      const blob = new Blob(objToArray, { type: 'audio/mp3; codecs=opus' });

      this.mediaSource = new MediaSource();

      const audio = document.querySelector('audio');
      audio.src = URL.createObjectURL(this.mediaSource);

      try {

        this.mediaSource.addEventListener('sourceopen', () => {
          const sourceBuffer = this.mediaSource.addSourceBuffer(this.mediaCodecs);

          const reader = new FileReader();

          try {

            reader.onload = () => {
              try {

                const buffer: any = reader.result;
                const uintBuff = new Uint8Array(buffer);

                this.arraysMerged.push(uintBuff);

                try {

                  if (this.arraysMerged.length > 9) {
                    sourceBuffer.appendBuffer(this.arraysMerged.shift());

                    console.log('Buffered ->', sourceBuffer);
                    console.log('Ready State ->', this.mediaSource.readyState);
                  }

                } catch (error) {
                  console.warn('Error in rejoinAudio - 5 ->', error);
                }
                sourceBuffer.addEventListener('updateend', (evt) => {
                  console.log('Update ended event ->', evt);

                  audio.play();
                });

              } catch (error) {
                console.warn('Error in rejoinAudio - 4 ->', error);
              }
            };
            reader.readAsArrayBuffer(blob);

          } catch (error) {
            console.warn('Error in rejoinAudio - 3 ->', error);

          }
        }, false);

      } catch (error) {
        console.warn('Error in rejoinAudio - 2 ->', error);
      }

    } catch (error) {
      console.warn('Error in rejoinAudio - 1 ->', error);
    }
  }


}
