
import { serve } from "https://deno.land/std@0.155.0/http/server.ts";

var s_html = await Deno.readTextFile(`./localhost/client.html`)

serve(
    function(req){
        return new Response(
            s_html, 
            {
                status: 200,
                headers: {
                    "content-type": "text/html",
                },
            }
        )
    }
)