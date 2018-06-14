var express = require('express');
var router = express.Router();
var serviceAccount = require("../path/kiosk-f1a66-firebase-adminsdk-434m3-8468b3596a.json");
var cron = require('node-cron');
var tools = require('./functions.js');
var admin = require("firebase-admin");
var request = require('request');
var cheerio = require('cheerio');
var og = require('open-graph');
var jwt = require("jwt-simple");
var users = require("./users.js");
var cfg = require("./config.js");
var auth = require("./auth")();

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: "https://kiosk-f1a66.firebaseio.com"
// });

Array.prototype.contains = function (obj) {
    var i = this.length;
    while (i--) {
        if (this[i] == obj) {
            return true;
        }
    }
    return false;
}

function shuffle(originalArray) {
    var array = [].concat(originalArray);
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}
var db = admin.firestore();

function update() {
    tools.bitcoinist()
    tools.bitmag()
    tools.theblockchain()
    tools.coinmeme()
    tools.blockonomi()
    tools.bitcoin()
    tools.coindesk()
    tools.suppo()
}

//tools.coinmeme()
//tools.coindesk()
// router.get("/api/1DIxE06gUQFTNskLX7Nd", function (req, res, next) {
//     var vd = {}
//     var currentPage = 1
//     if (typeof req.query.page !== 'undefined') {
//         currentPage = +req.query.page;
//     }
//     var queryRef = db.collection('articles')
//         .limit(10)
//         .offset(currentPage * 10)
//         .where('site', '==', '1DIxE06gUQFTNskLX7Nd')
//         .get()

//         .then((snapshot) => {
//             snapshot.forEach((doc) => {
//                 vd[doc.id] = doc.data()
//             });
//             res.status(200).json(vd)
//         }).catch((err) => {
//             console.log('Error getting documents', err);
//         });

// })

// // //bitcoinist
// router.get("/api/UZUksRVofjXewHCGH46B", function (req, res, next) {
//     var vd = {}
//     var currentPage = 1
//     if (typeof req.query.page !== 'undefined') {
//         currentPage = +req.query.page;
//     }
//     var queryRef = db.collection('articles')
//         .limit(10)
//         .offset(currentPage * 10)
//         .where('site', '==', 'UZUksRVofjXewHCGH46B')
//         .get()
//         .then((snapshot) => {
//             snapshot.forEach((doc) => {
//                 vd[doc.id] = doc.data()
//             });
//             res.status(200).json(vd)
//         }).catch((err) => {
//             console.log('Error getting documents', err);
//         });

// })

// // //Bitcoinmagazine
// router.get("/api/YFHfBR51cP9pPcomXRec", function (req, res, next) {
//     var vd = {}
//     var currentPage = 1
//     if (typeof req.query.page !== 'undefined') {
//         currentPage = +req.query.page;
//     }
//     var queryRef = db.collection('articles')
//         .limit(10)
//         .offset(currentPage * 10)
//         .where('site', '==', 'YFHfBR51cP9pPcomXRec')
//         .get()

//         .then((snapshot) => {
//             snapshot.forEach((doc) => {
//                 vd[doc.id] = doc.data()
//             });
//             res.status(200).json(vd)
//         }).catch((err) => {
//             console.log('Error getting documents', err);
//         });

// })

// //BitcoinNews
// router.get("/api/Vd1wHH0eo9YPQYp0LUg2", function (req, res, next) {
//     var vd = {}
//     var currentPage = 
//     if (typeof req.query.page !== 'undefined') {
//         currentPage = +req.query.page;
//     }
//     var queryRef = db.collection('articles')
//         // .limit(10)
//         // .offset(currentPage * 10)
//         .where('site', '==', 'Vd1wHH0eo9YPQYp0LUg2')
//         .get()

//         .then((snapshot) => {
//             snapshot.forEach((doc) => {
//                 vd[doc.id] = doc.data()
//             });
//             res.status(200).json(vd)
//         }).catch((err) => {
//             console.log('Error getting documents', err);
//         });

// })

// //The blockchain
// router.get("/api/IEuOxRvA5umqJpxVBUDE", function (req, res, next) {
//     var vd = {}
//     var currentPage = 1
//     if (typeof req.query.page !== 'undefined') {
//         currentPage = +req.query.page;
//     }
//     var queryRef = db.collection('articles')
//         // .limit(10)
//         // .offset(currentPage * 10)
//         .where('site', '==', 'IEuOxRvA5umqJpxVBUDE')
//         .get()

//         .then((snapshot) => {
//             snapshot.forEach((doc) => {
//                 vd[doc.id] = doc.data()
//             });
//             res.status(200).json(vd)
//         }).catch((err) => {
//             console.log('Error getting documents', err);
//         });

// })

