import Navigation from './components/Navigation/Navigation';
import './App.css';
import React, { Component } from 'react';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import ParticlesBg from 'particles-bg'
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';

const ClarifaiRequest=(imageUrl)=>
  {
    const PAT = 'fca7253ddae742c4beadaece5c490a2a';
    const USER_ID = 'a82v8e0vaq6s';       
    const APP_ID = 'test';
    // Change these to whatever model and image URL you want to use
    // const MODEL_ID = 'face-detection';
    const IMAGE_URL = imageUrl;
    const  raw = JSON.stringify({
      "user_app_id": {
          "user_id": USER_ID,
          "app_id": APP_ID
      },
      "inputs": [
          {
              "data": {
                  "image": {
                      "url": IMAGE_URL
                  }
              }
          }
      ]
  });
    return {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Authorization': 'Key ' + PAT
      },
      body: raw
};
  };
  // function getBoundingBox(region) {
  //   const bounding_box = region.region_info.bounding_box;
  //   const top_row = bounding_box.top_row;
  //   const left_col = bounding_box.left_col;
  //   const bottom_row = bounding_box.bottom_row;
  //   const right_col = bounding_box.right_col;
  //   return {
  //     top_row,
  //     left_col,
  //     bottom_row,
  //     right_col
  //   };
  // }

  const initialState = {
    input:'',
      imageUrl:'',
      box:{},
      route:'signin',
      isSignedIn: false,
      user:
      {
        email:'',
        id:'',
        name:'',
        password:'',
        entries:0,
        joined:new Date()
  }}

class App extends Component {
  constructor() {
    super();
    this.state = {
      input:'',
      imageUrl:'',
      box:{},
      route:'signin',
      isSignedIn: false,
      user:
      {
        email:'',
        id:'',
        name:'',
        password:'',
        entries:0,
        joined:new Date()
      }
    };
  }

  loadUser=(data) =>{
    this.setState({user:
      {
        id:data.id,
        name:data.name,
        email:data.email,
        entries:data.entries,
        joined:data.joined
      }})
  }

  calculateFaceLocation=(data)=>
  {
      const clarifaiFace=data[0][0].region_info.bounding_box;
      const image=document.getElementById('inputimage');
      const width=Number(image.width);
      const height=Number(image.width);
      return{
        leftCol :clarifaiFace.left_col* width,
        topRow: clarifaiFace.top_row*height,
        rightCol: width-(clarifaiFace.right_col*width),
        bottomRow:height-(clarifaiFace.bottom_row*height),
      }
  }

displayFaceBox=(box)=>
{
  this.setState({box:box});
  // console.log(box);
}

  onInputChange=(event)=>
  {
    this.setState({input:event.target.value})
  }
  
  onButtonSubmit=async ()=>
  {
    this.setState({imageUrl:this.state.input})
    // eslint-disable-next-line no-useless-concat
    fetch("https://api.clarifai.com/v2/models/face-detection"+"/outputs", ClarifaiRequest(this.state.input))
    .then(response => response.json())
    .then(result => {
      const outputs = result.outputs;
      const regions = outputs.map(output => output.data.regions);
      return regions;
    })
    .then(regions => {
      this.displayFaceBox(this.calculateFaceLocation(regions))
    }).catch(error => console.log('error', error));
    

    fetch("https://api.clarifai.com/v2/models/face-detection/outputs", ClarifaiRequest(this.state.input))
    .then(response =>
      {
        if (response.status === 200) {
          fetch('https://smartbrainbackend-4wkp.onrender.com/image',
          {
            method:'put',
              headers:{'Content-Type':'application/json'},
              body:JSON.stringify(
                  {
                      id:this.state.user.id,
                  }
              )
          }).then(response => response.json())
          .then(count=>
            this.setState({
              user: Object.assign(this.state.user, { entries: count })
            })).catch(console.log)
        }})
      }

  onRouteChange=(route)=>
  {
    if(route==='signout')
    {
      this.setState(initialState)
    }
    else if(route==='home')
    {
      this.setState({isSignedIn:true})
    }
    this.setState({route:route})
  }
render() {
  const {isSignedIn,imageUrl,route,box}=this.state;
    return (
      <div>
        <div className="App">
    <ParticlesBg type="cobweb" bg={true} />
    <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
    {
      route==='home'?
      <div><Logo />
    <Rank name={this.state.user.name} entries={this.state.user.entries} />
    <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
    <FaceRecognition box={box} imageUrl={imageUrl}/>
    </div>:(
      route==='signin'?
      <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>:
      <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
    )
    
  }
    </div>
    </div>
    );
  };
}


export default App;
