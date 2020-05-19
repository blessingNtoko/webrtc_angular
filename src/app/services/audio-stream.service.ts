import { Injectable } from '@angular/core';
import { SocketService } from '../services/socket.service';

const ctx = new AudioContext();
const bufferSize = 10;
const debug = true;

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

  private chunks: Array<AudioBufferSourceNode> = [];
  private isPlaying = false;
  private startTime = 0;
  private lastChunkOffset = 0;

  constructor(
    private sockServe: SocketService,
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

      this.mediaRecord.start(1000);

    } catch (error) {
      console.warn('Error in record ->', error);
    }
  }

  public handleDataAvailable(event) {

    try {
      const reader = new FileReader();

      if (event.data.size > 0) {

        reader.onload = () => {
          const buffer: any = reader.result;
          const uint8: any = new Uint8Array(buffer);

          // this.sockServe.sendData(uint8);

          // this.sockServe.getData().subscribe(data => {

          //   const dataInJSON: any = data;
          //   const dataFromJSON: any = JSON.parse(dataInJSON);

          //   setTimeout(() => {
          //   this.rejoinAudio(dataFromJSON);
          //   }, 0);
          // });


          this.chunk(uint8, uint8.length / 2);
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
        this.sockServe.sendData(chunk);
      }

      this.sockServe.getData().subscribe(data => {
        // console.log('From subscription in audio service ->', data);

        const dataInJSON: any = data;
        const dataFromJSON: any = JSON.parse(dataInJSON);

        setTimeout(() => {
        this.rejoinAudio(dataFromJSON);
        }, 0);
      });

    } catch (error) {
      console.warn('Error in chunk ->', error);
    }
  }

  public stop() {
    console.log('Stopping...');
    this.stopped = true;
    this.mediaRecord.stop();
  }

  public rejoinAudio(data: any) {
    console.log('Joining...');
    try {

      const objToArray: any = Object.values(data);
      const float32 = new Float32Array(objToArray);

      this.addChunk(float32);

    } catch (error) {
      console.warn('Error in rejoinAudio - 1 ->', error);
    }
  }

  private createChunk(chunk: Float32Array) {
    const audioBuffer = ctx.createBuffer(1, chunk.length, ctx.sampleRate);
    audioBuffer.getChannelData(0).set(chunk);
    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);
    source.onended = (e: Event) => {
      this.chunks.splice(this.chunks.indexOf(source), 1);
      if (this.chunks.length === 0) {
        this.isPlaying = false;
        this.startTime = 0;
        this.lastChunkOffset = 0;
      }
    };

    return source;
  }

  private log(data: string) {
    if (debug) {
      console.log(new Date().toUTCString() + ' : ' + data);
    }
  }

  public addChunk(data: Float32Array) {
    if (this.isPlaying && (this.chunks.length > bufferSize)) {
      this.log('chunk discarded');
      return; // throw away
    } else if (this.isPlaying && (this.chunks.length <= bufferSize)) { // schedule & add right now
      this.log('chunk accepted');
      const chunk = this.createChunk(data);
      chunk.start(this.startTime + this.lastChunkOffset);
      this.lastChunkOffset += chunk.buffer.duration;
      this.chunks.push(chunk);
    } else if ((this.chunks.length < (bufferSize / 2)) && !this.isPlaying) {  // add & don't schedule
      this.log('chunk queued');
      const chunk = this.createChunk(data);
      this.chunks.push(chunk);
    } else { // add & schedule entire buffer
      this.log('queued chunks scheduled');
      this.isPlaying = true;
      const chunk = this.createChunk(data);
      this.chunks.push(chunk);
      this.startTime = ctx.currentTime;
      this.lastChunkOffset = 0;
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.chunks.length; i++) {
        const chunky = this.chunks[i];
        chunky.start(this.startTime + this.lastChunkOffset);
        this.lastChunkOffset += chunk.buffer.duration;
      }
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



}
