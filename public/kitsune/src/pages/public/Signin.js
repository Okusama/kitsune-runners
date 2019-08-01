import React, { Component } from  "react";
import {signin} from "../../utils/Api";
import {connect} from "react-redux";
import {runActionUserAdmin, runActionUserLogin} from "../../redux/actions";
import {Redirect} from "react-router-dom";

class Signin extends Component {

    constructor(props){
        super(props);
        this.state = {
            email: "",
            password: "",
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

        let sendData = {
            email: this.state.email,
            password: this.state.password
        };

        /**
         * Send to server
         */
        signin(sendData).then(json => {
            return json.json();
        }).then(res => {
            if (res.isLogin) {
                //TODO: Change localStorage => cookie
                // Redirect with message
                window.localStorage.setItem("token", res.token);
                /**
                 * Set state user login
                 */
                if (res.isAdmin) {
                    this.props.runActionUserAdmin(res.userId, res.avatar);
                } else {
                    this.props.runActionUserLogin(res.userId, res.avatar);
                }

                this.setState({
                    redirect: true
                });

            }
        }).catch(err => {
            console.log(err);
        });

    }

    render(){

        let redirect = this.state.redirect;

        if (redirect) {
            return(<Redirect to="/"/>);
        }

        return (
            <div className="signIn">
                <h1>Sign In</h1>
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
                    <input className="button-form" type="submit"/>
                </form>
            </div>
        );
    }
}

/**
 * Wrap with redux
 */
const NewSigninWithRedux = connect( null,{
        runActionUserLogin,
        runActionUserAdmin
    }
)(Signin);

export default NewSigninWithRedux;