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
    const body = req.body
    const row = body.rowData
    const number = row.number
        // const { data: update, errorUpdate } = null;
        let { data: rows, errorFetch } = await supabase
            .from('lists')
            .select('*')
        let numbers = rows.map((a)=>a.number)
        let last = Math.max(...numbers);
        let first = Math.min(...numbers)
        if(first === last){
            //can't swap
            res.status(200).json()
        }
        else if(number === first){
            //can't swap down 
            res.status(200).json()
        }
        else{
            //swap the number
            //get number for previous one:
            
            let prev = Math.max(...numbers.filter((a) => (a < number)));
            let { data: prevrow, errorFetch } = await supabase
            .from('lists')
            .select('id')
            .eq('number', prev)
            let prevID = prevrow.map((a) => a.id)[0]
            const { update, errorUpdate } = await supabase
                .from('lists')
                .update({ number: prev })
                .eq('id', row.id)
            const { update2, errorUpdate2 } = await supabase
                .from('lists')
                .update({ number: number })
                .eq('id', prevID)
            res.status(200).json(update, update2)
        }
}