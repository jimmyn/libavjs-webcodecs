import * as LibAVWebCodecs from './lib';
import {MP4Demuxer} from './MP4Demuxer';

async function start() {
  await LibAVWebCodecs.load();
  const canvas = document.createElement('canvas');
  document.body.appendChild(canvas);

  const decoder = new LibAVWebCodecs.VideoDecoder({
    output(frame: any) {
      LibAVWebCodecs.createImageBitmap(frame).then((bitmap) => {
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(bitmap, 0, 0, bitmap.width, bitmap.height);
        frame.close();
      });
    },
    error(e) {
      console.error('VideoDecoder error', e);
    }
  });

  new MP4Demuxer('video.mp4', {
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

void start();
