
  function MiniDaemon (owner, task, len, rate) {
    if (!(this && this instanceof MiniDaemon)) { return; }
    if (arguments.length < 2) { throw new TypeError("MiniDaemon - not enough arguments"); }
    if (owner) { this.owner = owner };
    this.task = task;
    if (len > 0) { this.length = Math.floor(len); }
    if (isFinite(rate) && rate > 0) { this.rate = Math.floor(rate); }
  }