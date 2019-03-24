import React from "react";
import { Button, List, ListItem } from "yoda-design-system";

class Inbox extends React.Component {
  render() {
    return (
      <div>
        <h1>Overview</h1>
        <h2>Requests</h2>
        <List className="inbox">
          <ListItem className="inbox-request">
            <List>
              <ListItem className="inbox-request-requestor">Kjell</ListItem>
              <ListItem className="inbox-request-permission">
                Permission to view address
              </ListItem>
              <ListItem>
                <Button>Accept</Button>
                <Button variant="outlined">Deny</Button>
              </ListItem>
            </List>
          </ListItem>
          <ListItem>
            <List>
              <ListItem>Malte</ListItem>
              <ListItem>Permission to view birthdate</ListItem>
              <ListItem>
                <Button>Accept</Button>
                <Button variant="outlined">Deny</Button>
              </ListItem>
            </List>
          </ListItem>
        </List>
      </div>
    );
  }
}

export default Inbox;
