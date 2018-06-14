import React, { Component } from 'react'

import '../css/content.css'
import Crypto from './_components/cryptofolio/crypto'

import Grid from 'material-ui/Grid'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'

import {
    Link
} from 'react-router-dom'

export default class CryptoFolio extends Component {
    constructor(props) {
        super(props)

        this.state = {
            convertCurrency: 'USD'
        };
    }

    render() {
        return (
            <div className="content">
                <Grid container spacing={24} className="headline">
                    <Grid item md={6}>
                        <Typography type="headline" component="h2" className="content-title">
                            Cryptofolio
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
                <Crypto convertCurrency={this.state.convertCurrency} />
            </div>
        )
    }
}