import React, {Component} from "react";
import {registerTwitchLoginAndAvatar} from "../../utils/Api";
import {connect} from "react-redux";

class ProfileUserPage extends Component {

    constructor(props){
        super(props);
        this.state = {
            twitch: ""
        }
    }

    handleChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    onConnectTwitch = () => {

        let url = "https://api.twitch.tv/helix/users?login=" + this.state.twitch;
        const headers = {"Client-ID": "kkjuuos4kka4e805wygsw77csu18bz"};

        fetch(url, {headers: headers}).then(res => {
            return res.json();
        }).then(data => {

            let twitchProfile = data.data[0];

            let sendData = {
                token: this.props.user.token,
                user_id: this.props.user.id,
                profile_image_url: twitchProfile.profile_image_url,
                twitch_login: twitchProfile.login
            };

            registerTwitchLoginAndAvatar(sendData).then(res => {
                return res.json();
            }).then(data => {
                console.log(data);
            })

        })

    }

    render(){
        return(
            <div>
                <div>
                    {
                        this.props.user.avatar === undefined || this.props.user.avatar.length === 0 ? (
                            <img src={require("../../styles/images/default_avatar.png")} alt="Avatar"/>
                        ) : (
                            <img src={this.props.user.avatar} alt="Avatar"/>
                        )
                    }
                </div>
                <div>
                    <input type="text" name="twitch" value={this.state.twitch} onChange={this.handleChange}/>
                    <button onClick={this.onConnectTwitch}>Connect Twitch</button>
                </div>
            </div>
        );
    }

}

const NewProfileUserPageWithRedux = connect(state => ({
        user: state.user.user
    }),null
)(ProfileUserPage);

export default NewProfileUserPageWithRedux;