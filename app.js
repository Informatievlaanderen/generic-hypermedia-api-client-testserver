const express = require('express');
const app = express();
const negotiator = require('accept-language-negotiator');

const PAGE_SIZE = 10;
const port = process.argv.length < 4 ? 3001 : process.argv[3];
const baseUrl = process.argv.length < 3 ? 'http://localhost:' + port : process.argv[2];

app.enable('etag')

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Expose-Headers", "Link");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Content-Type", "application/ld+json");
    next();
});

app.get('/', (req, res) => {
    res.redirect('/api');
});

//Entrypoint of our dummydata
app.get('/api', (req, res) => {
    const doc = {
        "@context": [
            "http://www.w3.org/ns/hydra/context.jsonld",
            "https://raw.githubusercontent.com/SEMICeu/DCAT-AP/master/releases/1.1/dcat-ap_1.1.jsonld",
            {
                "hydra": "http://www.w3.org/ns/hydra/core#",
                "dc": "http://purl.org/dc/terms/",
                "dcat": "https://www.w3.org/ns/dcat#",
                "hydra:apiDocumentation" : { "@type" : "@id"}
            }
        ],
        "@id": "/api",
        "@type": ["EntryPoint", "Distribution"],
        "hydra:apiDocumentation": "/api/documentation",
        "dc:issued": "2016-01-10",
        "dc:modified": "2018-07-24"
    };
    res.header("Content-Type", "application/ld+json");
    res.send(doc);
})
;

//Api documentation information
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
        "@id": "/api/documentation",
        "@type": "ApiDocumentation, Distribution",
        "hydra:title": "Voorbeeld Event API",
        "hydra:description": "Lorem ipsum dolor sit amet",
        "dc:issued": "2016-01-10",
        "dc:modified": "2018-07-24",
        "dc:license": "http://example.orglicenties/hergebruik/modellicentie_gratis_hergebruik_v1_0.html",
        "hydra:entrypoint": baseUrl + "/api",
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

//Dummydata for PaginationHandler
app.get('/api/pagination', (req, res) => {
    const doc = {
        "@context": "http://www.w3.org/ns/hydra/context.jsonld",
        "@id": "/api/pagination",
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

    res.header("Content-Type", "application/ld+json");
    res.send(doc);
});

//Dummydata for LanguageHandler
app.get('/api/language', (req, res) => {
    const headers = req.headers['accept-language'];
    const supportedLanguageTags = [
        'nl-be',
        'en-US'
    ];

    const doc = {
        "@context": {
            "label": { "@id": "http://www.w3.org/2000/01/rdf-schema#label", "@container": "@language" }
        },
        "@id": "/api/language/1",
        "label" : {
            "nl-be": "België",
            "en-us": "Belgium",
            "fr-CA": "Belgique"
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

//Dummydata for VersioningHandler
app.get('/api/versioning', (req, res) => {
    //For now, only link to versionendURL is send back, this is a dummy URL and contains no data.
    if(req.headers['accept-datetime']){
        //Random numb to simulate TEMPORAL or ATEMPORAL versioning
        let numb =  Math.floor(Math.random() * Math.floor(2))
        if(numb === 1){
            //TEMPORAL VERSIONING
            res.setHeader('memento-datetime', req.headers['accept-datetime']);
            res.setHeader('link', '<' + baseUrl + '/api/versionedURL/Temporal>; rel=timegate');
        } else {
            //ATEMPORAL VERSIONING
            res.setHeader('link', '<' + baseUrl + '/api/versionedURL/Atemporal>; rel=alternate')
        }
    }
    res.header("Content-Type", "application/ld+json");
    res.end();
});

//All of the information above put together (most of it)
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
        "@type": ["EntryPoint", "Distribution"],
        "dc:issued": "2016-01-10",
        "dc:modified": "2018-07-24",
        "label": {
            "nl-be": "Gent",
            "en-us": "Ghent",
            "fr-CA" : "Gand"
        },
        "operation": [
            {
                "@type": "Operation",
                "method": "PUT"
            },
            {
                "@type": "Operation",
                "method": "POST",
                "expects": "schema:Event"
            }
        ]
    };

    //VERSIONING
    if(req.headers['accept-datetime']){
        //Random numb to simulate TEMPORAL or ATEMPORAL versioning
        let numb =  Math.floor(Math.random() * Math.floor(2))
        if(numb === 1){
            //TEMPORAL VERSIONING
            res.setHeader('memento-datetime', req.headers['accept-datetime']);
            linkHeader += '<' + baseUrl + '/api/versionedURL/Temporal>; rel=timegate,';
        } else {
            //ATEMPORAL VERSIONING
            linkHeader += '<' + baseUrl + '/api/versionedURL/Atemporal>; rel=alternate,';
        }
    }
    //Api documentation URL via Link header
    linkHeader += '<http://tw06v036.ugent.be/api/documentation>; rel="http://www.w3.org/ns/hydra/core#apiDocumentation",';

    //Pagination links also for Link header
    linkHeader += '<http://example.org/dummy?page=4&limiet=100>; rel="prev",';
    linkHeader += '<http://example.org/dummy?page=6&limiet=100>; rel="next",';
    linkHeader += '<http://example.org/dummy?page=1&limiet=100>; rel="first",';
    linkHeader += '<http://example.org/dummy?page=20&limiet=100>; rel="last"';

    res.header("Content-Type", "application/ld+json");
    res.setHeader('link', linkHeader);
    res.send(doc);
});

//Dummydata for FullTextSearchHandler
app.get('/api/fullTextSearch', (req, res) => {
    const doc = {
        "@context": "http://www.w3.org/ns/hydra/context.jsonld",
        "@type": "IriTemplate",
        "@id": baseUrl + "/api/fullTextSearch",
        "search": {
            "template": baseUrl + "/api/fullTextSearch/search{?filter}",
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
});

//Entrypoint for URL with parameters.
app.get('/api/fullTextSearch/search', (req, res) => {
    const doc = {
        "@context": "http://www.w3.org/ns/hydra/context.jsonld",
        "@type": "IriTemplate",
        "@id": "http://api.example.com/personen",
        "http://rdfs.org/ns/void#subset": "http://api.example.com/personen?filter=Bob",
        "search": {
            "template": "http://api.example.com/personen{?filter}",
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

    const json = {
        'Status' : 'Full Text Search ok, format is JSON'
    }

    let numb =  Math.floor(Math.random() * Math.floor(2))
    if(numb === 1){
        res.setHeader('content-type', 'application/json');
        res.send(JSON.stringify(json));
    } else {
        res.setHeader('content-type', 'application/ld+json');
        res.send(doc);
    }
});

//Dummydata for CRUDHandler
app.get('/api/crud/1', (req,res) => {

    const doc = {
        "@context": [
            "http://www.w3.org/ns/hydra/context.jsonld",
            {
                "sh": "http://www.w3.org/ns/shacl#",
                "schema": "https://schema.org/"
            }
        ],
        "@id": "/api/crud/1",
        "title": "Een voorbeeld resource",
        "description": "Deze resource kan verwijderd worden met een HTTP DELETE request of aangepast worden met een HTTP PUT request",
        "operation": [
            {
                "@type": "Operation",
                "method": "GET"
            },
            {
                "@type": "Operation",
                "method": "PUT",
                "expects": "schema:Event"
            },
            {
                "@type": "Operation",
                "method": "POST",
                "expects": "schema:Event"
            }
        ]
    }
    res.setHeader('Content-type', 'application/ld+json');
res.send(doc);
});

app.listen(port, () => console.log('App listening on port ' + port +'!'));