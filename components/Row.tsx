import { ChevronRightIcon } from '@heroicons/react/20/solid';
import { ChevronLeftIcon } from '@heroicons/react/24/solid';
import { DocumentData } from 'firebase/firestore';
import React, {useRef, useState} from 'react'
import {Movie} from '../typings'
import Thumbnail from './Thumbnail';

interface Props {
    title: string;
    movies: Movie[] | DocumentData;
}

function Row(props : Props) {
    const { title, movies } = props;
    const rowRef = useRef<HTMLDivElement>(null);
    const [isMoved, setIsMoved] = useState(false);

    const handleClick = (direction : string) => {
        setIsMoved(true);

        if(rowRef.current) {
            const { scrollLeft, clientWidth , scrollWidth } = rowRef.current;
            const maxScroll = scrollWidth - clientWidth;
            

            const scrollTo = 
                direction === 'left' 
                ? scrollLeft - clientWidth
                : scrollLeft + clientWidth;

            
            if(scrollLeft === maxScroll) {
                rowRef.current.scrollTo({left : 0 , behavior : 'smooth'});
            } else if(scrollLeft === 0) {
                rowRef.current.scrollTo({left : maxScroll, behavior : 'smooth'}) 
            }    
             else {
                rowRef.current.scrollTo({left : scrollTo, behavior : 'smooth'})    
            }
        }



    }

    return (
    <div className="group space-y-0.5 md:space-y-2">
        <h2 className="w-56 cursor-pointer text-sm font-semibold text-[#e5e5e5] 
        transition-duration-200 hover:text-white md:text-2xl">{title}</h2>

        <div className="relative md:-ml-2">
            <ChevronLeftIcon className="absolute top-0 bottom-0 left-2 z-40 m-auto h-9 w-9 
            cursor-pointer opacity-0 transition hover:scale-125 group-hover:opacity-100"
            onClick={() => handleClick("left")}
            />

            <div ref={rowRef} className="flex scrollbar-hide items-center space-x-0.5 overflow-x-scroll md:space-x-2.5 md:p-2">
                {movies.map((movie: Movie | DocumentData) => <Thumbnail key={movie.id} movie={movie} />)}
            </div>

            <ChevronRightIcon className="absolute top-0 bottom-0 right-2 z-40 m-auto h-9 w-9 
            cursor-pointer opacity-0 transition hover:scale-125 group-hover:opacity-100" 
            onClick={() => handleClick("right")}
            />
        </div>
    </div>
  )
}

export default Row