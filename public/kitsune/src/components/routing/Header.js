import React, { Component } from  "react";
import {Link, withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {runActionUserLogout} from "../../redux/actions";

/**
 * Render Admin Nav
 * @returns AdminNav Component
 */
const AdminNav = (props) => {

    let path = props.path;

    return(
        <ul>
            <li className={path.includes("/admin/tournament") ? "active-button-header" : "button-header"}><Link to="/admin/tournament">Admin Tournament</Link></li>
            <li className={path.includes("/admin/championship") ? "active-button-header" : "button-header"}><Link to="/admin/championship">Admin Championship</Link></li>
            <li className={path.includes("/admin/user") ? "active-button-header" : "button-header"}><Link to="/admin/user">Admin User</Link></li>
            <li className={path === "/admin/race" ? "active-button-header" : "button-header"}><Link to="/admin/race">Admin Race</Link></li>
            <li className={path === "/wheel" ? "active-button-header" : "button-header"}><Link to="/wheel">Wheel</Link></li>
        </ul>
    );
};

/**
 * Render Public Nav
 * @param props For logout method
 * @returns PublicNav Component
 */
const PublicNav = (props) => {

    let path = props.path;

    return(
        <ul>
            {
                /*Conditional Render for login user or visitor*/
                props.isLogin ? (
                <React.Fragment>
                    <li className={path === "/" ? "active-button-header" : "button-header"}><Link to="/">Home</Link></li>
                    <li className="button-header"><Link to="/" onClick={props.logout}>LogOut</Link></li>
                    <li className={path.includes("/public/user") ? "active-button-header" : "button-header"}><Link to="/public/user">Profile</Link></li>
                    <li className={path.includes("/public/tournament") ? "active-button-header" : "button-header"}><Link to="/public/tournament/list">Tournament</Link></li>
                    <li className={path.includes("/public/championship") ? "active-button-header" : "button-header"}><Link to="/public/championship/list">Championship</Link></li>
                    <li className={path.includes("/public/race") ? "active-button-header" : "button-header"}><Link to="/public/race/list">Race</Link></li>
                </React.Fragment>
            ) : (
                <React.Fragment>
                    <li className={path === "/" ? "active-button-header" : "button-header"}><Link to="/">Home</Link></li>
                    <li className={path === "/signin" ? "active-button-header" : "button-header"}><Link to="/signin">Sign In</Link></li>
                    <li className={path === "/signup" ? "active-button-header" : "button-header"}><Link to="/signup">Sign Up</Link></li>
                </React.Fragment>
            )}
        </ul>
    );
};

class Header extends Component {

    /**
     * Delete User state login
     */
    logout = () => {
        localStorage.setItem("token", "");
        this.props.runActionUserLogout();
    }

    render(){

        const isAdmin = this.props.user.isAdmin;
        const isLogin = this.props.user.isLogin;
        const avatar = this.props.user.avatar;

        /*Insert Admin Nav*/
        let nav = null;
        if(isAdmin){ nav = <AdminNav path={this.props.location.pathname}/>; }

        return (
            <header>
                <nav>
                    <img src={require("../../styles/images/logotext.png")} alt="logo Kitsune Runners"/>
                    <PublicNav path={this.props.location.pathname} logout={this.logout} isLogin={isLogin}/>
                    {nav}
                </nav>
                {
                    avatar === undefined || avatar.length === 0  ? (
                        <img className="nav-avatar" src={require("../../styles/images/default_avatar.png")} alt="Avatar"/>
                    ) : (
                        <img className="nav-avatar" src={avatar} alt="Avatar"/>
                    )
                }
            </header>
        );

    }

}

/**
 * Wrap with Redux
 */
const NewHeaderWithRedux = withRouter(connect( state => ({
        user: state.user.user
    }),{
        runActionUserLogout
    }
)(Header));

export default NewHeaderWithRedux;