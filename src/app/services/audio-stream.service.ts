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
  public originLength: any;
  public flattened: any;
  public reader = new FileReader();

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
        console.warn('Recording started...');
      };

      this.mediaRecord.ondataavailable = (event) => {
        this.handleDataAvailable(event);
      };

      this.mediaRecord.start(500);

    } catch (error) {
      console.warn('Error in record ->', error);
    }
  }

  public handleDataAvailable(event) {

    try {

      if (event.data.size > 0) {

        this.reader.onload = () => {
          const buffer: any = this.reader.result;
          const uint8: any = new Uint8Array(buffer);
          this.originLength = uint8.length;
          console.log('Original length ->', uint8);


          this.chunk(uint8, uint8.length / 10);
        };
        this.reader.readAsArrayBuffer(event.data);
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
        setTimeout(() => {
          this.sockServe.sendData(chunk);
        }, 100);

        this.sockServe.getData().subscribe(data => {
          // console.log('From subscription in audio service ->', data);

          const dataInJSON: any = data;
          const dataFromJSON: any = JSON.parse(dataInJSON);

          setTimeout(() => {
            this.rejoinAudio(dataFromJSON);
          }, 0);
        });
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

        const temp: any = reader.result;
        const buffer = new Uint8Array(temp);

        this.chunk(buffer, buffer.length / 10);

      };
      reader.readAsArrayBuffer(audioFile.files[0]);

    } catch (error) {
      console.warn('Error in getAudio ->', error);
    }
  }

  public stop() {
    console.log('Stopping...');
    this.stopped = true;
    this.mediaRecord.stop();
    // window.location.reload();
  }

  public rejoinAudio(data: any) {
    try {

      // let flattened: any;
      // const reader = new FileReader();
      const objToArray: any = Object.values(data);

      this.arraysMerged.push(objToArray);

      this.mediaSource = new MediaSource();

      const audio = document.querySelector('audio');
      audio.src = URL.createObjectURL(this.mediaSource);


      if (this.arraysMerged.length > 9) {
        this.flattened = [].concat(...this.arraysMerged);

        console.log('flattened', this.flattened);

        const blob = new Blob(this.flattened, { type: 'audio/webm,mp3; codecs=opus' });
        // console.log('blob', blob);
        try {


          this.mediaSource.addEventListener('sourceopen', () => {
            const sourceBuffer = this.mediaSource.addSourceBuffer(this.mediaCodecs);


            try {

              this.reader.onload = () => {
                try {

                  const buffer: any = this.reader.result;
                  const uintBuff = new Uint8Array(buffer);
                  // console.log('uint8Buffer ->', uintBuff);

                  // this.arraysMerged.push(uintBuff);

                  // console.log('Buffered ->', sourceBuffer);
                  console.log('Ready State ->', this.mediaSource.readyState);

                  sourceBuffer.addEventListener('updateend', (evt) => {

                    console.log('Update ended event ->', evt);
                    // console.warn('audio element ->', audio);
                    audio.play();
                  });

                  sourceBuffer.addEventListener('update', (evt) => {
                    console.log('onupdate event ->', evt);
                    // audio.play();

                  });

                  sourceBuffer.addEventListener('error', (evt) => {
                    console.log('onerror event ->', evt);
                  });

                  sourceBuffer.addEventListener('abort', (evt) => {
                    console.log('onabort event ->', evt);

                  });

                  sourceBuffer.addEventListener('updatestart', (evt) => {
                    console.log('onupdatestart event ->', evt);
                    console.log('Buffered ->', sourceBuffer.buffered);
                  });

                  // console.warn('uintBuff before appendBuffer ->', uintBuff);
                  sourceBuffer.appendBuffer(uintBuff);
                  console.warn('is sourceBuffer updating ->', sourceBuffer.updating);
                  // console.warn('uintBuff after appendBuffer ->', uintBuff);


                } catch (error) {
                  console.warn('Error in rejoinAudio - 4 ->', error);
                }
              };
              this.reader.readAsArrayBuffer(blob);

            } catch (error) {
              console.warn('Error in rejoinAudio - 3 ->', error);

            }
          }, false);

          this.arraysMerged = [];

        } catch (error) {
          console.warn('Error in rejoinAudio - 2 ->', error);
        }
      }


    } catch (error) {
      console.warn('Error in rejoinAudio - 1 ->', error);
    }
  }


}
