import React, {useState} from 'react'
import {FaPlay,FaPause ,FaVolumeOff, FaVolumeUp} from 'react-icons/fa';
import ReactPlayer from 'react-player';
import { PlusIcon, HandThumbUpIcon, CheckIcon } from '@heroicons/react/24/outline'



interface Props {
    muted : boolean;
    handleList : Function;
    addedToList : boolean;
    setMuted : Function;
    trailer : string;
}


function MediaPlayer(props : Props) {
    const {muted  , handleList, addedToList, setMuted , trailer} = props;
    const [play, setPlay] = useState(true);
  return (
    <React.Fragment>
        <ReactPlayer
            url={`https://www.youtube.com/watch?v=${trailer}`}
            width="100%"
            height="100%"
            style={{ position: 'absolute', top: '0', left: '0' }}
            playing={play}
            muted={muted}
            onReady={() => console.log('ready')}
          />
          <div className="absolute bottom-10 flex w-full items-center justify-between px-10">
            <div className="flex space-x-2">
              <button onClick={() => setPlay(!play)}
              className="flex items-center gap-x-2 rounded bg-white px-8 text-xl font-bold text-black transition hover:bg-[#e6e6e6]">
                {play ?  
                    <>
                    <FaPause className="h-7 w-7 text-black" /> Pause
                    </>
                : <>
                <FaPlay className="h-7 w-7 text-black" /> Play
                </>
                }
              </button>
              <button className="modalButton" onClick={() => handleList()}>
                {addedToList ? (
                  <CheckIcon className="h-7 w-7" />
                ) : (
                  <PlusIcon className="h-7 w-7" />
                )}
              </button>
              <button className="modalButton">
                <HandThumbUpIcon className="h-6 w-6" />
              </button>
            </div>
            <button className="modalButton" onClick={() => setMuted(!muted)}>
              {muted ? (
                <FaVolumeOff className="h-6 w-6" />
              ) : (
                <FaVolumeUp className="h-6 w-6" />
              )}
            </button>
          </div>
    </React.Fragment>
  )
}

export default MediaPlayer;