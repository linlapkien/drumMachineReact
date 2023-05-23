import './App.css';
import React from 'react';

const firstSoundGroups = [
  {
    KeyCode: 81,
    key: 'Q',
    text: 'Heater: 1',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3',
  },
  {
    KeyCode: 87,
    key: 'W',
    text: 'Heater: 2',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3',
  },
  {
    KeyCode: 69,
    key: 'E',
    text: 'Heater: 3',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3',
  },
  {
    KeyCode: 65,
    key: 'A',
    text: 'Heater: 4',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3',
  },
  {
    KeyCode: 83,
    key: 'S',
    text: 'Clap',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3',
  },
  {
    KeyCode: 68,
    key: 'D',
    text: 'Open-HH',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3',
  },
  {
    KeyCode: 90,
    key: 'Z',
    text: `Kick-n'-Hat`,
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3',
  },
  {
    KeyCode: 88,
    key: 'X',
    text: `Kick`,
    url: 'https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3',
  },
  {
    KeyCode: 67,
    key: 'C',
    text: `Closed-HH`,
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3',
  },
];

// play is props
const Keyboard = ({ power, play }) => {
  return power
    ? firstSoundGroups.map((sound) => <KeyboardKey play={play} sound={sound} />)
    : firstSoundGroups.map((sound) => <KeyboradOffline sound={sound} />);
  // Return KeyboardKey compenent here
  // Seperate it into a new component,then pass the props into it.
};

// turn Off keyboard
const KeyboradOffline = ({ sound: { key, url } }) => {
  return (
    <button className="drum-pad">
      <audio className="clip" id={key} src={url}></audio>
      {key}
    </button>
  );
};

const KeyboardKey = ({ play, sound: { text, key, url, KeyCode } }) => {
  const handleKeydown = (e) => {
    if (e.keyCode === KeyCode) {
      play(key, text);
    }
  };

  // Event key down
  React.useEffect(() => {
    document.addEventListener('keydown', handleKeydown);
    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  }, []);
  // Calculate the key index based on the key character
  const keyIndex = firstSoundGroups.findIndex((sound) => sound.key === key);

  // Generate the button ID dynamically based on the key
  const buttonId = `drum-${keyIndex}`;
  //console.log(buttonId);

  // Create a button element here
  return (
    <button className="drum-pad" id={buttonId} onClick={() => play(key, text)}>
      <audio className="clip" id={key} src={url}></audio>
      {key}
    </button>
  );
};

// The right board
const DumControle = ({ stop, name, volume, handleVolumeChange, power }) => {
  return (
    <div className="controle">
      <button onClick={stop}>Turn the Power {power ? 'OFF' : 'ON'}</button>
      <br />
      <h2>Volume: %{Math.round(volume * 100)}</h2>
      <input
        max={1}
        min={0}
        step={0.01}
        type="range"
        value={volume}
        onChange={handleVolumeChange}
      />
      <br />
      <h2 id="display">{name}</h2>
    </div>
  );
};

function App() {
  const [power, setPower] = React.useState(true);
  const [soundName, setSoundName] = React.useState('');
  const [volume, setVolume] = React.useState(1);
  const [sounds, setSounds] = React.useState(firstSoundGroups);

  // ON?OFF machine
  const stop = () => {
    setPower(!power);
  };

  // audio play function
  const play = (key, soundName) => {
    setSoundName(soundName);
    const audio = document.getElementById(key);
    console.log(audio);

    /* 
        The issue you're encountering with the audio not playing could be due to autoplay restrictions imposed by modern browsers. Browsers often block autoplaying audio or video to prevent unwanted user experiences, such as unexpected sounds.
    */
    const playAudio = () => {
      audio.currentTime = 0;
      audio.play();
    };

    if (audio.paused) {
      // Play audio if it's paused
      playAudio();
    } else {
      // Pause and play audio if it's already playing
      audio.pause();
      playAudio();
    }
  };

  // Handle set volume change
  const handleVolumeChange = (event) => {
    setVolume(event.target.value);
  };

  // Set volume value
  const setKeyVolume = () => {
    const audios = sounds.map((sound) => document.getElementById(sound.key));
    audios.forEach((audio) => {
      if (audio) {
        audio.volume = volume;
      }
    });
  };

  return (
    <div id="drum-machine">
      {setKeyVolume()} {/*call the volumeValue*/}
      <div className="wrapper">
        <div className="keyboard">
          <Keyboard power={power} play={play} />
          {/* Pass the play function as a prop */}
        </div>
        <DumControle
          stop={stop}
          power={power}
          name={soundName}
          volume={volume}
          handleVolumeChange={handleVolumeChange}
        />
      </div>
    </div>
  );
}

export default App;
