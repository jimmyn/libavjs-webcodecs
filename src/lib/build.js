#!/usr/bin/env node
const fs = require('fs');

const browserify = require('browserify');
const browserPackFlat = require('browser-pack-flat');
const minifyStream = require('minify-stream');
const tsify = require('tsify');

let minify = false;
let noImplicitAny = false;
let main = 'src/main.ts';
let standalone = 'LibAVWebCodecs';
for (let ai = 2; ai < process.argv.length; ai++) {
  const arg = process.argv[ai];
  if (arg === '-m' || arg === '--minify') {
    minify = true;
  } else if (arg === '-n' || arg === '--no-implicit-any') {
    noImplicitAny = true;
  } else if (arg === '-s' || arg === '--standalone') {
    standalone = process.argv[++ai];
  } else if (arg[0] !== '-') {
    main = arg;
  } else {
    console.error(`Unrecognized argument ${arg}`);
    process.exit(1);
  }
}

let b = browserify({standalone})
  .add(main)
  .plugin(tsify, {
    noImplicitAny,
    files: []
  })
  .plugin(browserPackFlat)
  .bundle()
  .on('error', (error) => {
    console.error(error.toString());
  });
if (minify) {
  b = b.pipe(minifyStream());
}
b.pipe(process.stdout);
