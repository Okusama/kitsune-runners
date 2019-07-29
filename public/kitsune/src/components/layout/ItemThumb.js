import React, {Component} from "react";
import {Link} from "react-router-dom";
import moment from "moment";

export default class ItemThumb extends Component {

    render(){
        return(
            <li className="itemThumb">
                <section>
                    <h3>{this.props.name}</h3>
                    <p>{moment(this.props.startAt).format("DD/MM/YYYY")}</p>
                </section>
                <section>
                    <p>Description: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sed porttitor nunc. Pellentesque dictum mi et mauris euismod porttitor. Vestibulum pulvinar quis tortor a dictum. Cras vel ligula malesuada, lobortis est faucibus, dapibus ex. Nam bibendum urna lorem, ut placerat dui fermentum eget. Nam rutrum a quam ac malesuada. Ut molestie porttitor risus, non scelerisque est porta in. Nam ac eros eget ligula gravida convallis. </p>
                </section>
                <section>
                    <p>Player: {this.props.nbPlayers}</p>
                    {this.props.isAdmin ?
                        <Link to={{pathname: `/admin/${this.props.itemType}/management`, state: {item: this.props.item}}}>Management</Link>
                    :
                        <Link to={{pathname: `/public/${this.props.itemType}/detail`, state: {item: this.props.item}}}>Detail</Link>
                    }

                </section>
            </li>
        );
    }

}