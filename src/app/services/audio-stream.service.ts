import { Injectable } from '@angular/core';
import { SocketService } from '../services/socket.service';

const ctx = new AudioContext();
const bufferSize = 6;
const debug = true;

@Injectable({
  providedIn: 'root'
})
export class AudioStreamService {

  public mediaConstraints = {
    video: false,
    audio: true
  };
  public stopped = false;
  public mediaCodecs = 'audio/webm';
  private chunks: Array<AudioBufferSourceNode> = [];
  private isPlaying = false;
  private startTime = 0;
  private lastChunkOffset = 0;
  private source;
  private processor;

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

  public record(stream: any) {
    try {
      console.log('recording...');
      this.source = ctx.createMediaStreamSource(stream);
      this.processor = ctx.createScriptProcessor(1024, 1, 1);

      console.log('source ->', this.source);
      console.log('source ->', this.processor);

      this.processor.addEventListener('audioprocess', (e: any) => {

        this.sockServe.sendData(e.inputBuffer.getChannelData(0));
      });

      this.source.connect(this.processor);
      this.processor.connect(ctx.destination);

      this.sockServe.getData().subscribe(data => {

        this.rejoinAudio(data);
      });
    } catch (error) {
      console.warn('error ->', error);
    }
  }

  public stop() {
    console.log('Stopping...');
    this.stopped = true;
    this.source.disconnect(this.processor);
    this.processor.disconnect(ctx.destination);
  }

  public rejoinAudio(chunk: any) {
    console.log('Joining...');
    try {
      const objToArray: any = Object.values(chunk);
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
    } else if (this.isPlaying && (this.chunks.length <= bufferSize)) {
      // schedule & add right now
      this.log('chunk accepted');
      const chunk = this.createChunk(data);
      chunk.start(this.startTime + this.lastChunkOffset);
      this.lastChunkOffset += chunk.buffer.duration;
      this.chunks.push(chunk);
    } else if ((this.chunks.length < (bufferSize / 2)) && !this.isPlaying) {
      // add & don't schedule
      this.log('chunk queued');
      const chunk = this.createChunk(data);
      this.chunks.push(chunk);
    } else {
      // add & schedule entire buffer
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
}
