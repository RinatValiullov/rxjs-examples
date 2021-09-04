import { fromEvent, pipe, interval, from } from 'rxjs';
import {
  throttleTime,
  map,
  scan,
  take,
  withLatestFrom,
  distinctUntilChanged
} from 'rxjs/operators';

/* add 'click' event on document*/
// fromEvent(document, 'click')
//   .pipe(scan(count => count + 1, 0))
//   .subscribe(count => console.log(`Clicked ${count} times`));

/* add 'click' event on document with interval */
// fromEvent(document, 'click')
//   .pipe(
//     throttleTime(5000),
//     scan(count => count + 1, 0)
//   )
//   .subscribe(count => console.log(`Clicked ${count} times`));

/* add mouse X coordinate to count variable */
// fromEvent(document, 'click')
//   .pipe(
//     throttleTime(1000),
//     map(event => event.clientX),
//     scan((count, clientX) => count + clientX, 0)
//   )
//   .subscribe(count => console.log(count));

/* Show in console 4 numbers with 1 sec interval */
// const int = interval(1000);
// const showFourNumbers = int.pipe(take(4));
// showFourNumbers.subscribe(number => console.log(`Next: ${number}`));

/* Output object every 16ms */
const canvas = document.querySelector('canvas');

if (canvas.getContext) {
  let ctx = canvas.getContext('2d');
  // drawing code here
}

const TICK_INTERVAL = 1000 / 60;
const item$ = interval(1000).pipe(
  map(() => ({
    time: Date.now(),
    deltaTime: null
  })),
  scan((previous, current) => ({
    time: current.time,
    deltaTime: (current.time - previous.time) / 1000
  }))
);

const CURSOR = {
  left: 37,
  right: 39
};
const input$ = fromEvent(document, 'keydown', event => {
  switch (event.keyCode) {
    case CURSOR.left:
      return -1;
    case CURSOR.right:
      return 1;
    default:
      return 0;
  }
});

const PADDLE_WIDTH = 5;
const PADDLE_SPEED = 20;
const CANVAS_WIDTH = canvas.width;

const movePaddle = (position, ticker, direction) => {
  let next = position + direction * ticker.deltaTime * PADDLE_SPEED;
  return Math.max(
    Math.min(next, CANVAS_WIDTH - PADDLE_WIDTH / 2),
    PADDLE_WIDTH / 2
  );
};

const paddle$ = item$
  .pipe(
    withLatestFrom(input$),
    scan(
      (position, [ticker, direction]) =>
        movePaddle(position, ticker, direction),
      CANVAS_WIDTH / 2
    ),
    distinctUntilChanged()
  )
  .subscribe(pos => console.log(pos));
