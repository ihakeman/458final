import { createClient} from '@supabase/supabase-js'

//takes request and response as parameters
export default async function handler(req, res){
    //url unique to each project
    const supabaseUrl = 'https://nkdpzkbggibltctsbuyd.supabase.co'
    //private API key saved as an environment variable
    const supabaseKey = process.env.SUPABASE_KEY
    // create a connection object to our project using the API key
    const supabase = createClient(supabaseUrl, supabaseKey)
    //get the path that was entered that includes the title
    const { number } = req.query
        // const { data: update, errorUpdate } = null;
        // let { data: rows, errorFetch } = await supabase
        //     .from('lists')
        //     .select('*')
        // let numbers = rows.map((a)=>a.number)
        // let last = Math.max(...numbers);
        // let first = Math.min(...numbers)
        // if(first === last){
        //     //don't have to do anything but just delete it
        // }
        // else if(number === first){
        //     //just update the next one and set prev to null
        // ({ update, errorUpdate } = await supabase
        // .from('lists')
        // .update({ previous: null })
        // .eq('number', `${rows.filter((rowData)=> (rowData.number === number)).next}`))
        // }
        // else if (number === last){
        //     //just update the previous one and set next to null
        //     ({ update, errorUpdate } = await supabase
        //         .from('lists')
        //         .update({ next: null })
        //         .eq('number', `${rows.filter((rowData)=> (rowData.number === number)).previous}`))
        // }
        // else{
        //     //must update previous and next before removing
        // }



    const { data, error } = await supabase
        .from('lists')
        .delete()
        .eq('number', number)
        res.status(200).json(data)

}