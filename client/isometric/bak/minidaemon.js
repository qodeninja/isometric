/*\
|*|
|*|  MiniDaemon - Mozilla Developer Network
|*|
|*|  https://developer.mozilla.org/en-US/docs/DOM/window.setInterval
|*|
\*/

function MiniDaemon (oOwner, fTask, nLen, nRate) {
  if (!(this && this instanceof MiniDaemon)) { return; }
  if (arguments.length < 2) { throw new TypeError("MiniDaemon - not enough arguments"); }
  if (oOwner) { this.owner = oOwner };
  this.task = fTask;
  if (nLen > 0) { this.length = Math.floor(nLen); }
  if (isFinite(nRate) && nRate > 0) { this.rate = Math.floor(nRate); }
}

MiniDaemon.prototype.owner = null;
MiniDaemon.prototype.task = null;
MiniDaemon.prototype.length = Infinity;
MiniDaemon.prototype.rate = 100;

  /* These properties should be read-only */

MiniDaemon.prototype.SESSION = -1;
MiniDaemon.prototype.INDEX = 0;
MiniDaemon.prototype.PAUSED = true;
MiniDaemon.prototype.BACKW = true;

  /* Global methods */

MiniDaemon.forceCall = function (oDmn) {
  oDmn.INDEX += oDmn.BACKW ? -1 : 1;
  if (oDmn.task.call(oDmn.owner, oDmn.INDEX, oDmn.length, oDmn.BACKW) === false || oDmn.isAtEnd()) { oDmn.pause(); return false; }
  return true;
};

  /* Instances methods */

MiniDaemon.prototype.isAtEnd = function () {
  return this.BACKW ? isFinite(this.length) && this.INDEX < 1 : this.INDEX + 1 > this.length;
};

MiniDaemon.prototype.synchronize = function () {
  if (this.PAUSED) { return; }
  clearInterval(this.SESSION);
  this.SESSION = setInterval(MiniDaemon.forceCall, this.rate, this);
};

MiniDaemon.prototype.pause = function () {
  clearInterval(this.SESSION);
  this.PAUSED = true;
};

MiniDaemon.prototype.start = function (bReverse) {
  var bBackw = Boolean(bReverse);
  if (this.BACKW === bBackw && (this.isAtEnd() || !this.PAUSED)) { return; }
  this.BACKW = bBackw;
  this.PAUSED = false;
  this.synchronize();
};
