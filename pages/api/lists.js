import { createClient} from '@supabase/supabase-js'

export default async function request(req, res){
    //url unique to each project
    const supabaseUrl = 'https://nkdpzkbggibltctsbuyd.supabase.co'
    //private API key saved as an environment variable
    const supabaseKey = process.env.SUPABASE_KEY
    // create a connection object to our project using the API key
    const supabase = createClient(supabaseUrl, supabaseKey)

    if (req.method === "GET") {
        //from database api recommendations on supabase website    but with : grad... removed since we don't need to rename it
        //this fetches all the rows in the database (the whole thing)
        let { data , error } = await supabase.from('lists').select('*')
        // send the data back as a result if everyhting goes as expected
        res.status(200).json(data)
    } 
    
    //FIX SO IT POSTS ON THE DB
    else if (req.method === "POST") {
        //retrieve the gradtitude entry from the request body and insert that gratitude as a new row in our supabase db
        //req sent as post has a body
        const body = req.body
        // console.log("RECEIVED: " + JSON.stringify(body))

       
        let { data: lists, errorFetch } = await supabase
        .from('lists')
        .select('number')
        let numbers = lists.map((a)=>a.number)
        let last = Math.max(...numbers);

        const { dataLast, errorLast } = await supabase
            .from('lists')
            .update({ next: last+1 })
            .eq('number', last)

        // res.status(200).json(dataLast)
        const { data, error } = await supabase
        .from('lists')
        .insert([
            { name: body.listName, number: last+1, previous: last},
        ])
        res.status(200).json(dataLast, data)
    } 
    

    //FIX THIS SO THAT IT ONLY DELETES THE STUFF WE WANT
    //add an if statement for DELETE requests
    //and clear out all of the records in your database
    else if (req.method === "DELETE"){
    
    const { data, error } = await supabase
    .from('lists')
    .delete().gt('id', 0)

    res.status(200).json(data)
    }
}