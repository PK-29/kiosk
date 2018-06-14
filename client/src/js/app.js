import React, { Component } from 'react'
import '../css/app.css'

// Components
import Topbar from './topbar.js'
import Content from './content.js'
import Sidebar from './sidebar.js'
import Bookmarks from './bookmarks'
import CryptoFolio from './cryptofolio'

import { base, firestore } from './firebase.js'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    setUser,
    setBookmarkIDs,
    addBookmark,
    setBookmarksLoaded,
    setUserLoading
} from './redux.js';
import {
    Route,
    Switch
} from 'react-router-dom'

import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles'
import Reboot from 'material-ui/Reboot'
import { CircularProgress } from 'material-ui/Progress';

const theme = createMuiTheme({
	palette: {
		primary: { main: "#000000" },
		secondary: { main: "#745fb5" },
	},
});

class App extends Component {
    constructor(props) {
        super(props)

        this.state = {
            source: "content",
            sidebar: true
        }

        this.firebase = base.initializedApp.firebase_;
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.user) {
            // this.props.setUserLoading(false)
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0)
    }

    componentWillMount() {
        this.firebase.auth().onAuthStateChanged( user => {
			if (user) {             
                firestore.collection("users")
                .doc(user.uid)
                .get()
                .then( doc => {
                    if (doc.exists) {
                        var bookmarkIDs = {}
                        Object.keys(doc.data().bookmarks).filter( key => {
                            return doc.data().bookmarks[key]
                        }).map(key => {
                            bookmarkIDs = {
                                ...bookmarkIDs,
                                [key]: true
                            }
                            return true
                        })
                        this.props.setBookmarkIDs(bookmarkIDs)
                        if(!this.props.bookmarksLoaded) {
                            setTimeout(this.loadBookmarks, 2000)
                        }
                    }
                })
                .catch(function(error) {
                    console.log("Error getting document:", error);
                });
                this.props.setUser(user)
                // this.props.setUserLoading(false)
			}
        });
    }

    loadBookmarks = () => {
        if(!this.props.bookmarksLoaded){
            console.log("LOAD BOOKMARKS")
            const articleIDs = this.props.bookmarkIDs
            const collection = firestore.collection("articles")

            Object.keys(articleIDs).forEach(id => {
                collection.where("id", "==", id)
                .get().then(article => {
                    article.forEach(doc => {
                        this.props.addBookmark(doc.id, doc.data())
                    })
                })
            })
            this.props.setBookmarksLoaded(true)
        }
    }
    
    sortBySource = source => event => {
        this.setState({
            ...this.state,
            source: source,
            bookmarksOpen: false
        })
        event.preventDefault()
    }

    toggleSidebar = () => {
        this.setState({
            ...this.state,
            sidebar: !this.state.sidebar
        })
    }

    render() {
        const { sidebar } = this.state;
        return (
            <div className="app">
                <MuiThemeProvider theme={theme}>
                    <Reboot />
                    {
                        this.props.userLoading ? 
                        <div className="loadingDiv">
                            <div className="loading">
                                <CircularProgress color="secondary" className="progress"/>
                            </div>
                        </div> :
                        <div />
                    }
                    <Topbar />
                    {sidebar && <Sidebar sortBySource={this.sortBySource}/>}

                    <Switch>
                        <Route path="/"
                            render={() =>
                                <Content
                                    source={this.state.source}
                                    toggleSidebar={this.toggleSidebar}
                                />
                            }
                            exact={true}
                        />

                        <Route path="/bookmarks" component={Bookmarks} exact={true} />

                        <Route path="/cryptofolio" component={CryptoFolio} exact={true} />
                    </Switch>
                </MuiThemeProvider>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    user: state.user,
    bookmarkIDs: state.bookmarkIDs,
    bookmarksLoaded: state.bookmarksLoaded,
    userLoading: state.userLoading
});

const mapDispatchToProps = dispatch => {
    return {
        setUser: bindActionCreators(setUser, dispatch),
        setBookmarkIDs: bindActionCreators(setBookmarkIDs, dispatch),
        addBookmark: bindActionCreators(addBookmark, dispatch),
        setBookmarksLoaded: bindActionCreators(setBookmarksLoaded, dispatch),
        setUserLoading: bindActionCreators(setUserLoading, dispatch)
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);