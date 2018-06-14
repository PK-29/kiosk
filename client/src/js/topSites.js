import React, { Component } from 'react'
import '../css/topSites.css'
import Tooltip from 'material-ui/Tooltip';
import Button from 'material-ui/Button';

class TopSites extends Component {

    constructor(props) {
        super(props)

        this.state = {

        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.sites !== this.state.sites){
            this.setState({
                ...this.state,
                sites: nextProps.sites
            });
        }
    }

    render() {
        return (
            <div className="topSites">
                { this.state.sites && this.state.sites.map((site) => {
                        const src = "https://s2.googleusercontent.com/s2/favicons?domain=" + site.url
                        // const src = "https://logo.clearbit.com/" + site.url
                        return (
                            <Tooltip id="tooltip-icon" className="spacing" title={this.props.cleanURL(site.url)}>
                                <Button href={site.url} className="topSite">
                                    <img src={src} alt=""/>
                                </Button>
                            </Tooltip>
                        )
                    })
                }
            </div>
        )
    }
}

export default TopSites