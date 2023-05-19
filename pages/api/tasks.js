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
        let { data , error } = await supabase.from('tasks').select('*')
        // send the data back as a result if everyhting goes as expected
        res.status(200).json(data)
    } 
    
    //FIX SO IT POSTS ON THE DB
    else if (req.method === "POST") {
        //retrieve the gradtitude entry from the request body and insert that gratitude as a new row in our supabase db
        //req sent as post has a body
        const body = req.body
        // console.log("RECEIVED: " + JSON.stringify(body))


        const { data, error } = await supabase
        .from('tasks')
        .insert([
            { title: body.title, description: body.description, type: body.type},
        ])
        .select()
        console.log(data)
        res.status(200).json(data)
    } 
    else if (req.method === "PUT") {
        //retrieve the gradtitude entry from the request body and insert that gratitude as a new row in our supabase db
        //req sent as post has a body
        const body = req.body
        // console.log("RECEIVED: " + JSON.stringify(body))


        const { data, error } = await supabase
        .from('tasks')
        .update(
            { type: body.newType },
        )
        .eq('id', parseInt(body.id))
        console.log(data, error)
        res.status(200).json(data)
    } 
    
    //REMOVE THIS // FIX THIS SO THAT IT ONLY DELETES THE STUFF WE WANT
    else if (req.method === "DELETE"){
        console.log("DELETE")
        //const body = req.body
        // let { data: row, errorFetch } = await supabase
        // .from('lists')
        // .select('*')
        // .eq('number', body.rowNum)
        // console.log(row)
        // //update row prior
        // if (row.previous===null){
        //     console.log("null")
        //     //update previous row
        // }
        const taskID = req.query.id;
        const { data, error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', parseInt(taskID))
        console.log('deleting')
        res.status(200).json(data)
    }
    else {

        console.log('missed it')
    }
}