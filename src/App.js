import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom"; 
import Home from "./components/Home";
import PublicProfile from "./components/PublicProfile"; 
import Register from "./components/Register";
import Navigation from "./components/Navigation";
import Chat from "./components/Chat";

const App = (props) => {
  return (
    <BrowserRouter>
      <div>
        <Navigation/>
        <Switch>
          <Route path="/" component= {Home} exact/>
          <Route path="/public/card" component={PublicProfile} />
          {/* <Route component={ErrorPage}/> */}
          <Route path="/register" component={Register} />
          <Route path="/chat" component={Chat}/>
        </Switch>  
      </div>
    </BrowserRouter>
  );
}

export default App;