// //Blockonomi 
// router.get("/api/Zt6pBLjPpUXDaA4j4IlJ", function (req, res, next) {
//     var vd = {}
//     var currentPage = 1
//     if (typeof req.query.page !== 'undefined') {
//         currentPage = +req.query.page;
//     }
//     var queryRef = db.collection('articles')
//         // .limit(10)
//         // .offset(currentPage * 10)
//         .where('site', '==', 'Zt6pBLjPpUXDaA4j4IlJ')
//         .get()

//         .then((snapshot) => {
//             snapshot.forEach((doc) => {
//                 vd[doc.id] = doc.data()
//             });
//             res.status(200).json(vd)
//         }).catch((err) => {
//             console.log('Error getting documents', err);
//         });

// })



//cron.schedule('* * */2 * * *', function () {
//console.log('running a task every two hour');

//tools.bitcoinist()
tools.bitmag()
router.get('/api/content', function (req, res, next) {
    d = {};
    fd = {};
    var currentPage = 1

    if (typeof req.query.page !== 'undefined') {
        currentPage = +req.query.page;
    }

    sources = ["bitcoinist", "bitcoin", "bitmag", "theblockchain", "coindesk", "blockonomi", "coinmeme"]
    db.getCollections().then(collections => {

        db
            .collection("articles")
            .limit(20)
            .offset(currentPage * 20)
            .get()

            .then((snapshot) => {
                snapshot.forEach((doc) => {
                    var i = {}
                    d[doc.id] = doc.data()
                });

                // var k = Object.keys(d)

                // var sk = shuffle(k)
        
                // for (var i = 0; i < sk.length; i++) {
                //     fd[sk[i]] = d[sk[i]]
                // }
                res.status(200).json(d);
            })
            .catch((err) => {
                console.log('Error getting documents', err);
            });
    })
});
//});
router.get("/", function (req, res) {
    res.json({
        status: "My API is alive!"
    });
});

var sources = {
    "1DIxE06gUQFTNskLX7Nd": {
        "name": "CoinDesk",
    },
    "UZUksRVofjXewHCGH46B": {
        "name": "Bitcoinist",
    },
    "YFHfBR51cP9pPcomXRec": {
        "name": "Bitcoin Magazine",
    },
    "Vd1wHH0eo9YPQYp0LUg2": {
        "name": "Bitcoin News",
    },
    "Zt6pBLjPpUXDaA4j4IlJ": {
        "name": "Blockonomi",
    },
    "IEuOxRvA5umqJpxVBUDE": {
        "name": "The Blockchain",
    },
    "iJhCMx7HKBj131MTWb54": {
        "name": "TechCrunch",
    },
    "Vc8SNqeffrVBmDH1kCWW": {
        "name": "CryptoCoinNews",
    },
    "GwDtUSAyftLDqYO34QWQ": {
        "name": "CNBC",
    },
    "HKelat6Mvmipd2S40t5p": {
        "name": "New York Times",
    },
    "ZKpa3rbhpmPQoiCLNr0F": {
        "name": "Quartz",
    },
    "fOU6ztWICW3swQfWR05H": {
        "name": "Wall Street Journal",
    },
    "bvpSVTQRvOPr9BzHyvUe": {
        "name": "Hacker Noon",
    },

}

var x = ["1DIxE06gUQFTNskLX7Nd", "UZUksRVofjXewHCGH46B", "YFHfBR51cP9pPcomXRec"]
x.forEach(function(path) {
    
    router.get("/api/"+path, function(req, res) { 
        var currentPage = 1

        if (typeof req.query.page !== 'undefined') {
            currentPage = +req.query.page;
        }
    console.log(currentPage)
    vd = {}
    var queryRef = db.collection('articles')
    .limit(10)
    .offset(currentPage * 10)
    .where('site', '==', path)
    .get()
    .then((snapshot) => {
        snapshot.forEach((doc) => {
            vd[doc.id] = doc.data()
        });
        res.status(200).json(vd);
    }) });
  });

router.get("/api/go", function (req, res){

})

router.post("/api/user", auth.authenticate(), function (req, res) {
    //console.log(req.headers.refreshToken)
    admin.auth().verifyIdToken(req.headers.refreshToken)
        .then(function (decodedToken) {
            var uid = decodedToken.uid;
            res.status(200).json(req)
        }).catch(function (error) {
            res.status(400).send("Error")
        });
});



console.log("OKK")
module.exports = router;


// Create a query against the collection
// vd = {}
// var queryRef = db.collection('articles').where('site', '==', 'CCN').get()
// .then((snapshot) => {
//     //console.log(snapshot.data())
//     snapshot.forEach((doc) => {
//         vd[doc.id] = doc.data()
//     });
//    //console.log(vd)
// })
