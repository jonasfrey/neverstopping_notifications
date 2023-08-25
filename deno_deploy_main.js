
import { serve } from "https://deno.land/std@0.155.0/http/server.ts";

var s_html = `<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]>      <html class="no-js"> <!--<![endif]-->
<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>test</title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="">

    </head>
    <body>

        <script type='module'>import {f_o_html_from_o_js} from "https://deno.land/x/f_o_html_from_o_js@0.7/mod.js";
import {
    f_add_css,
    f_s_css_prefixed
} from "https://deno.land/x/f_add_css@0.6/mod.js"


let o_js__everything, 
o_js__next_task = null;


let f_download_text_file = function(
    s_name_file, 
    s_content
){

    // Create a Blob object
    const blob = new Blob([s_content], { type: 'plain/text' });
    // Create an object URL
    const url = URL.createObjectURL(blob);
    // Create a new link
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = s_name_file;
    // Append to the DOM
    document.body.appendChild(anchor);
    // Trigger \`click\` event
    anchor.click();
    // Remove element from DOM
    document.body.removeChild(anchor);
    // Release the object URL
    URL.revokeObjectURL(url);

}

// f_download_text_file("lol.txt", 'this is lol')

let f_v_random = function(a_v){
    return a_v[parseInt(Math.random()*a_v.length-1)]
}

window.o_state = {
    a_s_task_history: [],
    a_s_task : [
        "dips: 5", 
        "l-sit: 10 breath's", 
        "knee-raises: 10", 
        "diamond-push-ups: 10", 
        "dip-to-lsit: 5"
    ],
    n_idx_a_s_task: 0,
    b_next_task_random: true,
    n_min_repeat: 20,
    n_ts_ms_last_notification: new Date().getTime(),
    n_ms_delta_last_task: null,
    b_notification_permission: false,
    n_id_f_recursive : 0, 
};
let f_push_s_task = function(){

    if(!o_state.b_next_task_random){
        o_state.n_idx_a_s_task = (o_state.n_idx_a_s_task+1)%o_state.a_s_task.length
    }
    if(o_state.b_next_task_random){
        o_state.n_idx_a_s_task = parseInt(Math.random()*(o_state.a_s_task.length-1));
    }
    
    o_state.a_s_task_history.push(o_state.a_s_task[o_state.n_idx_a_s_task]);
}

let f_recursive = function(){
    o_state.n_id_f_recursive = window.requestAnimationFrame(f_recursive)
    o_state.n_ms_delta_last_task = Math.abs(o_state.n_ts_ms_last_notification - new Date().getTime())
    if((o_state.n_ms_delta_last_task) > (o_state.n_min_repeat * 60*1000)){
        o_state.n_ts_ms_last_notification = new Date().getTime();
        f_push_s_task(); 
        var o_notification = new Notification(o_state.a_s_task_history.at(-1));
        f_push_s_task(); 
    }
    o_js__next_task?._f_render()
}
f_recursive()
let f_ask_permission = function(){
    if (!window.Notification) {
        console.log('Browser does not support notifications.');
    } else {
        // check if permission is already granted
        if (Notification.permission === 'granted') {
            // show notification here
        } else {
            // request permission from user
            Notification.requestPermission().then(function(p) {
               if(p === 'granted') {
                    o_state.b_notification_permission = true
                    o_js__everything?._f_render()

                   // show notification here
               } else {
                    o_state.b_notification_permission = false
                   console.log('User blocked notifications.');
               }
            }).catch(function(err) {
                console.error(err);
            });
        }
    }
}
o_state.b_notification_permission = Notification.permission == 'granted'

o_state.n_ts_ms_last_notification = new Date().getTime()
f_push_s_task(); 
var o_notification = new Notification(o_state.a_s_task_history.at(-1));

f_ask_permission()
Notification.requestPermission().then(function(p) {
    if(p === 'granted') {
         o_state.b_notification_permission = true
        // show notification here
    } else {
         o_state.b_notification_permission = false
        console.log('User blocked notifications.');
    }
 }).catch(function(err) {
     console.error(err);
 });
let f_o_label_title_with_icon = function(s_innerText, s_class){
    return {
        s_tag: "label",
        a_o: [
            {
                s_tag: "i", 
                class: \`\${s_class} pr-2\`
            },
            {
                s_tag: "span", 
                innerText: s_innerText
            }
        ]
    }
}
    o_js__next_task = {
        f_o_js: function(){
            return {
                a_o:[
                    {
                        s_tag: "label", 
                        innerText: \`Next Task (\${o_state.a_s_task_history.at(-1)}) (\${o_state.n_min_repeat - (o_state.n_ms_delta_last_task/1000/60)} mins) \`
                    }
                ]
            }
        }
    }
    o_js__everything = {
        f_o_js: function(){
            return {
                class: "app",
                a_o:[
                    {
                        b_render: !o_state.b_notification_permission,
                        a_o:[
                            {
                                s_tag: "label", 
                                innerText: "Please grant notification permissions and reload page"
                            },
                        ]
                    },
                    {
                        class: "inputs",
                        b_render: o_state.b_notification_permission,
                        a_o:[
                            {
                                s_tag: "label", 
                                innerText: "Tasks"
                            },
                            {
                                class: "clickable",
                                s_tag: "textarea", 
                                value: o_state.a_s_task.join("\\n"),
                                rows: (()=>{
                                    return o_state.a_s_task.length
                                })(),
                                oninput: ()=>{
                                    let o_el = window.event?.target;
                                    // o_js__everything?._f_render()
                                    o_state.a_s_task = o_el.value.split('\\n')
                                    let n_lines = o_state.a_s_task.length;
                                    o_el.setAttribute('rows', n_lines)
                                }
                            },
                            Object.assign(
                                {
                                    class: \`clickable\`,
                                    onclick: ()=>{
                                        o_state.b_next_task_random = !o_state.b_next_task_random
                                        o_js__everything?._f_render()
                                    }
                                },
                                f_o_label_title_with_icon(
                                    ...(()=>{
                                        if(!o_state.b_next_task_random){
                                            return ['Random', 'fa-regular fa-square']
                                        }else{
                                            return ['Random', 'fa-regular fa-square-check']
                                        }
                                    })()
                                )
                            ),
                            {
                                s_tag: "label", 
                                innerText: "Repeat every n minutes", 
                            },
                            {
                                s_tag: "input", 
                                class: 'clickable',
                                type: "number", 
                                min: 0,
                                max: 60,
                                oninput: ()=>{
                                    o_state.n_min_repeat = parseInt(window.event?.target.value);
                                },
                                value: o_state.n_min_repeat 
                            },
                            {
                                class: "clickable",
                                s_tag: "button",
                                innerText: "start",
                                onclick: ()=>{
                                    o_state.n_ts_ms_last_notification = new Date().getTime()
                                    f_push_s_task(); 
                                    var o_notification = new Notification(o_state.a_s_task_history.at(-1));
                                }
                            }, 
                            o_js__next_task
                        ]
                    },
 
        
                ]
            }
        }
    }
    let o = {
        a_o:[
            o_js__everything
        ]
    }

    var o_html = f_o_html_from_o_js(o);
    document.body.className = 'theme_dark'
    document.body.appendChild(o_html)


    f_add_css('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
    class O_hsla{
        constructor(n_h, n_s, n_l, n_a){
            this.n_h = n_h
            this.n_s = n_s
            this.n_l = n_l
            this.n_a = n_a
        }
    }
    let s_theme_light = 'theme_light'
    let s_theme_dark = 'theme_dark'
    let a_s_theme = [
        s_theme_light,
        s_theme_dark
    ]
    let o_themes_props = {
        // foreground
        //      light
        [\`o_hsla__fg\${s_theme_light}\`]:                 new O_hsla(.0, .0, .1, .93), 
        [\`o_hsla__fg_hover\${s_theme_light}\`]:           new O_hsla(.0, .0, .1, .93), 
        [\`o_hsla__fg_active\${s_theme_light}\`]:          new O_hsla(.0, .0, .1, .93), 
        [\`o_hsla__fg_active_hover\${s_theme_light}\`]:    new O_hsla(.0, .0, .1, .93), 
        //      dark
        [\`o_hsla__fg\${s_theme_dark}\`]:                 new O_hsla(.0, .0, .8, .93), 
        [\`o_hsla__fg_hover\${s_theme_dark}\`]:           new O_hsla(.0, .0, .9, .93), 
        [\`o_hsla__fg_active\${s_theme_dark}\`]:          new O_hsla(.0, .0, .9, .93), 
        [\`o_hsla__fg_active_hover\${s_theme_dark}\`]:    new O_hsla(.0, .0, .9, .93), 
        
        [\`o_hsla__bg\${s_theme_light}\`]:                 new O_hsla(.0, .0, .1, .93), 
        [\`o_hsla__bg_hover\${s_theme_light}\`]:           new O_hsla(.0, .0, .1, .93), 
        [\`o_hsla__bg_active\${s_theme_light}\`]:          new O_hsla(.0, .0, .1, .93), 
        [\`o_hsla__bg_active_hover\${s_theme_light}\`]:    new O_hsla(.0, .0, .1, .93), 
        // 
        [\`o_hsla__bg\${s_theme_dark}\`]:                 new O_hsla(.0, .0, .1, .93), 
        [\`o_hsla__bg_hover\${s_theme_dark}\`]:           new O_hsla(.0, .0, .2, .93), 
        [\`o_hsla__bg_active\${s_theme_dark}\`]:          new O_hsla(.0, .0, .2, .93), 
        [\`o_hsla__bg_active_hover\${s_theme_dark}\`]:    new O_hsla(.0, .0, .2, .93), 

    };

    let f_s_hsla = function(o_hsla){
        return \`hsla(\${360*o_hsla?.n_h} \${o_hsla?.n_s*100}% \${o_hsla?.n_l*100}% / \${o_hsla?.n_a})\`
    }
    
    let s_core_css = \`
    \${a_s_theme.map(s_theme =>{
        let o_theme_props = Object.assign(
            {}, 
            ...Object.keys(o_themes_props).filter(s=>s.includes(s_theme)).map(
                s_prop => {
                    let s_prop_without_s_theme = s_prop.replace(s_theme, '');

                    return {
                        [s_prop_without_s_theme]: o_themes_props[s_prop], 
                    }
                }
            )
        )
        return \`
            .\${s_theme} *{
                background: \${f_s_hsla(o_theme_props.o_hsla__bg)};
                color: \${f_s_hsla(o_theme_props.o_hsla__fg)};
            }
            .\${s_theme} .clickable{
                padding:1rem;
                border-radius:3px;
            }
            .\${s_theme} .clickable:hover{
                background: \${f_s_hsla(o_theme_props.o_hsla__bg_hover)};
                color: \${f_s_hsla(o_theme_props.o_hsla__fg_hover)};
                cursor:pointer;
            }
            .\${s_theme} .clickable.clicked{
                background: \${f_s_hsla(o_theme_props.o_hsla__bg_active)};
                color: \${f_s_hsla(o_theme_props.o_hsla__fg_active)};
                cursor:pointer;
            }
            .\${s_theme} .clickable.clicked:hover{
                background: \${f_s_hsla(o_theme_props.o_hsla__bg_active_hover)};
                color: \${f_s_hsla(o_theme_props.o_hsla__fg_active_hover)};
                cursor:pointer;
            }
        \`
    }).join("\\n")}
    .position_relative{
        position:relative
    }
    .o_js_s_name_month_n_year{
        position:absolute;
        top:100%;
        left:0;
        width:100%;
    }
    input, button{
        border:none;
        outline:none;
        flex: 1 1 auto;
    }
    .input{
        display:flex;
    }

    .d_flex{
        display: flex;
        flex-wrap: wrap;
    }

    .w_1_t_7{
        align-items: center;
        display: flex;
        justify-content: center;
        flex: 1 1 calc(100%/7);
    }

    .w_1_t_3{
        align-items: center;
        display: flex;
        justify-content: center;
        flex:1 1 calc(100%/3);
    }
    *{
        font-size: 1.2rem;
        color: rgb(25 25 25 / 50%);
        background:white;
        padding: 0;
        margin:0;
    }
    .border_shadow_popup{
        box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
    }
    .theme_dark .border_shadow_popup{
        box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
    }
    *{
        font-family:helvetica;
    }
    \${(new Array(20).fill(0)).map(
        function(n, n_idx){
            let num = (n_idx /10)
            let s_n = num.toString().split('.').join('_');
            return \`
                .p-\${s_n}_rem{padding: \${num}rem}
                .pl-\${s_n}_rem{padding-left: \${num}rem}
                .pr-\${s_n}_rem{padding-right: \${num}rem}
                .pt-\${s_n}_rem{padding-top: \${num}rem}
                .pb-\${s_n}_rem{padding-bottom: \${num}rem}
            \`
        }
    ).join("\\n")} \`;
    console.log(s_core_css)
    let s_css = \`
            \${s_core_css}
            .app, .inputs{
                display:flex;
                flex-direction: column;
                height: 100vh;
                overflow:hidden;
            }
    \`;
    // let s_css_prefixed = f_s_css_prefixed(
    //     s_css,
    //     \`.\${s_version_class}\`
    // );
    f_add_css(s_css)



</script>

    </body>
</html>`

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
