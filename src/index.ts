import * as LibAVWebCodecs from './lib';
import {MP4Demuxer} from './MP4Demuxer';

async function start() {
  await LibAVWebCodecs.load();
  const decoder = new LibAVWebCodecs.VideoDecoder({
    output(frame: any) {
      console.log('VideoDecoder output', frame);
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
