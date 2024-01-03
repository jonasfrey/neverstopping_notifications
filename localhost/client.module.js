import {f_o_html_from_o_js} from "https://deno.land/x/f_o_html_from_o_js@0.7/mod.js";
import {
    f_add_css,
    f_s_css_prefixed,
    o_variables, 
    f_s_css_from_o_variables

} from "https://deno.land/x/f_add_css@1.1/mod.js"


o_variables.n_rem_font_size_base = 1. // adjust font size, other variables can also be adapted before adding the css to the dom
o_variables.n_rem_padding_interactive_elements = 0.5; // adjust padding for interactive elements 
let s_css = f_s_css_from_o_variables(
    o_variables
)
// console.log(s_css)
f_add_css(
    `
    ${s_css}
    .inputs{
        display: flex;
        flex-direction: column;
        padding: 1rem;
    }
    `

);
f_add_css('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');      

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
    // Trigger `click` event
    anchor.click();
    // Remove element from DOM
    document.body.removeChild(anchor);
    // Release the object URL
    URL.revokeObjectURL(url);

}

// f_download_text_file("lol.txt", 'this is lol')



window.o_state = {
    a_s_task_history: [],
    a_s_task : [
        "dips: 5", 
        "l-sit: 10 breath's", 
        "knee-raises: 10", 
        "diamond-push-ups: 10", 
        "dip-to-lsit: 5", 
        "rows tucked knees: 10", 
        "rows straight legs: 5"
    ],
    n_idx_a_s_task: 0,
    b_next_task_random: true,
    n_min_repeat: 20,
    n_ts_ms_last_notification: new Date().getTime(),
    n_ms_delta_last_task: null,
    b_notification_permission: false,
    n_id_f_recursive : 0, 
};
let f_notify_s_task = function(){
    let s_task = o_state.a_s_task_history.at(-1);
    document.title = s_task
    var o_notification = new Notification(s_task);
}
let f_push_s_task = function(){

    if(!o_state.b_next_task_random){
        o_state.n_idx_a_s_task = (o_state.n_idx_a_s_task+1)%o_state.a_s_task.length
    }
    if(o_state.b_next_task_random){
        o_state.n_idx_a_s_task = parseInt(Math.random()*(o_state.a_s_task.length));
    }
    
    o_state.a_s_task_history.push(o_state.a_s_task[o_state.n_idx_a_s_task]);
}

let f_recursive = function(){
    o_state.n_id_f_recursive = window.requestAnimationFrame(f_recursive)
    o_state.n_ms_delta_last_task = Math.abs(o_state.n_ts_ms_last_notification - new Date().getTime())
    if((o_state.n_ms_delta_last_task) > (o_state.n_min_repeat * 60*1000)){
        o_state.n_ts_ms_last_notification = new Date().getTime();
        f_push_s_task(); 
        f_notify_s_task();
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
f_notify_s_task();

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
                class: `${s_class} pr-1_rem`
            },
            {
                s_tag: "span", 
                innerText: s_innerText
            }
        ]
    }
}
    let f_s_hms__from_n_ms = function(n_ms){
        let n_s = (n_ms / 1000)
        let n_m = n_s / 60
        let n_h = n_m / 60
        let s = `${(parseInt(n_h).toString().padStart(2, '0'))}:${(parseInt(n_m).toString().padStart(2, '0'))}:${((n_s%60).toFixed(3).toString().padStart(5, '0'))}` 
        return s
    }
    o_js__next_task = {
        f_o_js: function(){
            return {
                a_o:[
                    {
                        s_tag: "label", 
                        innerText: `Next Task in ${(f_s_hms__from_n_ms((o_state.n_min_repeat*60*1000)-o_state.n_ms_delta_last_task))} (${o_state.a_s_task_history.at(-1)})  `
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
                                s_tag: 'h1', 
                                innerText: "Neverstopping-Notifications"
                            },
                            {
                                s_tag: "label", 
                                innerText: "Tasks (click to edit)"
                            },
                            {
                                class: "clickable",
                                s_tag: "textarea", 
                                value: o_state.a_s_task.join("\n"),
                                rows: (()=>{
                                    return o_state.a_s_task.length
                                })(),
                                oninput: ()=>{
                                    let o_el = window.event?.target;
                                    // o_js__everything?._f_render()
                                    o_state.a_s_task = o_el.value.split('\n')
                                    let n_lines = o_state.a_s_task.length;
                                    o_el.setAttribute('rows', n_lines)
                                }
                            },
                            Object.assign(
                                {
                                    class: `clickable`,
                                    onclick: ()=>{
                                        o_state.b_next_task_random = !o_state.b_next_task_random
                                        o_js__everything?._f_render()
                                    }
                                },
                                f_o_label_title_with_icon(
                                    'Random', 
                                    `p-r_1_rem fa-regular fa-square${(o_state.b_next_task_random)?'-check': ''}`
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
                                    f_notify_s_task();

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

