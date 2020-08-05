const EasingFunctions = {
    // no easing, no acceleration
    linear: function(t){ return t },
    // accelerating from zero velocity
    easeInQuad: function(t){ return t * t },
    // decelerating to zero velocity
    easeOutQuad: function(t){ return t * (2 - t) },
    // acceleration until halfway, then deceleration
    easeInOutQuad: function(t){ return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t },
    // accelerating from zero velocity
    easeInCubic: function(t){ return t * t * t },
    // decelerating to zero velocity
    easeOutCubic: function(t){ return (--t) * t * t + 1 },
    // acceleration until halfway, then deceleration
    easeInOutCubic: function(t){ return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1 },
    // accelerating from zero velocity
    easeInQuart: function(t){ return t * t * t * t },
    // decelerating to zero velocity
    easeOutQuart: function(t){ return 1 - (--t) * t * t * t },
    // acceleration until halfway, then deceleration
    easeInOutQuart: function(t){ return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t },
    // accelerating from zero velocity
    easeInQuint: function(t){ return t * t * t * t * t },
    // decelerating to zero velocity
    easeOutQuint: function(t){ return 1 + (--t) * t * t * t * t },
    // acceleration until halfway, then deceleration
    easeInOutQuint: function(t){ return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t },
    spring: function(x){
        if(x > 0.95)
            return 1;
        const factor = 0.3;
        return Math.pow(2, -6 * x) * Math.sin((x - factor / 6) * (2 * Math.PI) / factor) + 1;
    },
    springRelaxed: function(x){
        if(x > 0.98)
            return 1;
        const factor = 0.44;
        return Math.pow(2, -8 * x) * Math.sin((x - factor / 4) * (2 * Math.PI) / factor) + 1;
    }
};

const AnimationUtil = () => {
    let _isRunning = false,
        _startTime = null,
        _duration = 0,
        _fr = null,
        _interpolator = null,
        _rawValues = [],
        _endListeners = [],
        _updateListeners = [],
        /* Between 0 (on start) and 1 (when ended) */
        _interpolatedFraction = 0;

    const update = ts => {
        if(_isRunning) {
            let elapsed = ts - _startTime,
                linearFraction;
            if(elapsed > _duration) {
                elapsed = _duration;
                linearFraction = 1.0;
            } else {
                const fraction = elapsed / _duration;
                linearFraction = fraction < 0 ? 0 : (fraction > 1.0 ? 1.0 : fraction);
            }
            _interpolatedFraction = !_interpolator ? linearFraction : _interpolator(linearFraction);

            notifyAnimationUpdate();

            if(elapsed < _duration)
                _fr = requestAnimationFrame(update);
            else {
                _isRunning = false;
                notifyAnimationEnd();
            }
        }
    };
    const notifyAnimationUpdate = _ => {
        for(let i = 0, l = _updateListeners.length; i < l; i++)
            _updateListeners[i]();
    };
    const notifyAnimationEnd = _ => {
        for(let i = 0, l = _endListeners.length; i < l; i++)
            _endListeners[i]();
    };

    return {
        EasingFunctions,
        addUpdateListener: l => {
            _updateListeners.push(l);
        },
        addEndListener: l => {
            _endListeners.push(l);
        },
        setInterpolator: i => {
            _interpolator = i;
        },
        getDuration: _ => _duration,
        setDuration: d => _duration = d,
        setValues: (f, t) => {
            _rawValues[0] = f;
            _rawValues[1] = t;
        },
        getAnimatedRawValue: _ => {
            return _rawValues[0] + (_interpolatedFraction * (_rawValues[1] - _rawValues[0]));
        },
        getAnimatedIntValue: _ => {
            return Math.round(_rawValues[0] + (_interpolatedFraction * (_rawValues[1] - _rawValues[0])));
        },
        isRunning: _ => _isRunning,
        start: _ => {
            if(!_isRunning) {
                _isRunning = true;
                _interpolatedFraction = 0;
                _duration = _duration === 0 ? 300 : _duration;
                _startTime = performance.now();
                _fr = requestAnimationFrame(update);
            }
        },
        end: _ => {
            _isRunning = false;
            _interpolatedFraction = 1.0;
            notifyAnimationEnd();
        },
        cancel: _ => {
            _isRunning = false;
            cancelAnimationFrame(_fr);
        },
        clearCallBacks: _ => {
            _endListeners = [];
            _updateListeners = [];
        }
    };
};

export default AnimationUtil;