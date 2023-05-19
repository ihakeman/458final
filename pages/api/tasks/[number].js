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

    const { data, error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', number)
        res.status(200).json(data)
}