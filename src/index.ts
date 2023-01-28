import * as LibAVWebCodecs from './lib';
import {MP4Demuxer} from './MP4Demuxer';

async function start() {
  await LibAVWebCodecs.load();
  const decoder = new LibAVWebCodecs.VideoDecoder({
    output(frame: any) {
      console.log('[PREVIEW] frame', frame);
    },
    error(e) {
      console.error('[PREVIEW] error', e);
    }
  });

  const demuxer = new MP4Demuxer('video.mp4', {
    onConfig(config) {
      console.log('onConfig', config);
      decoder.configure(config);
    },
    onChunk(chunk) {
      console.log('onChunk', chunk);
      decoder.decode(chunk);
    },
    setStatus(status, message) {
      console.log('setStatus', status, message);
    }
  });
}

void start();
