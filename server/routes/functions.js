var admin = require("firebase-admin");
var request = require('request');
var cheerio = require('cheerio');
var og = require('scrape-meta');
var express = require("express");
var bodyParser = require('body-parser');
var urlMetadata = require('url-metadata')
var Nightmare = require('nightmare'),
    nightmare = Nightmare({
        show: false
    });
var vidinfo = require('youtube-info')
var phantom = require('phantom');
const hash = require('js-hash-code')


var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');

var tone_analyzer = new ToneAnalyzerV3({
    username: "8771110b-fc7f-460f-85b0-5e2241f4fb77",
    password: "EsCOXCIOOJw5",
    version_date: '2018-02-04'
});

function tweet(title) {

    return new Promise(function (resolve, reject) {
        var senti = "none"
        tone_analyzer.tone({
                tone_input: title,
                content_type: 'text/plain'
            },
            function (err, tone) {

                if (err) {
                    console.log(err);
                } else {
                    senti = tone
                    if (senti["document_tone"]["tones"].length == 0){

                        
                        senti["document_tone"]["tones"] = [{"tone_id" : "neutral"}]
                        senti["document_tone"]["tones"] = [{"score" : 5}]

                    }


                }
               // console.log(JSON.stringify(senti))
                resolve(senti)
            })
    })
}

tweet("Canadian Regulators Approve Country's First Blockchain ETF").then((d) => {
    //console.log(JSON.parse(d))

})


Array.prototype.contains = function (obj) {
    var i = this.length;
    while (i--) {
        if (this[i] == obj) {
            return true;
        }
    }
    return false;
}

const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.set('view engine', 'jade');
app.use(express.static('public'));

var serviceAccount = require("../path/kiosk-f1a66-firebase-adminsdk-434m3-8468b3596a.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://kiosk-f1a66.firebaseio.com"
});

var db = admin.firestore();

var sources = ["CoinDesk", "Bitcoin News", "Bitcoin Magazine"]

function check(url) {
    // Create a query against the collection
    return new Promise(function (resolve, reject) {
        var queryRef = db.collection('articles').where('url', '==', url).get()
            .then((snapshot) => {
                var vd = {}
                snapshot.forEach((doc) => {
                    vd[doc.id] = doc.data()
                });
                resolve(vd)
            })
    })
}


function tags(link, tag, subtag) {
    return new Promise(function (resolve, reject) {
        var tags = []
        request(link, function (error, response, body) {

            if (error) {
                return console.error("error")
            }
            var $ = cheerio.load(body);
            $(tag).find(subtag).each(function () {
                var at = $(this).attr('href')
                var title = at.substring(at.lastIndexOf("tag/") + 4, at.lastIndexOf("/"));
                tags.push(title)
            })
            resolve(tags)
        })

    })

}

