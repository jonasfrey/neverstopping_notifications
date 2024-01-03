import {
    f_websersocket_serve, 
    f_v_before_return_response__fileserver,
    f_v_before_return_response__proxy
} from "https://deno.land/x/websersocket@0.2/mod.js"


let s_path_file_current = new URL(import.meta.url).pathname;
let s_path_folder_current = s_path_file_current.split('/').slice(0, -1).join('/'); 
// console.log(s_path_folder_current)
// Deno.exit()
const b_deno_deploy = Deno.env.get("DENO_DEPLOYMENT_ID") !== undefined;

await f_websersocket_serve(
    [
        {
            b_https: (b_deno_deploy) ? false : true,
            n_port: (b_deno_deploy) ? 80 : (4343),
            s_hostname: 'localhost',
            f_v_before_return_response: async function(o_request){

                let o_url = new URL(o_request.url);
                if(o_url.pathname == '/'){
                    return new Response(
                        await Deno.readTextFile(
                            `${s_path_folder_current}/localhost/client.html`
                        ),
                        { 
                            headers: {
                                'Content-type': "text/html"
                            }
                        }
                    );
                }



                return f_v_before_return_response__fileserver(
                    o_request,
                    `${s_path_folder_current}/localhost/`
                )
            }
        },

    ]
)
