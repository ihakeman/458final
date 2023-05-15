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
    const deleteList = (row) => {
        console.log(row.number)
        fetch(`/api/lists/${row.number}`, {
            method: 'DELETE', 
            headers: {
                'Content-Type': 'application/json',
            },
        })
        mutate([...data.filter((rowData)=> (rowData.number !== row.number))], {
            optimisticData: [...data.filter((rowData)=> (rowData.number !== row.number))], 
            rollbackOnError: true, 
            populateCache: true, 
            revalidate: false
        })
    };

    const swapDown = (row) => {
        fetch(`/api/lists/swapdown/`, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({rowData: row})
        })
        let num = row.number
        console.log(num)
        let maxBelow = Math.max(...data.filter((rowData) => (rowData.number < num)).map((a) => a.number))
        let rowBelow = data.filter((rowData) => rowData.number === maxBelow)
        console.log('rowbelow', rowBelow)
        console.log(...data.filter((rowData) => rowData.number < num))
        let lowest = data.filter((rowData) => (rowData.number < Math.max(data.filter((rowData) => (rowData.number < num)).map((a) => a.number))))
        let upper = data.filter((rowData) => (rowData.number > num))
       // ...data.filter((rowData) => rowData.number === row.number), ...data.filter((rowData) => rowData.number === Math.max(...data.filter((rowData) => (rowData.number < row.number)).map((a) => a.number))),
        //last used: ...data.filter((rowData) => (rowData.number < Math.max(...data.filter((rowData) => (rowData.number < num)).map((a) => a.number)))), row, rowBelow[0], ...data.filter((rowData) => (rowData.number > num))
        mutate([...data], {
            optimisticData: [...data], 
            rollbackOnError: true, 
            populateCache: true, 
            revalidate: false
        })
    };
    const swapUp = (row) => {
        console.log(row.number)
        fetch(`/api/lists/swapup/`, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({rowData: row})
        })
        mutate([...data], {
            optimisticData: [...data], 
            rollbackOnError: true, 
            populateCache: true, 
            revalidate: false
        })
    };


    return <Wrapper>
        <Title>fake-trello</Title>
        {!showNewListForm && <Button onClick={() => {setShowNewListForm(!showNewListForm)}}>+ List</Button>
        }
        { showNewListForm && <Input addList={newList} onSubmit={() => setShowNewListForm(!showNewListForm)}/>}
        {
            data.length > 0 ? (
            <>
            {/* https://stackoverflow.com/questions/43572436/sort-an-array-of-objects-in-react-and-render-them */}
            <ListOfItems data={data.sort((a, b) => a.number > b.number ? 1 : -1).map((row) =><div key={row}><button onClick={() => swapDown(row)}>left</button> <button onClick={() => swapUp(row)}>right</button>{row.name}<button onClick={() => {deleteList(row)}}>delete</button></div>)} />
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
    flex-direction: column;
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
    color: black;
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