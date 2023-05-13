import { useState } from "react"
import Input from "./Input";
import styled from "styled-components"
import ListOfItems from "./ListOfItems"

export default function fakeTrello( {data, error, mutate} ) {
    const [showNewListForm, setShowNewListForm] = useState(false);

    const newList = (newCard) => {
        //send a post request to our API route with the newGratitude
        fetch('/api/lists', {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({listName: newCard})
        })
        //tell SWR we updated the data so it can update cached data
        //start showing the new data before the request finishes
        //this is called optimistic ui
        mutate([...data, {name: newCard}], {
            optimisticData: [...data, {name: newCard}], 
            rollbackOnError: true, 
            populateCache: true, 
            revalidate: false
        })

    }

    //change this method to start a "DELETE" request to /api
    const clearGratitudes = () => {
        fetch('/api', {
            method: 'DELETE', 
            headers: {
                'Content-Type': 'application/json',
            },
        })
        mutate([], {
            optimisticData: [], 
            rollbackOnError: true, 
            populateCache: true, 
            revalidate: false
        })
    };

    return <Wrapper>
        <Title>fake-trello</Title>
        {!showNewListForm && <Button onClick={setShowNewListForm(!showNewListForm)}>+ List</Button>
        }
        {showNewListForm && <Input addList={newList}/>
        }
        {
            data.length > 0 ? (
            <>
            {/* {console.log(data)} */}
            <ListOfItems data={data.map(row => row.name)} />
            {/* <Button onClick={clearGratitudes}>Start Again</Button> */}
            {/* <Spacer height={30} /> */}
            </> )
            : (
                <p>Data goes here</p>
            )
        }
    </Wrapper>
}

const Spacer = styled.div`
    height: ${(p) => p.height}px;
`

const Wrapper = styled.main`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 30px max(10px, 10%);
`

const Column = styled.div`
    display: flex;
    flex-direction: column;
`


const Title = styled.h1`
    font-size: 4rem;
    text-transform: none;
    letter-spacing: 0px;
    line-height: 1;
    font-family: 'Lalezar', serif;
`

const Button = styled.button`
    width: 100%;
    border: 3px solid var(--burnt);
    border-radius: 5px;
    color: var(--burnt);
    font-size: 1.2rem;
    font-weight: 500;
    text-transform: inherit;
    letter-spacing: inherit;
    padding: 15px;
    cursor: pointer;
    transition: all 200ms;

    &:hover {
        background-color: var(--burnt);
        color: var(--parchment);
    }
`

const ImageWrapper = styled.div`
    width: 100%;
    /* cut off the extra whitespace within image  */
    margin-top: -90px;
    margin-bottom: -40px;
    img {
        width: 100%;
        object-fit: cover;
        display: block;
    }
`