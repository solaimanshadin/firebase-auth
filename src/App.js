import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from 'firebase/app';
import "firebase/auth";
import firebaseConfig from './firebase.config';
firebase.initializeApp(firebaseConfig);

function App() {
  const [user,setUser] = useState({
    isSignedIn : false,
    name : "",
    email: "",
    password: "",
    photoURL: "",
    
  });
  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSignIn = () => {
    console.log("Sign In clicked");
    firebase.auth().signInWithPopup(provider)
    .then(result => {
      const {displayName, photoURL, email} = result.user;
      var token = result.credential.accessToken;  
      setUser({
        isSignedIn: true,
        name:displayName,
        email: email,
        photoURL: photoURL
      })    
    })
    .catch(err => console.log(err))

  }

  const handleSignOut = () => {
    console.log("Signout Clicked");
    firebase.auth().signOut()
    .then(() => {
      setUser({
        isSignedIn:false,
        name : "",
        email: "",
        password: "",
        photoURL: "",
        isValid: false,
        err: "",
        exatingUser : false
      })
    }).catch((error) => console.log(error));
    
  }
  const handleChange = e => {
    e.preventDefault();
    const newUserInfo = {
      ...user
    }
    //Perform Validation
    let isValid;
    const isValidEmail = email => /^([\w-_]+)@([\w-_]{3,10})\.([\w-_]{3,10})$/.test(email);
    const isValidPassword = pass => /^[\w-_]{6,32}$/.test(pass);

    newUserInfo[e.target.name] = e.target.value;
    if(e.target.name == "email"){
      isValid  = isValidEmail(e.target.value);
    }
    if(e.target.name == "password"){
      isValid  = isValidPassword(e.target.value);
    }
    newUserInfo.isValid = isValid;
    setUser(newUserInfo);
    console.log(newUserInfo);


  }
  const createAccount = (e) => {
    e.preventDefault();
    console.log(user.isValid)
    if(user.isValid){
      console.log("You are good to go");
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(res => {
        const createdUser = {...user};
        createdUser.isSignedIn = true;
        createdUser.err = "";
        setUser(createdUser);
      })
      .catch(err=> {
        const createdUser = {...user};
        createdUser.isSignedIn = false;
        createdUser.err = err.message;
        setUser(createdUser);

      })
    }else{
      console.log("Validation error")
    }
    e.target.reset();
  }
  const signInUser = e => {
    e.preventDefault();
    console.log(user.isValid)
    if(user.isValid){
      console.log("You are good to go");
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then(res => {
        const createdUser = {...user};
        createdUser.isSignedIn = true;
        createdUser.err = "";
        setUser(createdUser);
      })
      .catch(err=> {
        const createdUser = {...user};
        createdUser.isSignedIn = false;
        createdUser.err = err.message;
        setUser(createdUser);

      })
    }else{
      console.log("Validation error")
    }
    e.target.reset();
  }
  const switchForm = e => {
    console.log("Switched")
    const createdUser = {...user};
        createdUser.exatingUser = e.target.checked;
        setUser(createdUser);
  }
  return (
    <div className="App">
      <header className="App-header">
        
        
        {
          user.isSignedIn && <div style={{textAlign:"center"}}><img src={user.photoURL} alt=""/><p>Welcome {user.name}</p> <p>Your Email {user.email}</p></div>
        }
        {
           user.isSignedIn  ? <button onClick={handleSignOut}> Sign-Out</button> :  <button onClick={handleSignIn}> Sign-in</button>

        }
      </header>
      <label htmlFor="swithform">Already Have a Account</label>
        <input type="checkbox" name="swithForm" id="swithform" onChange={switchForm} />
      <h1>Our Own Authentication</h1>
      {
       user.err && <p>{user.err}</p>
      }
      <form style={{display:user.exatingUser ? "none" : "block"}} onSubmit={createAccount}>
        <input onBlur={handleChange} type="text" name="name" placeholder="Your Name..." />
        <br/>
        <input onBlur={handleChange} type="email" name="email" placeholder="Your Email..." />
        <br/>
        <input onBlur={handleChange} type="password" name="password" placeholder="Your Password..." />
        <br/>
        <button type="submit">Create Account</button>
      </form>

      <form style={{display:user.exatingUser ? "block" : "none"}} onSubmit={signInUser}>
       
        <input onBlur={handleChange} type="email" name="email" placeholder="Your Email..." />
        <br/>
        <input onBlur={handleChange} type="password" name="password" placeholder="Your Password..." />
        <br/>
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}

export default App;
