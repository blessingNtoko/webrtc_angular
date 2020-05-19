import { Injectable } from '@angular/core';

const ctx = new AudioContext();
const bufferSize = 10;
const debug = true;

@Injectable({
  providedIn: 'root'
})
export class SoundbufferService {

  private chunks: Array<AudioBufferSourceNode> = [];
  private isPlaying = false;
  private startTime = 0;
  private lastChunkOffset = 0;


  constructor() { }

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
      for (let i = 0; i < this.chunks.length; i++) {
        const chunkie = this.chunks[i];
        chunkie.start(this.startTime + this.lastChunkOffset);
        this.lastChunkOffset += chunk.buffer.duration;
      }
    }
  }
}
