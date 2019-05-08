/*React*/
import React, { Component } from 'react';
/*React Router*/
import {Route, Switch, withRouter} from "react-router-dom";
import {PrivateRoute} from "./components/routing/CustomRoute";
/*Redux*/
import {connect} from "react-redux";
import {runActionUserAdmin, runActionUserLogin} from "./redux/actions";
/*Utils*/
import {authenticated} from "./utils/Api";
/*CSS*/
import "./styles/css/main.css";
/*Pages*/
import Header from "./components/routing/Header";
import HomePage from "./pages/public/HomePage";
import Signup from "./pages/public/Signup";
import Signin from "./pages/public/Signin";
import TournamentList from "./pages/public/TournamentList";
import TournamentDetail from "./pages/public/TournamentDetail";
import ChampionshipList from "./pages/public/ChampionshipList";
import ChampionshipDetail from "./pages/public/ChampionshipDetail";
import AdminTournamentPage from "./pages/admin/AdminTournamentPage";
import AdminChampionshipPage from "./pages/admin/AdminChampionshipPage";
import AdminUserPage from "./pages/admin/AdminUserPage";
import AdminTournamentManagement from "./pages/admin/AdminTournamentManagement";
import AdminRunManagement from "./pages/admin/AdminRunManagement";
import TournamentMatches from "./pages/public/TournamentMatches";
import ProfileUserPage from "./pages/public/ProfileUserPage";
import WheelComponent from "./components/layout/WheelComponent";
import RaceList from "./pages/public/RaceList";
import AdminRacePage from "./pages/admin/AdminRacePage";

class App extends Component {

    constructor(props){
        super(props);
        this.isLogin();
    }

    /**
     * Testing if user are log
     */
    isLogin = () => {

        //TODO: Change localStorage => Cookie
        authenticated({token: window.localStorage.getItem("token")}).then(json => {
              return json.json();
        }).then(res => {
            if (res.isLogin) {
                /*Send user state to reducer*/
                if (res.isAdmin) {
                    this.props.runActionUserAdmin(res.userId, res.avatar);
                } else {
                    this.props.runActionUserLogin(res.userId, res.avatar);
                }
            }
        }).catch(err => {
            //TODO: Gestion erreur
            console.log(err);
        });

    }

    render() {
        /*State Admin User pour le component PrivateRoute*/
        const isAdmin = this.props.user.isAdmin;
        return (
            <div className="App">
                <Header/>
                <main>
                    <Switch>
                        {/*Public Routes*/}
                        <Route exact path="/" component={HomePage}/>
                        <Route path="/signup" component={Signup}/>
                        <Route path="/signin" component={Signin}/>
                        <Route path="/public/user" component={ProfileUserPage}/>
                        <Route exact path="/public/tournament/list" component={TournamentList}/>
                        <Route exact path="/public/tournament/detail" component={TournamentDetail}/>
                        <Route exact path="/public/tournament/matches" component={TournamentMatches}/>
                        <Route exact path="/public/championship/list" component={ChampionshipList}/>
                        <Route exact path="/public/championship/detail" component={ChampionshipDetail}/>
                        <Route exact path="/public/race/list" component={RaceList}/>
                        {/*Admin Routes*/}
                        <PrivateRoute exact path="/admin/tournament" component={AdminTournamentPage} isAdmin={isAdmin}/>
                        <PrivateRoute exact path="/admin/championship" component={AdminChampionshipPage} isAdmin={isAdmin}/>
                        <PrivateRoute exact path="/admin/user" component={AdminUserPage} isAdmin={isAdmin}/>
                        <PrivateRoute exact path="/admin/tournament/management" component={AdminTournamentManagement} isAdmin={isAdmin}/>
                        <PrivateRoute exact path="/admin/run/management" component={AdminRunManagement} isAdmin={isAdmin}/>
                        <PrivateRoute exact path="/admin/race" component={AdminRacePage} isAdmin={isAdmin}/>
                        <PrivateRoute path="/wheel" component={WheelComponent} isAdmin={isAdmin}/>
                    </Switch>
                </main>
            </div>
        );
    }
}

/*Wrap Redux withRouter for Route Component shouldComponentUpdate */
const NewAppWithRedux = withRouter(connect( state => ({
        user: state.user.user
    }),{
        runActionUserAdmin,
        runActionUserLogin
    }
)(App));

export default NewAppWithRedux;
