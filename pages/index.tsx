import Head from 'next/head'
import Image from 'next/image'
import Banner from '../components/Banner'
import Header from '../components/Header'
import MovieDetailModal from '../components/MovieDetailModal'
import requests from '../utils/request'
import {Movie} from '../typings'
import { useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { modalState, movieState } from '../atoms/modalAtom'
import Row from '../components/Row'
import useAuth from '../hooks/useAuth';
import Plans from '../components/Plans'
import payments from '../lib/stripe'
import { getProducts, Product } from '@stripe/firestore-stripe-payments'
import useSubscription from '../hooks/useSubscription'

interface Props {
  netflixOriginals: Movie[];
  trendingNow: Movie[];
  topRated: Movie[];
  actionMovies: Movie[];
  comedyMovies: Movie[];
  horrorMovies: Movie[];
  romanceMovies: Movie[];
  documentaries: Movie[];
  products : Product[];
}

const Home = (props : Props) => {
  const {netflixOriginals,
        trendingNow,
        topRated,
        actionMovies,
        comedyMovies,
        horrorMovies,
        romanceMovies,
        documentaries,
        products
        } = props;
  const [showModal , setShowModal] = useRecoilState(modalState);
  const { loading, user } = useAuth();
  const subscription = useSubscription(user);      

  if(loading || subscription === null) return null;

  if(!subscription) return <Plans products={products} />;
   
  return (
    <div className="relative h-screen bg-gradient-to-b from-gray-900/10 
    to-[#010511] lg:h-[140vh]">
      <Head>
        <title>Netflix - Home page</title>
        <link rel="icon" href="/netflix.png" />
      </Head>
    <Header />
    <main className="relative pl-4 pb-24 lg:space-y-24 lg:pl-16">
      <Banner netflixOriginals={netflixOriginals}/>
      <section className="md:space-y-24">
          <Row title="Trending Now" movies={trendingNow} />
          <Row title="Top Rated" movies={topRated} />
          <Row title="Action Thrillers" movies={actionMovies} />
          {/* My List */}
          {/* {list.length > 0 && <Row title="My List" movies={list} />} */}

          <Row title="Comedies" movies={comedyMovies} />
          <Row title="Scary Movies" movies={horrorMovies} />
          <Row title="Romance Movies" movies={romanceMovies} />
          <Row title="Documentaries" movies={documentaries} />
      </section>
    </main>
    {showModal && <MovieDetailModal />}
    </div>
  )
}

export default Home;

export async function getServerSideProps() {
  let products = null;
  try {
     products = await getProducts(payments, {
      includePrices: true,
      activeOnly: true,
    });
  } catch (error) {
    console.log(error);
  }

  
  const [
    netflixOriginals,
    trendingNow,
    topRated,
    actionMovies,
    comedyMovies,
    horrorMovies,
    romanceMovies,
    documentaries,
  ] = await Promise.all([
    fetch(requests.fetchNetflixOriginals).then((res) => res.json()),
    fetch(requests.fetchTrending).then((res) => res.json()),
    fetch(requests.fetchTopRated).then((res) => res.json()),
    fetch(requests.fetchActionMovies).then((res) => res.json()),
    fetch(requests.fetchComedyMovies).then((res) => res.json()),
    fetch(requests.fetchHorrorMovies).then((res) => res.json()),
    fetch(requests.fetchRomanceMovies).then((res) => res.json()),
    fetch(requests.fetchDocumentaries).then((res) => res.json()),
  ])





  return {
    props :{
      netflixOriginals: netflixOriginals.results,
      trendingNow: trendingNow.results,
      topRated: topRated.results,
      actionMovies: actionMovies.results,
      comedyMovies: comedyMovies.results,
      horrorMovies: horrorMovies.results,
      romanceMovies: romanceMovies.results,
      documentaries: documentaries.results,
      products : products
    }
  };
}
