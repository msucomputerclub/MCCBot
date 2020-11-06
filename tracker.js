class Tracker {
  constructor(name, duration = 1000 * 60 * 60 * 2.5, interval = 1000) {
    this._name = name;
    this._duration = duration;
    this._isTracking = false;
    this._interval = interval;
    this._attendance = new Map();
  }

  get name() {
    return this._name;
  }
  get duration() {
    return this._duration;
  }
  get isTracking() {
    return this._isTracking;
  }
  get attendance() {
    let list = [];
    this._attendance.forEach((member) => list.push(member));
    return list;
  }
  get interval() {
    return this._interval;
  }

  setInterval(interval) {
    this._interval = interval;
  }
  setDuration(duration) {
    this._duration = duration;
  }
  setIsTracking(isTracking) {
    this._isTracking = isTracking;
    console.log('isTracking is now', this._isTracking);
  }

  track(channel) {
    this._isTracking = true;
    let interval = setInterval(() => {
      if (!this._isTracking) {
        clearInterval(interval);
      }
      channel.members.forEach((member) => {
        if (!this._attendance.has(member.user.id)) {
          this._attendance.set(member.user.id, {
            id: member.user.id,
            name: member.displayName,
          });
        }
      });
    }, this._interval);
  }
}

module.exports = Tracker;
