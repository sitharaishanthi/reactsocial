import React, { useState } from 'react'
import FacebookLogin from 'react-facebook-login';
import Axios from 'axios';
import {resolve} from 'path';
import {reject} from 'q';

export default function Facebook(props){

    const[isLoggedIn,setIsLoggedIn] = useState(false)
    const[name,setName]= useState(null)
    const[email,setEmail]=useState(null)
    const[picture,setPicture]=useState(null)
    const[coverphoto,setCoverphoto]=useState(null)
    const[accessToken,setAccessToken]=useState(null)

    let facebookContent;

    function componentClicked (){
     
    }
    function facebookResponse(response){
        facebookLogin(response);
    }
    async function facebookLogin(response){
        await setData(response);
        await getPhotoAlbumData();
    }
    function setData(response){
        return new Promise((resolve,reject)=>{
            setIsLoggedIn(true);
            setName(response.name);
            console.log(response)
            setEmail(response.email);
            setPicture(response.picture.data.url);
            setAccessToken(response.accessToken)
            localStorage.setItem('token',response.accessToken);
            resolve(response)
        })
 
    }

    function getPhotoAlbumData(){
        return new Promise((resolve,reject)=>{
            console.log(localStorage.getItem('token'))
            Axios.get('https://graph.facebook.com/v4.0/me?fields=albums.limit(5){name,count,cover_photo{picture},photos.limit(10){picture,images}}',{headers:{'Authorization':'Bearer ' + localStorage.getItem('token')}}).then((response)=>{
                console.log(response);
               /* response.data.data.map((item,i)=>{
                    console.log(item.created_time)
                })*/
                resolve(response)
            }).catch((error)=>{
                console.log(error);
                reject(error);
            })
        })
    }

   
       

        if(isLoggedIn){
            facebookContent=(
             <div background="#ADD8E6">
                <div style={{
                    align:'middle',
                    width:'400px',
                    height:'200px',
                    top:'50%',
                    left:'50%',
                    margin:'-100px 0 0 -150px',
                    position:'absolute',
                    color:'#ffffff',
                    background:'#00008b',
                    padding:'20px'
                }}>

                    <img align='middle' src={picture} alt={name}/>
                    <h2>Welcome {name}</h2>
                    Email : {email}
               

                </div>
            </div>

            )
        }
        else{
            facebookContent= <FacebookLogin appId="505939409952180" autoLoad={false} fields="name,email,picture" scope="user_photos" onClick={componentClicked} callback={facebookResponse}/>
        }
    
    

        return(
            <div>
                {facebookContent}
            </div>
        )
          
}