# Generic Hypermedia API-client testserver

Testserver om de geïmplementeerde bouwblokken, zie [Generic Hypermedia API Client](https://github.com/ddvlanck/generic-hypermedia-api-client), te testen.

## Gebruik

Open een command-line interface en navigeer naar de folder. Daar voer je volgende commando's uit:

```
> npm install
> node app.js
```

In de console krijg je nu te zien `App listening on port 3001`. Wanneer de applicatie een volgende keer opgestart dient te worden, moet enkel `node app.js` uitgevoerd worden.

Het is ook mogelijk om een eigen baseURI en poort mee te geven. In volgend voorbeeld wordt als baseURI `localhost` meegegeven en als poort `4000` :

```
> node app.js localhost 4000
```

In de console wordt `App listening on port 4000` getoond.

## Endpoints

Hieronder wordt een overzicht gegeven welke endpoints per handler gebruikt kunnen worden om deze te testen:

#### MetadataHandler
* `/api` = **entrypoint**.
* `/api/documentation`
* `/api/all`

#### PaginationHandler
* `/api/pagination` 
* `/api/all`

#### LanguageHandler
* `/api/language`
* `/api/all`

#### VersioningHandler
* `/api/versioning`
* `/api/all`

#### FullTextSearchHandler
* `/api/fullTextSearch`

#### CRUDHandler
* `/api/crud/1`
* `/api/crud/2`
* `/api/crud/3`
* `/api/crud/4`

