# Generic Hypermedia API-client testserver

Testserver om de geïmplementeerde bouwblokken, zie [Generic Hypermedia API Client](https://github.com/ddvlanck/generic-hypermedia-api-client), te testen.

## Gebruik

Open een command-line interface en navigeer naar de folder. Daar voer je volgende commando's uit:

```
> npm install
> node app.js   baseURI   port
```

Het programma verwacht de _baseURI_ waarop de server zal draaien, bijvoorbeeld `http://example.org`. Ook de poort waarop de server toegankelijk is moet worden meegegeven. Indien geen _baseURI_ of poort wordt meegegeven, dan wordt default `localhost` ingesteld als baseURI. De poort staat default `3001` ingesteld.

Het commando `npm install` moet enkel de **eerste** keer uitgevoerd worden. 

```
> node app.js http://example.org 5000
> node app.js 
```

In het **eerste** geval zal de _baseURI_ = `http:/example.org` en de _port_ = `5000`. In het **tweede** geval zal de _baseURI_ = `localhost` en de _port_ = `3001`. In de console verschijnt bij success `App listening in port 'PORT'`, waar 'PORT' zal ingevuld worden door de _port_ die werd meegegeven of `3001` als dat niet gedaan werd.

## Werking server

Voor meer uitleg hoe de server precies werkt, zie de [Wiki-pagina](https://github.com/Informatievlaanderen/generic-hypermedia-api-client-testserver/wiki).

## Endpoints

Hieronder wordt een overzicht gegeven welke endpoints per handler gebruikt kunnen worden om deze te testen:

#### MetadataHandler
* [/api](https://github.com/Informatievlaanderen/generic-hypermedia-api-client-testserver/wiki/Entrypoint) = **entrypoint**.
* [/api/documentation](https://github.com/Informatievlaanderen/generic-hypermedia-api-client-testserver/wiki/API-documentation-data)
* [/api/all](https://github.com/Informatievlaanderen/generic-hypermedia-api-client-testserver/wiki/Combination-of-data)

#### PaginationHandler
* [/api/pagination](https://github.com/Informatievlaanderen/generic-hypermedia-api-client-testserver/wiki/Pagination-data)
* [/api/all](https://github.com/Informatievlaanderen/generic-hypermedia-api-client-testserver/wiki/Combination-of-data)

#### LanguageHandler
* [/api/language](https://github.com/Informatievlaanderen/generic-hypermedia-api-client-testserver/wiki/Language-data)
* [/api/all](https://github.com/Informatievlaanderen/generic-hypermedia-api-client-testserver/wiki/Combination-of-data)

#### VersioningHandler
* [/api/versioning](https://github.com/Informatievlaanderen/generic-hypermedia-api-client-testserver/wiki/Versioning-data)
* [/api/all](https://github.com/Informatievlaanderen/generic-hypermedia-api-client-testserver/wiki/Combination-of-data)

#### FullTextSearchHandler
* [/api/fullTextSearch](https://github.com/Informatievlaanderen/generic-hypermedia-api-client-testserver/wiki/Full-Text-Search-data)

#### CRUDHandler
Voor meer info zie [Wiki voor CRUD data](https://github.com/Informatievlaanderen/generic-hypermedia-api-client-testserver/wiki/CRUD-data).
* `/api/crud/1`
* `/api/crud/2`
* `/api/crud/3`
* `/api/crud/4`

