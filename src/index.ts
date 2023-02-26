import * as LibAVWebCodecs from './lib';
import {MP4Demuxer} from './MP4Demuxer';

let decoder: any;
let demuxer: any;

async function start() {
  await LibAVWebCodecs.load({polyfill: true});
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;

  decoder = new VideoDecoder({
    output(frame: any) {
      createImageBitmap(frame).then((bitmap) => {
        const width = bitmap.width / 2;
        const height = bitmap.height / 2;
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(bitmap, 0, 0, width, height);
        frame.close();
      });
    },
    error(e) {
      console.error('VideoDecoder error', e);
    }
  });

  demuxer = new MP4Demuxer('video.mp4', {
    onConfig(config) {
      console.log('MP4Demuxer onConfig', config);
      decoder.configure(config);
    },
    onChunk(chunk) {
      console.log('MP4Demuxer onChunk', chunk);
      decoder.decode(chunk);
    },
    setStatus(status, message) {
      console.log('MP4Demuxer setStatus', status, message);
    }
  });
}

function stop() {
  decoder?.flush();
  decoder?.close();
  demuxer?.close();
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('start')?.addEventListener('click', start);
  document.getElementById('stop')?.addEventListener('click', stop);
});
