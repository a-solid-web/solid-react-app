import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./components/stateful_components/Home";
import PublicProfile from "./components/stateful_components/PublicProfile";
import Register from "./components/stateful_components/Register";
import Navigation from "./components/functional_components/Navigation";
import Chat from "./components/stateful_components/Chat";
import Inbox from "./components/stateful_components/Inbox";

const App = props => {
  return (
    <BrowserRouter>
      <div>
        <Navigation />
        <Switch>
          <Route path="/" component={Home} exact />
          <Route path="/public/card" component={PublicProfile} />
          {/* <Route component={ErrorPage}/> */}
          <Route path="/register" component={Register} />
          <Route path="/chat" component={Chat} />
          <Route path="/inbox" component={Inbox} />
        </Switch>
      </div>
    </BrowserRouter>
  );
};

export default App;
