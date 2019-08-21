import { of, timer } from 'rxjs';
import { map, switchMap, tap, filter } from 'rxjs/operators';
import * as Reveal from 'reveal.js';

const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

// Loading ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// function for fetching the audio file and decode the data
async function getFile(filepath) {
  const response = await fetch(filepath);
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
  return audioBuffer;
}
// function to call each file and return an array of decoded files
async function loadFile(filePath) {
  const track = await getFile(filePath);
  return track;
}
 

const BPM = 80;
const BPS = 60/BPM;
const BEATS_PER_BAR = 4;
const BARS = 4;
const BAR_LENGTH = 60/BPM*16;
const LOOP_LENGTH = BPS*BARS*1000;
const BEATS_PER_LOOP = LOOP_LENGTH/BEATS_PER_BAR/BARS;
class Sound {
  private audioBuffer:any;
  constructor(private name: string) {
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
   loadFile(`https://raw.githubusercontent.com/xnf/rxjs-drums-presentation/master/sounds/${name}.mp3`)
    .then(audioBuffer=>{
this.audioBuffer = audioBuffer;

    });
  }
  play() {
    if (this.audioBuffer){
  const track = audioCtx.createBufferSource(); 
   track.buffer = this.audioBuffer;
  track.connect(audioCtx.destination);
track.start();
    }
  };
};
console.log('LOOP_LENGTH', LOOP_LENGTH)

const surdo = new Sound('surdo');
const snare = new Sound('snare');
// surdo.play();
/*                    1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6                   */
const surdoPattern = [1,1,1,0,1,0,0,1,0,0,1,0,1,1,1,0];
const snarePattern = [1,0,1,0,0,1,1,0,1,1,0,1,0,1,0,1];

timer(0, LOOP_LENGTH)
  .pipe(
    // tap((i) => console.log('.', i)),
    switchMap(() => timer(0, BEATS_PER_LOOP)),
    // tap((i) => console.log('X', i)),
    map((i)=>[surdoPattern[i],snarePattern[i]]),
    tap(([playSurdo, playSnare]) => {
        if (playSurdo){
          surdo.play();
        }
        if (playSnare){
          snare.play();
        }
    }),
  )
  .subscribe();


// Reveal.initialize();
