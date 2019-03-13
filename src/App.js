import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom"; 
import Home from "./components/Home";
import PublicProfile from "./components/PublicProfile"; 
import ErrorPage from "./components/ErrorPage";
import Register from "./components/Register";
import Test from "./components/Test";
import Navigation from "./components/Navigation";


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
          <Route path="/test" component={Test} />
        </Switch>  
      </div>
    </BrowserRouter>
  );
}

export default App;
