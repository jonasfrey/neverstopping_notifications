import { serve } from "https://deno.land/std@0.152.0/http/server.ts";
import {O_folder_file} from "https://deno.land/x/o_folder_file@0.3/O_folder_file.module.js"
import {f_o_html_from_o_js} from "https://deno.land/x/f_o_html_from_o_js@1.3/mod.js";

async function handleRequest(o_request) {

  const o_url = new URL(o_request.url);


  let s_directory = o_url.hostname;
//   console.log(s_directory);
  let s_name_path__from_url = o_url.pathname

  let s_name_path_default = '/client.html'; // set to false if not wished
  if(s_name_path__from_url == '/' && s_name_path_default){
    s_name_path__from_url = s_name_path_default
  }

  let s_name_path__to_look_for_in_fs = `./${s_directory}${s_name_path__from_url}`;
  let o_folder_file = new O_folder_file(s_name_path__to_look_for_in_fs);
//   console.log(o_folder_file);

  if(!o_folder_file.s_file_name && o_folder_file.s_folder_name){
    let a_o = [];
    for await (const o of Deno.readDir(o_folder_file.s_folder_name)){
        a_o.push(o)
    }
    // let a_o = (await Deno.readDir(o_folder_file.s_folder_name)).map(o=>o.name);
    // console.log(a_o)
    a_o.push()
    return new Response(
        f_o_html_from_o_js(
            {
                style: 'display:flex; flex-direction:column', 
                a_o: [
                    ...a_o.map((o)=>{
                        return {
                            s_tag: "a", 
                            innerText: `${o.name}`, 
                            href: `${s_name_path__from_url}${o.name}${((!o.isFile) ? '/': "")}`
                        }
                    }), 
                    {
                        s_tag: "a", 
                        innerText: `.`, 
                        href: `.`
                    },
                    {
                        s_tag: "a", 
                        innerText: `..`, 
                        href: `..`
                    }
                ]
            }
        ).outerHTML,
        {
            headers: {
                "content-type": 'text/html',
            },
        }
    );
  }
  
  let s_file_content;
//   console.log(o_folder_file._s)
  try {
      s_file_content = await Deno.readFile(o_folder_file._s)
  } catch (error) {
    return new Response('not found')
  }

  let s_mime_type = 'text/plain'
  if(o_folder_file.o_mime_type_guessed_by_file_extension?.s_mime_type){
    s_mime_type = o_folder_file.o_mime_type_guessed_by_file_extension.s_mime_type
    }else{
        s_mime_type = "text/plain"
    }


    return new Response(
        s_file_content,
        {
            headers: {
                "content-type": s_mime_type,
            },
        }
    );


}

serve(handleRequest);