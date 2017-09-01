import React from 'react'
import jQuery from 'jquery'

export default class App extends React.Component {
    constructor () {
        super()

        this.state = {
            name: '',
            validName:'',
            messages: [],
            msg: '',
            errorMsg: ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleJoin = this.handleJoin.bind(this);
        this.handleJoinSubmit = this.handleJoinSubmit.bind(this);
        this.handleLogout = this.handleLogout.bind(this);

    }
    componentWillMount () {
        //new user joined
        this.props.socket.on('newUser', msg => {
            console.log(msg);
        })
        // chat message from another user
        this.props.socket.on('newMessage', msg => {
            console.log('Received message: ', msg)
            this.setState({ messages: this.state.messages.concat([{ type: 'received', message: msg.text, from: msg.from }]) })
            var div1=jQuery('<div class="username"></div>');
            div1.text(msg.from);
            var div2 = jQuery('<div class="user-message"></div>');
            div2.text(msg.text);
            jQuery('.message').append(div1).append(div2);
            jQuery('.chat-scroll').animate({
                 scrollTop: jQuery('.chat-scroll').get(0).scrollHeight}, 2000);
            
        })

        //update user list with new users
        this.props.socket.on('updateUserList', users => {
            jQuery('.login-list').empty();
            users.forEach(function(user){
                var div=jQuery('<div></div>');
                div.text(user.name);
                jQuery('.login-list').append(div);
            })
        })
        if(localStorage && localStorage.getItem("username")){
            this.setState({validName: localStorage.getItem("username")});
            console.log(localStorage.getItem("username"))
            this.props.socket.emit('join',{
                name:localStorage.getItem("username")
            },function(err){
                if (err) {
                    // console.log(self);
                    if(!localStorage.getItem("username")){
                        self.setState({errorMsg:err,name:'',validName:''});
                        jQuery('.login-error').css('visibility','visible');
                    }
                    
                    // alert(err);
                }
            });
        }
    }

    handleChange(event) {
        this.setState({msg: event.target.value});
    }
    handleJoin(event) {
        this.setState({name: event.target.value});
        jQuery('.login-error').css('visibility','hidden');
    }
    handleSubmit(event) {
        if (this.state.msg.length === 0) {
            event.preventDefault();
            return false; 
        }
        this.setState({ messages: this.state.messages.concat([{ type: 'sent', message: this.state.msg, from: this.state.name }]) });
        this.props.socket.emit('createMessage',{
            from:this.state.name,
            text:this.state.msg
        },function(){
            // console.log('new message')
        });
        this.setState({msg:''});
        event.preventDefault();
    }
    handleLogout(event){
        this.setState({name:'',validName:''});
        localStorage.removeItem('username');
    }
    
    handleJoinSubmit(event) {
        if (this.state.name.length === 0) {
            event.preventDefault();
            return false; 
        }
        var self = this;
        
        this.setState({msg:''});
        
        this.props.socket.emit('join',{
            name:this.state.name
        },function(err){
            if (err) {
                // console.log(self);
                if(!this.state.validName){
                    self.setState({errorMsg:err,name:'',validName:''});
                    jQuery('.login-error').css('visibility','visible');
                }
                
                // alert(err);
            }
        });
        if(this.state.name){
            this.setState({validName:this.state.name});
            localStorage.setItem("username", this.state.name);
            console.log(localStorage.getItem("username"));
        }
        else{
            this.setState({validName:''});
        }
        this.setState({ messages: this.state.messages.concat([{ type: 'join', message: this.state.msg, from: this.state.name }]) });
        event.preventDefault();
    }

    render () {
        console.log(this.state.validName);
        // console.log('render');
        let sectionToShow;
        if (this.state.messages.length === 0 && !this.state.validName) {
            sectionToShow = (
                <div className="login">
                    <div className="welcome-to">WELCOME TO</div>
                    <div className="my-simple-chat">MY SIMPLE CHAT</div>
                    <div className="login-form">
                    <form onSubmit={this.handleJoinSubmit}>
                        <label>
                            <input className="input-name" type="text" placeholder="Type your name" name="name"  value={this.state.name} onChange={this.handleJoin} autoComplete="off"/>
                        </label>
                        <div>
                            <input className="input-submit" type="submit" value="SUBMIT" />
                        </div>
                        <div className="login-error">{this.state.errorMsg}</div>
                    </form> 
                </div>
                </div>
            )
        } else {
            sectionToShow = (
                <div className="chat-form">
                <div className="who-joined-chat">WHO JOINED CHAT
                    <div className="login-list"></div>
                </div>
                <div className="message chat-scroll"></div>
                <div className="window-background">
                <form onSubmit={this.handleSubmit}>
                    <label>
                        <input className="input-message" type="text" placeholder="Write Message" name="name"  value={this.state.msg} onChange={this.handleChange} autoComplete="off"/>
                    </label>
                    <input className="input-send" type="submit" value="SEND" />
                </form> 
                </div>
                <form onSubmit={this.handleLogout}>
                        <input className="input-logout" type="submit" value="LOG OUT" />
                </form> 
                </div> 
            )
        }
        return (
            <div className="container">
                {sectionToShow}
            </div>
        )
    }
}