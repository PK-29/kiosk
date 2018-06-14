import React, { Component } from 'react'
import '../css/chromeApps.css'
import Button from 'material-ui/Button'

class ChromeApps extends Component {

    constructor(props) {
        super(props)

        this.state = {

        }
    }

    componentDidMount(){
        // const types = [chrome.management.ExtensionType.LEGACY_PACKAGED_APP, chrome.management.ExtensionType.PACKAGED_APP, chrome.management.ExtensionType.HOSTED_APP];
        // chrome.management.getAll(items => {
        //     var apps = items.filter(item => types.includes(item.type));
        //     Object.keys(apps).map(key => {
        //         const chromeApp = apps[key]
        //         this.setState({
        //             ...this.state,
        //             chromeApps: {
        //                 ...this.state.chromeApps,
        //                 [key]: {
        //                     name: chromeApp.name,
        //                     url: chromeApp.appLaunchUrl,
        //                     icons: chromeApp.icons,
        //                     enabled: chromeApp.enabled
        //                 }
        //             }
        //         })
        //     });
        // });
    }

    render() {
        const {chromeApps} = this.state
        return (
            <div className="chromeApps">
                {chromeApps && Object.keys(chromeApps).map((key, index) => {
                    const chromeApp = chromeApps[key]
                    if(chromeApp.enabled === true){
                        return(
                            <Button href={chromeApp.url} className="chromeApp" key={`coin-${index}`}>
                                <img className="appImage" src={chromeApp.icons[chromeApp.icons.length-1].url}  alt="appImage"/>
                                <p className="appName">{chromeApp.name}</p>
                            </Button>
                        )
                    }
                    return true
                })}
            </div>
        )
    }
}

export default ChromeApps