import React, { Component } from 'react'
import '../css/loginModal.css'
import Modal from 'material-ui/Modal';
import IconButton from 'material-ui/IconButton';
import Logo from '../img/logo.png'
import FacebookIcon from 'react-icons/lib/fa/facebook'
import TwitterIcon from 'react-icons/lib/fa/twitter'
import GoogleIcon from 'react-icons/lib/fa/google'

class LoginModal extends Component {

    constructor(props) {
        super(props)

        this.state = {
            loginOpen: false
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.loginOpen !== this.state.loginOpen){
            this.setState({
                ...this.state,
                loginOpen: nextProps.loginOpen
            });
        }
        
    }

    closeLogin = () => {
        this.setState({
            ...this.state,
            loginOpen: false
        })

        this.props.closeLogin();
    }

    render() {
        return (
            <Modal
            aria-labelledby="Login Modal"
            aria-describedby="Login Modal"
            open={this.state.loginOpen}
            onClose={this.closeLogin}
            className="loginModal"
            >
                <div className="loginContents">
                    <div className="login">
                        <img src={Logo} alt="logo"/>
                        <div>Login</div>
                    </div>
                    <div className="loginHeader">
                        Login with one of the options below for a more personalized experience.
                    </div>
                    <div className="buttons">
                        <IconButton className="loginFacebook" onClick={this.props.handleLogin("facebook")}><FacebookIcon/></IconButton>
                        <IconButton className="loginTwitter" onClick={this.props.handleLogin("twitter")}><TwitterIcon/></IconButton>
                        <IconButton className="loginGoogle" onClick={this.props.handleLogin("google")}><GoogleIcon/></IconButton>
                    </div>
                    <div className="finePrint">
                        We promise to <span>never</span> post anything without your permission!
                    </div>
                </div>
            </Modal>
        )
    }
}

export default LoginModal