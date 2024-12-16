import React, { useState, useEffect } from 'react';

function App() {
  const [sessionLength, setSessionLength] = useState(25);
  const [breakLength, setBreakLength] = useState(5);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // Time in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isSession, setIsSession] = useState(true); // True if in session, false if in break

  const startStopHandler = () => {
    if (isRunning) {
      clearInterval(timer);
    } else {
      timer = setInterval(decrementTime, 1000);
    }
    setIsRunning(!isRunning);
  };

  const decrementTime = () => {
    setTimeLeft(prevTime => {
      if (prevTime <= 0) {
        handleSwitchPeriod();
        return isSession ? breakLength * 60 : sessionLength * 60;
      }
      return prevTime - 1;
    });
  };

  const handleSwitchPeriod = () => {
    setIsSession(prevSession => !prevSession);
    // Play sound when time is up
    const beep = document.getElementById('beep');
    beep.play();
  };

  const resetHandler = () => {
    clearInterval(timer);
    setSessionLength(25);
    setBreakLength(5);
    setTimeLeft(25 * 60);
    setIsRunning(false);
    setIsSession(true);
    const beep = document.getElementById('beep');
    beep.pause();
    beep.currentTime = 0; // Reset beep sound
  };

  // Convert seconds to mm:ss format
  const formatTime = time => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  useEffect(() => {
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div>
      <div id="break-label">Break Length</div>
      <div id="break-length">{breakLength}</div>
      <button id="break-decrement" onClick={() => setBreakLength(prev => Math.max(prev - 1, 1))}>-</button>
      <button id="break-increment" onClick={() => setBreakLength(prev => Math.min(prev + 1, 60))}>+</button>

      <div id="session-label">Session Length</div>
      <div id="session-length">{sessionLength}</div>
      <button id="session-decrement" onClick={() => setSessionLength(prev => Math.max(prev - 1, 1))}>-</button>
      <button id="session-increment" onClick={() => setSessionLength(prev => Math.min(prev + 1, 60))}>+</button>

      <div id="timer-label">{isSession ? "Session" : "Break"}</div>
      <div id="time-left">{formatTime(timeLeft)}</div>

      <button id="start_stop" onClick={startStopHandler}>
        {isRunning ? "Pause" : "Start"}
      </button>
      <button id="reset" onClick={resetHandler}>Reset</button>

      <audio id="beep" src="beep-sound.mp3"></audio>
    </div>
  );
}

export default App;
