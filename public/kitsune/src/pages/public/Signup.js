import React, { Component } from  "react";
import { signup } from "../../utils/Api";
import {Redirect} from "react-router-dom";

export default class Signup extends Component {

    constructor(props){
        super(props);
        this.state = {
            email: "",
            password: "",
            cpassword: "",
            pseudo: "",
            redirect: false
        };
    }

    handleChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleSubmit = (event) => {

        event.preventDefault();

        if(this.state.email.length === 0) return;
        if(this.state.password.length === 0) return;
        if(this.state.pseudo.length === 0) return;
        if(this.state.password !== this.state.cpassword) return;

        let sendData = {
            email: this.state.email,
            password: this.state.password,
            pseudo: this.state.pseudo
        };

        /**
         * Send to server
         */
        //TODO: Redirect with message
        signup(sendData).then(res => {
           return res.json();
        }).then(res => {
            this.setState({
                redirect: true
            });
            console.log(res);
        }).catch(err => {
            console.log(err);
        });
    }

    render(){

        let redirect = this.state.redirect;

        if (redirect) {
            return(<Redirect to="/"/>);
        }

        return(
            <div className="signUp">
                <h2>Sign Up</h2>
                <form onSubmit={this.handleSubmit}>
                    <div>
                        <label htmlFor="email">
                            Email:
                        </label>
                        <input id="email" name="email" value={this.state.email} onChange={this.handleChange} type="email"/>
                    </div>
                    <div>
                        <label htmlFor="password">
                            Password:
                        </label>
                        <input id="password" name="password" value={this.state.password} onChange={this.handleChange} type="password"/>
                    </div>
                    <div>
                        <label htmlFor="cpassword">
                            Confirm Password:
                        </label>
                        <input id="cpassword" name="cpassword" value={this.state.cpassword} onChange={this.handleChange} type="password"/>
                    </div>
                    <div>
                        <label htmlFor="pseudo">
                            Pseudo:
                        </label>
                        <input id="pseudo" name="pseudo" value={this.state.pseudo} onChange={this.handleChange} type="text"/>
                    </div>
                    <input className="button-form" type="submit"/>
                </form>
            </div>
        );
    }
}