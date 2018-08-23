const express = require('express');
const app = express();
const negotiator = require('accept-language-negotiator');

const PAGE_SIZE = 10;
const port = process.argv.length < 4 ? 3001 : process.argv[3];
const baseUrl = process.argv.length < 3 ? 'http://localhost:' + port + '/' : process.argv[2];

app.enable('etag')

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Expose-Headers", "Link");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    //res.header("Cache-Control", "max-age=604800"); // 1 week
    res.header("Content-Type", "application/ld+json");
    //res.set('Link', '<' + baseUrl + 'api/documentation>; rel="http://www.w3.org/ns/hydra/core#apiDocumentation"');
    next();
});

app.get('/', (req, res) => {
    res.redirect('/api');
});

app.get('/api', (req, res) => {
    const doc = {
        "@context": [
            "http://www.w3.org/ns/hydra/context.jsonld",
            "https://raw.githubusercontent.com/SEMICeu/DCAT-AP/master/releases/1.1/dcat-ap_1.1.jsonld",
            {
                "hydra": "http://www.w3.org/ns/hydra/core#",
                "dc": "http://purl.org/dc/terms/",
                "dcat": "https://www.w3.org/ns/dcat#"
            }
        ],
        "@id": "/api",
        "@type": "EntryPoint, Distribution",
        "hydra:apiDocumentation": "/documentation",
        "dc:issued": "2016-01-10",
        "dc:modified": "2018-07-24"
    };
    res.header("Content-Type", "application/ld+json");
    //res.setHeader('Link', '<http://localhost:3001/api/documentation>; rel="http://www.w3.org/ns/hydra/core#apiDocumentation"');


    res.send(doc);
})
;

app.get('/api/documentation', (req, res) => {
    const doc = {
        "@context": [
            "http://www.w3.org/ns/hydra/context.jsonld",
            "https://raw.githubusercontent.com/SEMICeu/DCAT-AP/master/releases/1.1/dcat-ap_1.1.jsonld",

            {
                "hydra": "http://www.w3.org/ns/hydra/core#",
                "dc": "http://purl.org/dc/terms/",
                "schema": "https://schema.org/",
                "distributionOf": {"@reverse": "http://www.w3.org/ns/dcat#distribution"},
                "geometry": {
                    "@id": "http://www.w3.org/ns/locn#geometry",
                    "@type": "http://www.opengis.net/ont/geosparql#wktLiteral"
                }
            }
        ],
        "@id": "http://localhost:3001/api/documentation",
        "@type": "ApiDocumentation, Distribution",
        "hydra:title": "Voorbeeld Event API",
        "hydra:description": "Lorem ipsum dolor sit amet",
        "dc:issued": "2016-01-10",
        "dc:modified": "2018-07-24",
        "dc:license": "https://overheid.vlaanderen.be/sites/default/files/documenten/ict-egov/licenties/hergebruik/modellicentie_gratis_hergebruik_v1_0.html",
        "hydra:entrypoint": "https://localhost:3001/api",
        "schema:contactPoint": {
            "schema:contactnaam": "Helpdesk",
            "schema:email": "info@example.org",
            "schema:website": "https://example.org/helpdesk"
        },
        "dc:temporal": {
            "@type": "PeriodOfTime",
            "startDate": "2010-01-01",
            "endDate": "2016-12-31"
        },
        "dc:spatial": {
            "@type": "Location",
            "geometry": "POLYGON((-10.58 70.09,34.59 70.09,34.59 34.56,-10.5834.56))"
        },
        "hydra:supportedClass": [
            {
                "@id": "schema:Event",
                "name": "An Event",
                "label": "Event",
                "supportedProperty": [
                    {
                        "@type": "SupportedProperty",
                        "property": "schema:eventName"
                    },
                    {
                        "@type": "SupportedProperty",
                        "property": "schema:eventDescription"
                    },
                    {
                        "@type": "SupportedProperty",
                        "property": "schema:startDate"
                    },
                    {
                        "@type": "SupportedProperty",
                        "property": "schema:endDate"
                    }
                ]
            }
        ]
    }
    res.header("Content-Type", "application/ld+json")
    res.send(doc);
})
;

app.get('/api/pagination', (req, res) => {
    const doc = {
        "@context": "http://www.w3.org/ns/hydra/context.jsonld",
        "@id": "http://localhost:3001/api/pagination",
        "@type": "PartialCollection",
        "next": "/api/resource?page=4",
        "last": "/api/resource?page=50",
        "first": "/api/resource",
        "previous": "/api/resource?page=2",
        "totalItems": 2,
        "member": [
            {
                "@id": "/api/resource/5"
            },
            {
                "@id": "/api/resource/6"
            }
        ]
    }

    //It's possible to only send the headers with the links too!
    /*res.setHeader('link', '<https://hostname/api/resource?page=4&limit=100>; rel="next",' +
        '<https://hostname/api/resource?page=50&limit=100>; rel="last",' +
        '<https://hostname/api/resource?page=2&limit=100>; rel="prev",' +
        '<https://hostname/api/resource?page=1&limit=100>; rel="first"')*/

    res.header("Content-Type", "application/ld+json");
    res.send(doc);
});

app.get('/api/language', (req, res) => {
    const headers = req.headers['accept-language'];
    const supportedLanguageTags = [
        'nl-be',
        'en-US',
        'fr-CA'
    ];

    const doc = {
        "@context": {
            "label": { "@id": "http://www.w3.org/2000/01/rdf-schema#label", "@container": "@language" }
        },
        "@id": "/api/language/1",
        "label": {
            "nl-be": "Gent",
            "en-us": "Ghent",
            "fr-CA" : "Gand"
        }
    }
    res.header("Content-Type", "application/ld+json");

    //Order according to priority
    let result = negotiator.languagePriorityList(headers);
    let priority = '';
    Object.keys(result).forEach( (index) => {
        priority += result[index].tag + ',';
    })
    result = negotiator.basicFilter(priority, supportedLanguageTags);   //Contains all supported languages
    if(result.length > 0){
        res.setHeader('Content-Language', result[0]);
        res.send(doc);
    } else {
        res.status('400');
        res.send();
    }
});

