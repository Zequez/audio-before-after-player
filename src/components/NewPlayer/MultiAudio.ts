export default class MultiAudio {
  a: HTMLAudioElement;
  b: HTMLAudioElement;
  c: HTMLAudioElement;

  constructor(aSrc: string, bSrc: string, current: boolean) {
    this.a = new Audio(aSrc);
    this.b = new Audio(bSrc);

    this.c = !current ? this.a : this.b;
  }

  switchFile(current: boolean) {
    const newC = !current ? this.a : this.b;
    if (!this.c.paused) {
      this.c.pause();
      newC.play();
    }
    newC.currentTime = this.c.currentTime;
    this.c.currentTime = 0;
    this.c = newC;
  }

  stop() {
    this.c.pause();
    this.c.currentTime = 0;
  }

  pause() {
    this.c.pause();
  }

  play() {
    this.c.play();
  }

  get paused() {
    return this.c.paused;
  }

  get currentTime() {
    return this.c.currentTime;
  }

  set currentTime(val) {
    this.c.currentTime = val;
  }

  onDurationLoads(cb: (duration: number) => void) {
    if (this.c.duration) {
      cb(this.c.duration);
    } else {
      this.addEvent(this.c, "loadedmetadata", () => {
        cb(this.c.duration);
      });
    }
  }

  onLoadFinishes(cb: () => void) {
    this.addEvent(this.c, "canplay", () => {
      cb();
    });
  }

  onEnded(cb: () => void) {
    this.addEvent(this.a, "ended", () => {
      cb();
    });
    this.addEvent(this.b, "ended", () => {
      cb();
    });
  }

  events: [HTMLAudioElement, string, () => void][] = [];
  private addEvent(el: HTMLAudioElement, name: string, cb: () => void) {
    el.addEventListener(name, cb);
    this.events.push([el, name, cb]);
  }

  cleanEvents() {
    this.events.forEach(([el, name, cb]) => {
      el.removeEventListener(name, cb);
    });
  }
}