module.exports = {
    coindesk: function coindesk() {
        console.log("coindesk")
        var n = new Set();
        request("https://www.coindesk.com/", function (error, response, body) {
            if (error) {
                return console.error('There was an error!');
            }

            var $ = cheerio.load(body);

            $('a').each(function () {


                var articls = $(this).attr('class');
                if (articls === "fade") {

                    let link = $(this).attr('href')

                    if (!(n.has(link))) {
                        // check(link).then((vd) => {
                        //if (Object.keys(vd).length === 0) {

                        og
                            .scrapeUrl(link)
                            .then((metadata) => {
                                var lastIndex = metadata["title"].lastIndexOf("-");
                                var title = metadata["title"].substring(0, lastIndex);
                                var date = metadata["date"]
                                if (date === null) {
                                    date = new Date();
                                }


                                tags(link, 'p[class="single-tags"]', 'a')
                                    .then((tg) => {

                                        //console.log(tg)

                                        tweet(title).then((d) => {
                                           
                                            var hashcode = hash(title);
                                            var docRef = db.collection("articles").doc(hashcode)
                                            
                                            var articles = {
                                                "id": hashcode,
                                                "site": "1DIxE06gUQFTNskLX7Nd",
                                                "url": metadata["url"],
                                                "title": title,
                                                "image": metadata["image"],
                                                "date-a": date,
                                                "tags": tg,
                                                "views": 0,
                                                "score": d["document_tone"]["tones"][0]["score"],
                                                "tonename": d["document_tone"]["tones"][0]["tone_id"]+""
                                            }
                                           // console.log(articles)
                                            docRef.set(articles)
                                        }).catch((err) => console.error(err))


                                    }).catch((err) => console.error(err))


                            }).catch((err) => console.error(err))
                        //}
                        //}).catch((err) => console.error("Fail"))

                    }
                    n.add(link)
                }

            });
        });

    },


    bitcoin: function bitcoin() {
        console.log("bitcoin")
        request("https://news.bitcoin.com/", function (error, response, body) {
            if (error) {
                return console.error('There was an error!');
            }

            var $ = cheerio.load(body);

            $('div[class="td_module_mx3 td_module_wrap td-animation-stack"]').find('div > a').each(function () {

                var a = $(this).attr('href');
                //check(a).then((vd) => {
                //if (Object.keys(vd).length === 0) {
                og
                    .scrapeUrl(a)
                    .then((metadata) => {
                        
                        var lastIndex = metadata["title"].lastIndexOf("-");
                        var title = metadata["title"].substring(0, lastIndex);
                        var date = metadata["date"]
                        if (date === null) {
                            date = new Date();
                        }
                        tweet(title).then((d) => {
                        var hashcode = hash(title);
                        var docRef = db.collection("articles").doc(hashcode)
                        var articles = {
                            "id": hashcode,
                            "site": "Vd1wHH0eo9YPQYp0LUg2",
                            "url": metadata["url"],
                            "title": title,
                            "image": metadata["image"],
                            "date-a": date,
                            "views": 0,
                            "score": d["document_tone"]["tones"][0]["score"],
                            "tonename": d["document_tone"]["tones"][0]["tone_id"]+""

                        }
                        //console.log(articles)
                        docRef.set(articles)
                    }).catch((err) => console.error("bcFail"))

                    }).catch((err) => console.error("bcFail"))
                //}

                //}).catch((err) => console.error("Fail"))
            });
        });

    },


    blockonomi: function blockonomi() {
        console.log("blockonomi")
        var links = ["https://blockonomi.com/page/2/", "https://blockonomi.com/"]
        for (let c of links) {
            request(c, function (error, response, body) {
                if (error) {
                    return console.error('There was an error!');
                }

                var $ = cheerio.load(body);

                $('a[class="grid-thumb-image"]').each(function () {

                    var a = $(this).attr('href');
                    // check(a).then((vd) => {
                    //     if (Object.keys(vd).length === 0) {
                    og
                        .scrapeUrl(a)
                        .then((metadata) => {
                            //console.log(metadata["title"])
                            var date = metadata["date"]
                            if (date === null) {
                                date = new Date();
                            }
                            tweet(metadata["title"]).then((d) => {
                            var hashcode = hash(metadata["title"]);
                            var docRef = db.collection("articles").doc(hashcode)
                            var articles = {
                                "id": hashcode,
                                "site": "Zt6pBLjPpUXDaA4j4IlJ",
                                "url": metadata["url"],
                                "title": metadata["title"],
                                "image": metadata["image"],
                                "date-a": date,
                                "views": 0,
                                "score": d["document_tone"]["tones"][0]["score"],
                                "tonename": d["document_tone"]["tones"][0]["tone_id"]+""
                            }
                            //console.log(articles)
                            docRef.set(articles)
                        }).catch((err) => console.error("bnFail"))
                        }).catch((err) => console.error("bnFail"))
                    //  }
                    //}).catch((err) => console.error("Fail"))
                });
            });
        }
    },

    cointele: function cointele() {

        request("https://cointelegraph.com/", function (error, response, body) {
            if (error) {
                return console.error('There was an error!');
            }

            var $ = cheerio.load(body);

            $('.header').filter(function () {
                console.log($(this))
                var a = $(this).attr('href');

                og
                    .scrapeUrl(a)
                    .then((metadata) => {
                        var lastIndex = metadata["title"].lastIndexOf("-");
                        var title = metadata["title"].substring(0, lastIndex);

                        var docRef = db.collection("articles").doc()
                        var hashcode = hash(title);
                        var docRef = db.collection("articles").doc(hashcode)
                        var articles = {
                            "id": hashcode,
                            "site": metadata["publisher"],
                            "url": metadata["url"],
                            "title": title,
                            "image": metadata["image"],
                            "date-a": metadata["date"],
                            "views": 0
                        }
                        //console.log(articles)
                        docRef.set(articles)

                    }).catch((err) => console.error("ctFail"))
            });
        });

    },

    coinmeme: function coinmeme() {
        console.log("coinmeme")
        n = new Set()
        request("https://coinmeme.io", function (error, response, body) {
            if (error) {
                return console.error('There was an error!');
            }
            var $ = cheerio.load(body);
            $('div[class="article-wrap"]').find('article > div > h3 > a').each(function () {

                var a = $(this).attr('href');
                if (!(n.has(a))) {
                    // check(a).then((vd) => {
                    //     if (Object.keys(vd).length === 0) {

                    og
                        .scrapeUrl(a)
                        .then((metadata) => {
                            var date = metadata["date"]
                            if (date === null) {
                                date = new Date();
                            }
                            var lastIndex = metadata["title"].lastIndexOf("-");
                            var title = metadata["title"].substring(0, lastIndex)
                            if (lastIndex == -1) {
                                title = metadata["title"];
                            }
                            if (!(sources.contains(metadata["publisher"]))) {
                                console.log(metadata["publisher"])
                                //console.log("ye")
                                tweet(metadata["title"]).then((d) => {
                                var hashcode = hash(title);
                                var docRef = db.collection("articles").doc(hashcode)
                                var articles = {
                                    "id": hashcode,
                                    "site": metadata["publisher"],
                                    "url": metadata["url"],
                                    "title": title,
                                    "image": metadata["image"],
                                    "date-a": date,
                                    "views": 0,
                                    "score": d["document_tone"]["tones"][0]["score"],
                                    "tonename": d["document_tone"]["tones"][0]["tone_id"]+""
                                }
                                //console.log(articles)
                                docRef.set(articles)
                            }).catch((err) => console.error("cmFail"))
                            }
                            
                        }).catch((err) => console.error("cmFail"))
                    //     }
                    // }).catch((err) => console.error("Fail"))
                }
                n.add(a)
            });
        });

    },

    suppo: function Suppoman() {
        //console.log("ss")
        var allvid = ""
        nightmare
            //load a url
            .goto('https://www.youtube.com/user/Suppoman2011/videos')
            //wait for an element identified by a CSS selector
            //in this case, the body of the results
            .wait('#main')
            //execute javascript on the page
            //here, the function is getting the HREF of all the search result
            .evaluate(function () {

                return [].slice.call(document.querySelectorAll('#thumbnail')).map(function (element) {
                    return element.href;
                });
            })
            //end the Nightmare instance along with the Electron instance it wraps
            .end()
            //run the queue of commands specified, followed by logging the HREF
            .then(function (result) {
                allvid = result.map(function (element) {
                    return element.substring(element.lastIndexOf("=") + 1)
                })

                allvid.forEach(function (vid) {
                    var url = "https://www.googleapis.com/youtube/v3/videos?id=" + vid + "&key=AIzaSyBq7gHR0NBxJeAmUXWx0zlfmdUY0Z1O6k8&part=snippet"
                    request(url, function (error, response, body) {
                        // console.log('error:', error); // Print the error if one occurred
                        // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                        // Print the HTML for the Google homepage.
                        var data = JSON.parse(body)
                        tweet(data["items"][0]["snippet"]["localized"]["title"]).then((d) => {
                        
                        var hashcode = hash(data["items"][0]["snippet"]["localized"]["title"]);
                        var docRef = db.collection("articles").doc(hashcode)
                        var articles = {
                            "id": hashcode,
                            "title": data["items"][0]["snippet"]["localized"]["title"],
                            "image": data["items"][0]["snippet"]["thumbnails"]["high"]["url"],
                            "date-a": data["items"][0]["snippet"]["publishedAt"],
                            "author": data["items"][0]["snippet"]["channelTitle"],
                            "url": data["items"][0]["id"],
                            "site": "tnSwHfll4z3tgtOR6u3f",
                            "views": 0,
                            "score": d["document_tone"]["tones"][0]["score"],
                            "tonename": d["document_tone"]["tones"][0]["tone_id"]+""
                        }
                        docRef.set(articles)
                    }).catch(function (error) {
                        console.error('an error has occurred: ' + error);
                    });
                        //console.log(metavid);
                    });

                })
            })
            //catch errors if they happen
            .catch(function (error) {
                console.error('an error has occurred: ' + error);
            });
    },
    //suppo()

    theblockchain: function theblockchain() {
        console.log("theblockchain")
        var links = ["http://www.the-blockchain.com/news/page/2/", "http://www.the-blockchain.com/news/"]
        for (let c of links) {
            request(c, function (error, response, body) {
                if (error) {
                    return console.error('There was an error!');
                }

                var $ = cheerio.load(body);

                $('div[class="td-block-span6"]').find('div > div > h3 > a').each(function () {

                    var a = $(this).attr('href');
                    //check(a).then((vd) => {
                    //if (Object.keys(vd).length === 0) {

                    og
                        .scrapeUrl(a)
                        .then((metadata) => {
                            //console.log(metadata["title"])
                            var date = metadata["date"]
                            if (date === null) {
                                date = new Date();
                            }
                            tweet(metadata["title"]).then((d) => {
                            var docRef = db.collection("articles").doc()
                            var hashcode = hash(metadata["title"]);
                            var docRef = db.collection("articles").doc(hashcode)
                            var articles = {
                                "id": hashcode,
                                "site": "IEuOxRvA5umqJpxVBUDE",
                                "url": metadata["url"],
                                "title": metadata["title"],
                                "image": metadata["image"],
                                "date-a": date,
                                "views": 0,
                                "score": d["document_tone"]["tones"][0]["score"],
                                "tonename": d["document_tone"]["tones"][0]["tone_id"]+""
                            }
                            console.log(articles)
                            //docRef.set(articles)
                        }).catch((err) => console.error("chainFail"))
                        }).catch((err) => console.error("chainFail"))
                    // }
                    //}).catch((err) => console.error("Fail"))
                });
            });
        }
    },


    bitmag: function bitmag() {
        console.log("bitmag")
        request("https://bitcoinmagazine.com", function (error, response, body) {
            if (error) {
                return console.error('There was an error!');
            }

            var $ = cheerio.load(body);

            $('div[class="col-lg-5 push-lg-10 category-list--date"]').find('a').each(function () {

                var a = $(this).attr('href');
                //check("https://bitcoinmagazine.com" + a).then((vd) => {
                //if (Object.keys(vd).length === 0) {

                og
                    .scrapeUrl("https://bitcoinmagazine.com" + a)
                    .then((metadata) => {
                        var lastIndex = metadata["title"].lastIndexOf("-");
                        if (lastIndex == -1){
                            var title = metadata["title"]
                        }else{
                            var title = metadata["title"].substring(0, lastIndex);
                        }
                        var date = metadata["date"]
                        if (date === null) {
                            date = new Date();
                        }
                        console.log(title)
                        //tweet(title).then((d) => {
                        var docRef = db.collection("articles").doc()
                        var hashcode = hash(title);
                        var docRef = db.collection("articles").doc(hashcode)
                        var articles = {
                            "id": hashcode,
                            "site": "YFHfBR51cP9pPcomXRec",
                            "url": metadata["url"],
                            "title": metadata["title"],
                            "image": metadata["image"],
                            "date-a": date,
                            "views": 0,
                            //"score": d["document_tone"]["tones"][0]["score"],
                            //"tonename": d["document_tone"]["tones"][0]["tone_id"]+""
                        }
                       // console.log(articles)
                        //docRef.set(articles)
                   // }).catch((err) => console.error(err))
                    }).catch((err) => console.error(err))
                // }
                //})
            });
        });

    },

    bitcoinist: function bitcoinist() {
        console.log("bitcoinist")
        var links = ["http://bitcoinist.com/category/blockchain-technology/", "http://bitcoinist.com/category/altcoins/"]
        for (let c of links) {
            request(c, function (error, response, body) {
                if (error) {
                    return console.error('There was an error!');
                }

                var $ = cheerio.load(body);

                $('a[class="featured-image"]').each(function () {

                        var a = $(this).attr('href');
                        //console.log(a)
                        //check(a).then((vd) => {
                        //if (Object.keys(vd).length === 0) {        
                        og
                            .scrapeUrl(a)
                            .then((metadata) => {
                                //console.log(metadata["title"])
                                var lastIndex = metadata["title"].lastIndexOf("-");
                                var title = metadata["title"].substring(0, lastIndex);
                                var date = metadata["date"]
                                if (date === null) {
                                    date = new Date();
                                }
                                tweet(title).then((d) => {
                                var hashcode = hash(title);
                                var docRef = db.collection("articles").doc(hashcode)
                                var articles = {
                                    "id": hashcode,
                                    "site": "UZUksRVofjXewHCGH46B",
                                    "url": metadata["url"],
                                    "title": title,
                                    "image": metadata["image"],
                                    "date-a": date,
                                    "views": 0,
                                    "score": d["document_tone"]["tones"][0]["score"],
                                    "tonename": d["document_tone"]["tones"][0]["tone_id"]+""
                                }
                                //console.log(articles)
                                docRef.set(articles)
                            }).catch((err) => console.error(err))
                            }).catch((err) => console.error(err))
                        //}
                        //}).catch((err) => console.error("cFail"))


                    },
                    function (error) { // failure handler
                        console.log(error)
                    })

            });
        }
    }
}
//bitcoinist()
// bitcoin()
// bitmag()
// theblockchain()
//coindesk()
// blockonomi()
// coinmeme()


console.log("Okai")
//var g = utf8.encode('https://cointelegraph.com/news/cnbcs-ran-neuner-says-bitcoin-will-end-2018-at-50000')




//blockonomi()



// Promise interface