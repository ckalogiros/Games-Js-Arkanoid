"use strict";

/**
 * FPS Timer
 */
export const fps = {
    time  : 0.0,
    accum : 0.0,
    delta : 0.0,
    cnt   : 0,
    elapsedCnt   : 0,
    elapsedAccum : 0,
}

fps.Start = function(){
    this.time = Date.now( ) * 0.001;
}

fps.Stop = function(){
    this.delta = Date.now( ) * 0.001 - this.time;
    this.accum += this.delta;
    this.cnt++;
    this.elapsedAccum += this.delta
    this.elapsedCnt++;
}


export function GetDeltaTime(){ return fps.delta; }

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Generic Timers
 */
const MAX_TIMERS_NUM = 200;

class Timer {

    contructor(start, duration, step, isActive){
        this.t = start;
        this.duration = duration;
        this.step = step;
        this.isActive = isActive;
    }

    t = 0.;
    isActive = false;
    duration = 0;
    step = 0.;
    idx = INT_NULL;
    // Callback = null; // A Callback funtion to inform the owner

    SetTimer(start, duration, step, idx){
        this.t = start;
        this.duration = duration;
        this.step = step;
        this.isActive = true;
        this.idx = idx;
    }
        
    ClearTimer(){
        this.t = this.duration;
        this.duration = 0;
        this.step = 0;
        this.isActive = false;
        this.idx = INT_NULL;
    }

};
class Timers {

    buffer = [];
    maxSize = MAX_TIMERS_NUM;
    curSize = 0;
    count   = 0;

    CreateTimer(start, duration, step){

        const idx = this.GetFreeTimer(); // Get the first not active timer 
        this.buffer[idx].SetTimer(start, duration, step, idx); 
        this.curSize++;
        this.count++;
        
        return this.buffer[idx];
    }
    
    ClearTimer(idx){
        this.buffer[idx].ClearTimer();
        this.count--;
        if(this.curSize !== this.count){
            // Sort(); // TODO: Implement
        }
        if(this.curSize === idx){
            this.curSize--;
        }
    }

    GetFreeTimer(){
        for(let i=0; i<this.maxSize; i++){
            if(this.buffer[i].isActive === false){
                // console.log('Storing timer to buffer index:', i)
                return i;
            }
        }
        alert('No Space for new Timer. Timer.js');
    }

    Init(){
        for(let i=0; i<this.maxSize; i++){
            this.buffer[i] = new Timer(0., 0., 0., false);
        }
    }
};

const timers = new Timers; // This is the (local scoped) variable for all timers.
// Initialize Timers buffer
timers.Init();


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Getters-Setters
*/
export function TimersGetTimers(){
    return timers;
}
export function TimersGetTimer(idx){
    return timers.buffer[idx];
}


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Public Functions
 */
export function TimersCreateTimer(start, duration, step){
    return timers.CreateTimer(start, duration, step);
}


/**
 *  Set and Clear timeInterval
 *      var refreshIntervalId = setInterval(fname, 10000);
 *      clearInterval(refreshIntervalId);
*/
const intervalTimers = {
    t1s: null,
};

export function SetTimer(fn, ms, FpsNode){

    intervalTimers.t1s = setInterval(fn, ms, FpsNode);
}


/**
 * Update all timers used bby the game here.
 */
// TODO: Runs for every frame, so make it efficient
export function TimersUpdateTimers(){

    for(let i=0; i<timers.maxSize; i++){
        const t = timers.buffer[i]; // Cash
        if(t.isActive){
            // Stop timer if the duration cycle has been completed
            if(t.t >= t.duration){
                timers.ClearTimer(i);
            }
            t.t += t.step;
        }
    }
}

