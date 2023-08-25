var s_path_file_js = `./localhost/client.module.js`
var s_path_file_html = `./localhost/client.html`


var s_html = await Deno.readTextFile(s_path_file_html)
var s_js = await Deno.readTextFile(s_path_file_js)

var s_html_full = s_html.replace(`<script type="module" async defer src="client.module.js"></script>`, 
`<script type='module'>${s_js}</script>`
);
s_html_full = s_html_full.replaceAll(String.fromCharCode(92),String.fromCharCode(92,92));
s_html_full = s_html_full.replaceAll('`', '\\`');
s_html_full = s_html_full.replaceAll('${', '\\${');
var s_js_webserver = `
import { serve } from "https://deno.land/std@0.155.0/http/server.ts";

var s_html = \`${s_html_full}\`

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
`

await Deno.writeTextFile('./deno_deploy_main.js', s_js_webserver)