import { of } from 'rxjs'; 
import { map } from 'rxjs/operators';
import * as Reveal from 'reveal.js';

const source = of('World').pipe(
  map(x => `Hello ${x}!`)
);

source.subscribe(x => console.log(x));




Reveal.initialize();
