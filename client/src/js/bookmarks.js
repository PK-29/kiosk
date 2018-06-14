import React, { Component } from 'react'

import '../css/content.css'
import Article from './article.js'
import Grid from 'material-ui/Grid'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'

import {firestore} from './firebase.js'

import {
    Link
} from 'react-router-dom'

// import {firestore} from './firebase.js'
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    addBookmark,
    setBookmarks,
    setBookmarksLoaded
} from './redux.js';

class Bookmarks extends Component {
    constructor(props) {
        super(props)

        this.state = {

        }
    }

    componentDidMount() {
        if(!this.props.bookmarksLoaded) {
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

    render() {
        return (
            <div className="content">
                <Grid container spacing={24} className="headline">
                    <Grid item md={6}>
                        <Typography type="headline" component="h2" className="content-title">
                            Bookmarks
                        </Typography>
                    </Grid>

                    <Grid item md={6}>
                        <Link to={'/'}>
                            <Button raised color="secondary" style={{ float: 'right' }}>
                                Back
                            </Button>
                        </Link>
                    </Grid>
                </Grid>
                <div className="feed">
                    {   
                        this.props.bookmarksLoaded && Object.keys(this.props.bookmarks)
                        .filter(key => this.props.bookmarks[key])
                        .map((key) => {
                            return (
                                <Article key={key} id={key} articleData={this.props.bookmarks[key]} isBookmark={true}/>
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    user: state.user,
    bookmarkIDs: state.bookmarkIDs,
    bookmarks: state.bookmarks,
    bookmarksLoaded: state.bookmarksLoaded
});

const mapDispatchToProps = dispatch => {
    return {
        addBookmark: bindActionCreators(addBookmark, dispatch),
        setBookmarks: bindActionCreators(setBookmarks, dispatch),
        setBookmarksLoaded: bindActionCreators(setBookmarksLoaded, dispatch)
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Bookmarks);