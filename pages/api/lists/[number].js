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
    console.log(number)

    let { data: row, errorFetch } = await supabase
        .from('lists')
        .select('*')
        .eq('number', number)
        console.log(row)
        // //update row prior    https://stackoverflow.com/questions/40735406/checking-for-undefined-in-react
        if (typeof(row.next)===undefined || typeof(row.next === null)){
            console.log("undefined or null")
            //update previous row
        }
        else {
            console.log('not null')
        }
    const { data, error } = await supabase
        .from('lists')
        .delete()
        .eq('number', number)
        console.log('deleting')
        res.status(200).json(data)

}