app.get('/api/versioning', (req, res) => {
    if(req.headers['accept-datetime']){
        //Random numb to simulate TEMPORAL or ATEMPORAL versioning
        let numb =  Math.floor(Math.random() * Math.floor(2))
        if(numb === 1){
            //TEMPORAL VERSIONING
            res.setHeader('memento-datetime', req.headers['accept-datetime']);
            res.setHeader('link', '<http://localhost:3001/api/versionedURL/Temporal>; rel=timegate');
        } else {
            //ATEMPORAL VERSIONING
            res.setHeader('link', '<http://localhost:3001/api/versionedURL/Atemporal>; rel=alternate')
        }
    }
    res.header("Content-Type", "application/ld+json");
    res.end();
});

app.get('/api/all', (req, res) => {
    let linkHeader = '';

    //LANGUAGE
    const headers = req.headers['accept-language'];
    const supportedLanguageTags = [
        'nl-be',
        'en-US',
        'fr-CA'
    ];


    let result = negotiator.languagePriorityList(headers);
    let priority = '';
    Object.keys(result).forEach( (index) => {
        priority += result[index].tag + ',';
    })
    result = negotiator.basicFilter(priority, supportedLanguageTags);   //Contains all supported languages
    if(result.length > 0){
        res.setHeader('Content-Language', result[0]);
    } else {
        res.status('400');
    }

    //METADATA + PAGINATION
    const doc = {
        "@context": [
            "http://www.w3.org/ns/hydra/context.jsonld",
            "https://raw.githubusercontent.com/SEMICeu/DCAT-AP/master/releases/1.1/dcat-ap_1.1.jsonld",
            {
                "hydra": "http://www.w3.org/ns/hydra/core#",
                "dc": "http://purl.org/dc/terms/",
                "dcat": "https://www.w3.org/ns/dcat#",
                "label": { "@id": "http://www.w3.org/2000/01/rdf-schema#label", "@container": "@language" }
            }
        ],
        "@id": "/api/all",
        "@type": "EntryPoint, Distribution",
        //"hydra:apiDocumentation": "/documentation",
        "dc:issued": "2016-01-10",
        "dc:modified": "2018-07-24",
        "next": "/api/resource?page=4",
        "last": "/api/resource?page=50",
        "first": "/api/resource",
        "previous": "/api/resource?page=2",
        "label": {
            "nl-be": "Gent",
            "en-us": "Ghent",
            "fr-CA" : "Gand"
        }
    };

    //VERSIONING
    if(req.headers['accept-datetime']){
        //Random numb to simulate TEMPORAL or ATEMPORAL versioning
        let numb =  Math.floor(Math.random() * Math.floor(2))
        if(numb === 1){
            //TEMPORAL VERSIONING
            res.setHeader('memento-datetime', req.headers['accept-datetime']);
            linkHeader += '<http://localhost:3001/api/versionedURL/Temporal>; rel=timegate,';
            //res.setHeader('link', '<http://localhost:3001/api/versionedURL/Temporal>; rel=timegate');
        } else {
            //ATEMPORAL VERSIONING
            //res.setHeader('link', '<http://localhost:3001/api/versionedURL/Atemporal>; rel=alternate')
            linkHeader += '<http://localhost:3001/api/versionedURL/Atemporal>; rel=alternate,';
        }
    }
    linkHeader += '<http://localhost:3001/api/documentation>; rel="http://www.w3.org/ns/hydra/core#apiDocumentation"';

    res.header("Content-Type", "application/ld+json");
    res.setHeader('link', linkHeader);
    res.send(doc);
});

/*app.get('/api/personen', (req, res) => {
    //RDF
    const doc = {
        "@context": "http://www.w3.org/ns/hydra/context.jsonld",
        "@type": "IriTemplate",
        "@id": "http://localhost:3001/api/personen",
        "http://rdfs.org/ns/void#subset": "http://localhost:3001/api/personen?filter=Test",
        "search": {
            "template": "http://localhost:3001/api/personen/zoek{?filter}",
            "variableRepresentation": "BasicRepresentation",
            "mapping": [
                {
                    "@type": "IriTemplateMapping",
                    "variable": "filter",
                    "property": "hydra:freetextQuery",
                    "required": true
                }
            ]
        }
    }
    res.setHeader('content-type', 'application/ld+json');

    res.send(doc);
});*/

/*app.get('/api/personen/zoek', (req, res) => {
    const doc ={
        test: 'ok'
    }
    res.setHeader('content-type', 'application/json');

    // const doc = {
    //     "@context": "http://www.w3.org/ns/hydra/context.jsonld",
    //     "@type": "IriTemplate",
    //     "@id": "http://localhost:3001/api/personen",
    //     "http://rdfs.org/ns/void#subset": "http://localhost:3001/api/personen?filter=Test",
    //     "search": {
    //         "template": "http://localhost:3001/api/personen{?filter}",
    //         "variableRepresentation": "BasicRepresentation",
    //         "mapping": [
    //             {
    //                 "@type": "IriTemplateMapping",
    //                 "variable": "filter",
    //                 "property": "hydra:freetextQuery",
    //                 "required": true
    //             }
    //         ]
    //     }
    // }
    //res.setHeader('content-type', 'application/ld+json');
    res.send(doc);
})*/




app.listen(port, () => console.log('App listening on port ' + port +'!'));