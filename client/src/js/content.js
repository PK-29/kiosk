import React, { Component } from 'react'

import '../css/content.css'
import Article from './article.js'
import Progress from './_components/cryptofolio/progress.js'

import Grid from 'material-ui/Grid'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'

import axios from 'axios'
// import { firestore } from './firebase.js'
import {connect} from 'react-redux';

import {
    Link
} from 'react-router-dom'

class Content extends Component {

    constructor(props) {
        super(props)

        this.state = {
            source: "content",
            populating: false,
            page: 1,
            articles: {}
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.source !== this.state.source) {
            this.setState({
                ...this.state,
                source: nextProps.source,
                page: 0,
                articles: null
            }, () => {
                window.scrollTo(0, 0)
                this._populate(this.state.source)
            })
        }
    }

    componentWillMount() {
        window.scrollTo(0, 0)
        this._populate(this.state.source);
    }

    componentDidMount() {
        window.addEventListener("scroll", this.handleScroll);
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.handleScroll);
    }

    handleScroll = () => {
        if(!this.state.populating){
            const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
            const body = document.body;
            const html = document.documentElement;
            const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
            const windowBottom = windowHeight + window.pageYOffset;
            if (windowBottom + docHeight * .4 >= docHeight) {
                this.setState({
                    page: this.state.page + 1
                }, () => {
                    this._populate(this.state.source);
                })
            }
        }
    }

    _populate = source => {
        this.setState({
            ...this.state,
            populating: true
        }, () => {
            // const {articles} = this.state;
            // const collection = firestore.collection("articles")
            // let startAt = null;

            if (source === "content") {
                console.log("POPULATING with", source)
                const url = "/api/content/?page=" + this.state.page
                axios.get(url)
                    .then(response => {
                        this.setState({
                            ...this.state,
                            page: this.state.page + 1,
                            populating: false,
                            articles: {
                                ...this.state.articles,
                                ...response.data
                            }
                        });
                    })
                    .catch(err => {
                        console.log(err)
                    });
                // if (articles) {
                //     const articleKeys = Object.keys(articles);
                //     if (articleKeys.length > 0) {
                //         startAt = articles[articleKeys[articleKeys.length - 1]]['date-a']
                //     }
                // }
                // collection
                //     .limit(20)
                //     .orderBy("date-a")
                //     .startAt(startAt)
                //     .get()
                //     .then(articlesResponse => {
                //         const articlesData = {}
                //         articlesResponse.forEach(doc => {
                //             articlesData[doc.id] = doc.data()
                //         })

                //         this.setState({
                //             ...this.state,
                //             articles: {
                //                 ...this.state.articles,
                //                 ...articlesData
                //             }
                //         });
                //     })
            } else {
                console.log("POPULATING with", source + " (" + this.props.sources[this.state.source].name + ")")
                // const url = "/api/" + source + "/?page=" + this.state.page
                const url = "/api/" + source + "/?page=" + this.state.page
                axios.get(url)
                    .then(response => {
                        this.setState({
                            ...this.state,
                            page: this.state.page + 1,
                            populating: false,
                            articles: {
                                ...this.state.articles,
                                ...response.data
                            }
                        });
                    })
                    .catch(err => {
                        console.log(err)
                    });
                // if (articles) {
                //     const articleKeys = Object.keys(articles);
                //     if (articleKeys.length > 0) {
                //         startAt = articles[articleKeys[articleKeys.length - 1]]['date-a']
                //     }
                // }
                // collection
                //     .where("site", "==", source)
                //     .limit(20)
                //     .orderBy("date-a")
                //     .startAt(startAt)
                //     .get()
                //     .then(articlesResponse => {
                //         const articlesData = {}
                //         articlesResponse.forEach(doc => {
                //             articlesData[doc.id] = doc.data()
                //         })

                //         this.setState({
                //             ...this.state,
                //             articles: {
                //                 ...this.state.articles,
                //                 ...articlesData
                //             }
                //         });
                //     })
            }
        })
    }

    passCoins = coins => {
        this.setState({
            ...this.state,
            coins: coins
        })
    }

    passConvertCurrency = convertCurrency => {
        this.setState({
            ...this.state,
            convertCurrency: convertCurrency
        })
    }

    passCAD = CAD => {
        this.setState({
            ...this.state,
            CAD: CAD
        })
    }

    render() {
        return (
            <div className="content">
                <Grid container spacing={24} className="headline">

                    <Grid item md={12} style={{margin: "auto", padding: "0", width: "100%"}} className="cryptoProgress">
                        <Progress minimal coins={this.state.coins} convertCurrency={this.state.convertCurrency} CAD={this.state.CAD} />
                    </Grid>

                    <Grid item md={6}>
                        <Typography type="headline" component="h2" className="content-title">
                            {this.state.source === "content" ? "Latest News" : this.props.sources[this.state.source].name}
                        </Typography>
                    </Grid>

                    {this.props.user ?
                        <Grid item md={6}>
                            <Link to={'/cryptofolio'}>
                                <Button raised color="secondary" style={{ float: 'right' }}>
                                    Cryptofolio
                                </Button>
                            </Link>
                        </Grid> :
                        <div />
                    }
                </Grid>

                <div className="feed">
                    {this.state.articles && Object.keys(this.state.articles).map((key) => {
                        return (
                            <Article className="newsComp" key={key} id={key} articleData={this.state.articles[key]}/>
                        )
                    })}
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    sources: state.sources,
    user: state.user
});

export default connect(
    mapStateToProps,
)(Content);