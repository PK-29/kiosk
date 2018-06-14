import React, { Component } from 'react'
import '../css/sidebar.css'
import Source from './source.js'
import Button from 'material-ui/Button'
import All from '../img/all.png'

import {firestore} from './firebase.js'
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    addSource
} from './redux.js';

class Sidebar extends Component {

    constructor(props) {
        super(props)

        this.state = {
            defaultSource: {
                name: "Latest News",
                logo: All
            },
            sources: {

            },
            sourcesLoading: true
        }
    }

    componentDidMount() {
        firestore.collection("sources")
        .get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                this.props.addSource(doc.id, doc.data())
            });
            this.setState({
                ...this.state,
                sourcesLoading: false
            })
        })
        .catch(err => {
            console.log('Error getting sources', err);
        });
    }

    render() {
        return (
            <div className={"sidebar" + (this.state.sourcesLoading ? " sourcesLoading" : "")}>
                <div>
                    <Button onClick={this.props.sortBySource("content")} className="source">
                        <img className="sourceLogo" src={this.state.defaultSource.logo} alt={this.state.defaultSource.name}/>
                        <div className="sourceName">{this.state.defaultSource.name}</div>
                    </Button>
                    {this.props.sources && Object.keys(this.props.sources).map((key) => {
                        return (
                            <Source className="sourceComp" key={key} sortBySource={this.props.sortBySource} id={key} sourceData={this.props.sources[key]}/>
                        )
                    })}
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    sources: state.sources
});

const mapDispatchToProps = dispatch => {
    return {
        addSource: bindActionCreators(addSource, dispatch)
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Sidebar);