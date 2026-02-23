// @ts-nocheck
import { goto } from "$app/navigation";
import { PUBLIC_API } from "$env/static/public";
const API_PATH = PUBLIC_API + "/"

export async function Get(endpoint, header=null){
    let Header = {
        'Content-Type': 'application/json'
    }
    if (header != null){
        for (let key in header){
            Header[key] = header[key]
        }
    }
    
    return await fetch(API_PATH+endpoint, {
        method: 'GET',
        headers: Header
    }).then(response => response.json()).then(data => {return data})
    .catch(reason => {
        throw Error(reason)
    })
}

export async function Delete(endpoint, header=null){
    let Header = {
        'Content-Type': 'application/json'
    }
    if (header != null){
        for (let key in header){
            Header[key] = header[key]
        }
    }
    
    return await fetch(API_PATH+endpoint, {
        method: 'DELETE',
        headers: Header
    }).then(response => response.json()).then(data => {return data})
    .catch(reason => {
        throw Error(reason)
    })
}

export async function Post(endpoint, body=null, header=null, form=false){
    let Header = {}

    if (!form){
        Header['Content-Type'] = 'application/json'
    }

    if (header != null){
        for (let key in header){
            Header[key] = header[key]
        }
    }

    let fetchBody = null

    if (body != null){
        if (form){
            fetchBody = body
        }
        else{
            fetchBody = {}
            for (let key in body) {
                fetchBody[key] = body[key]
            }
            fetchBody = JSON.stringify(fetchBody)
        }
    }
    
    return await fetch(API_PATH+endpoint, {
        method: 'POST',
        headers: Header,
        body: fetchBody
    }).then(response => response.json()).then(data => {return data})
    .catch(reason => {
        throw Error(reason)
    })
}

export async function Put(endpoint, body=null, header=null, form=false){
    let Header = {}

    if (!form){
        Header['Content-Type'] = 'application/json'
    }

    if (header != null){
        for (let key in header){
            Header[key] = header[key]
        }
    }

    let fetchBody = null

    if (body != null){
        if (form){
            fetchBody = body
        }
        else{
            fetchBody = {}
            for (let key in body) {
                fetchBody[key] = body[key]
            }
            fetchBody = JSON.stringify(fetchBody)
        }
    }
    
    return await fetch(API_PATH+endpoint, {
        method: 'PUT',
        headers: Header,
        body: fetchBody
    }).then(response => response.json()).then(data => {return data})
    .catch(reason => {
        throw Error(reason)
    })
}

export function GetSessionToken(){
    return sessionStorage.getItem('sessionToken');
}

export function SetSessionToken(token){
    sessionStorage.setItem('sessionToken', token);
}

export async function ValidateSession(){
    return await Get("valid_session", {"session-token": GetSessionToken()}).then((d) => {
        if (d[1] == 200) {return true}
        goto("/")
    })
}