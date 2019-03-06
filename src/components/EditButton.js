import React from "react";
import Button from "react-bootstrap/Button";
import EditModal from "./EditModal"

class EditButton extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            webid: this.props.webid,
            showEditModal: false,
        }
    }

    toggleEditModal(e){
        this.setState({showEditModal: !this.state.showEditModal})
    }
    
    render(){
        return (
            <div>
                <Button onClick={this.toggleEditModal.bind(this)} webid={this.props.id}>Edit</Button>
                <EditModal show={this.state.showEditModal} onHide={this.toggleEditModal.bind(this)} context={this.props.context} currentvalue={this.props.currentvalue}/>
            </div>
        )
    }
}

export default EditButton;