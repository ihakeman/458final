import styled from 'styled-components'
import Head from 'next/head'
import FakeTrello from "../components/FakeTrello"
import useSWR from 'swr'

/* 
TODO: use useSWR to fetch the data from the API route and pass it in to GratitudeApp component,
so the front end renders the gratitues from the DB
*/

//function to fetch a particular ulr and return the data as json
const fetcher = url => fetch(url).then(r=>r.json())

export default function Home() {
  const { data, error, mutate} = useSWR('/api/lists', fetcher, {refreshInterval: 500,})//https://stackoverflow.com/questions/64245201/revalidating-data-using-mutate-in-swr-which-should-i-use

    //if the api encounters an error, this will redner
    if (error) {
      return <h1>Error!</h1>
    }
  
    //if the data hasn't been resolved yet, this renders
    if (!data) {
      return <h1>Loading...</h1>
    }//always want loading error and expected


  return <>
    <Head>
      <title> Gratitude Journal </title>
      <link rel="preconnect" href="https://fonts.googleapis.com"/>
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap" rel="stylesheet"/>
    </Head>
    <FakeTrello data={data} error={error} mutate={mutate}/>
  
  </>
}
