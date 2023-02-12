import React, { useEffect, useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/solid'
import { PlusIcon, HandThumbUpIcon, CheckIcon } from '@heroicons/react/24/outline'
import MuiModal from '@mui/material/Modal'
import ReactPlayer from 'react-player'
import MediaPlayer from './MediaPlayer';
import {FaPlay, FaVolumeOff, FaVolumeUp} from 'react-icons/fa';
import { useRecoilValue , useRecoilState } from 'recoil'
import { modalState, movieState } from '../atoms/modalAtom'
import { Element, Genre, Movie } from '../typings';
import useList from '../hooks/useList'
import { deleteDoc, doc, setDoc,onSnapshot,DocumentData,collection } from 'firebase/firestore'
import { database } from '../firebase'
import useAuth from '../hooks/useAuth'
import toast, { Toaster } from 'react-hot-toast'

function MovieDetailModal() {
    const [showModal, setShowModal] = useRecoilState(modalState);
    const [movie , setMovie] = useRecoilState(movieState);
    const [trailer, setTrailer] = useState("");
    const [genres, setGenres] = useState<Genre[]>([]);
    const [muted, setMuted] = useState(false);
    const [addedToList, setAddedToList] = useState(false);
    const { user } = useAuth();
    const [movies, setMovies] = useState<DocumentData[] | Movie[]>([]);

    useEffect(() => {
        if(!movie) return;

        async function fetchMovie() {
            const response = await fetch(`https://api.themoviedb.org/3/${
                movie?.media_type === 'tv' ? 'tv' : 'movie'
              }/${movie?.id}?api_key=${
                process.env.NEXT_PUBLIC_API_KEY
              }&language=en-US&append_to_response=videos`);

            const data = await response.json();
            
            if(data?.videos) {
              const index = data.videos.results.findIndex((el : Element)  => el.type === "Trailer");
              setTrailer(data.videos?.results[index]?.key);
            }

            if(data?.genres) {
              setGenres(data.genres);
            }
        }

        fetchMovie();

    },[movie]) 

    useEffect(() => {
      if (user) {
        return onSnapshot(
          collection(database, 'customers', user.uid, 'myList'),
          (snapshot) => setMovies(snapshot.docs)
        )
      }
    }, [database, movie?.id])
  
    // Check if the movie is already in the user's list
    useEffect(
      () =>
        setAddedToList(
          movies.findIndex((result) => result.data().id === movie?.id) !== -1
        ),
      [movies]
    )


    const handleClose = () => {
        setShowModal(false);
    }

    const handleList = async () => {
      if(addedToList) {
        await deleteDoc(doc(database, "customers", user!.uid, "myList", movie?.id.toString()));

        toast(`${movie?.title || movie?.original_name} has been removed from My List`,{
          duration: 8000,
          
        });
      } else {
        await setDoc(doc(database, "customers", user!.uid, "myList", movie?.id.toString()!), {...movie});

        toast(`${movie?.title || movie?.original_name} has been added to My List`,{
          duration: 8000,
          
        });
      }

   
    }
  return (
    <MuiModal 
    open={showModal} 
    className="fixed !top-7 left-0 right-0 z-50 mx-auto w-full max-w-5xl overflow-hidden 
    overflow-y-scroll rounded-md scrollbar-hide"
    >
        <React.Fragment>
          <Toaster position="bottom-center" />
            <button onClick={handleClose} className="modalButton absolute right-5 top-5 !z-40 
            h-9 w-9 border-none bg-[#181818] hover:bg-[#181818]">
                <XMarkIcon className="h-6 w-6" />
            </button> 

        <div className="relative pt-[56.25%]">
          <MediaPlayer
            muted={muted}
            handleList={handleList}
            addedToList={addedToList}
            setMuted={setMuted}
            trailer={trailer}
          />

        </div>
        <div className="flex space-x-16 rounded-b-md bg-[#181818] px-10 py-8">
          <div className="space-y-6 text-lg">
            <div className="flex items-center space-x-2 text-sm">
              <p className="font-semibold text-green-400">
                {movie!.vote_average * 10}% Match
              </p>
              <p className="font-light">
                {movie?.release_date || movie?.first_air_date}
              </p>
              <div className="flex h-4 items-center justify-center rounded border border-white/40 px-1.5 text-xs">
                HD
              </div>
            </div>
            <div className="flex flex-col gap-x-10 gap-y-4 font-light md:flex-row">
              <p className="w-5/6">{movie?.overview}</p>
              <div className="flex flex-col space-y-3 text-sm">
                <div>
                  <span className="text-[gray]">Genres:</span>{' '}
                  {genres.map((genre) => genre.name).join(', ')}
                </div>

                <div>
                  <span className="text-[gray]">Original language:</span>{' '}
                  {movie?.original_language}
                </div>

                <div>
                  <span className="text-[gray]">Total votes:</span>{' '}
                  {movie?.vote_count}
                </div>
              </div>
            </div>
          </div>
        </div>
        </React.Fragment>
    </MuiModal>
  )
}

export default MovieDetailModal