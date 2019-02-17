# Geocoder

<p align="center">
  <a href="https://github.com/go-parrot/geocoder" target="blank"><img src="https://upload.wikimedia.org/wikipedia/commons/7/72/OpenStreetMap-Logo-2006.svg" width="354" alt="Geocoder Logo" /></a>
</p>

[![Build Status](https://travis-ci.com/go-parrot/geocoder.svg?branch=master)](https://travis-ci.com/go-parrot/geocoder)
[![Coverage Status](https://coveralls.io/repos/github/go-parrot/geocoder/badge.svg?branch=master)](https://coveralls.io/github/go-parrot/geocoder?branch=master&service=github)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/ee6e442b32b14d77a9ee9aa25c75e590)](https://www.codacy.com/app/go-parrot/geocoder?utm_source=github.com&utm_medium=referral&utm_content=go-parrot/geocoder&utm_campaign=Badge_Grade)
[![npm version](https://badge.fury.io/js/%40goparrot%2Fgeocoder.svg)](https://badge.fury.io/js/@goparrot/geocoder)

## Description

**Geocoder** is a Typescript library which helps you build geo-aware applications by
providing a powerful abstraction layer for geocoding manipulations.

*   [Installation](#installation)
*   [Usage](#usage)
*   [Providers](#providers)
*   [Special Geocoders and Providers](#special-geocoders-and-providers) 
*   [Versioning](#versioning)
*   [Contributing](#contributing)
*   [Unit Tests](#unit-tests)
*   [Background](#background)
*   [License](#license)

## Installation

    $ npm i @goparrot/geocoder

## Usage

### Minimal

In the code snippet below we use Google provider. 

```typescript
import { AccuracyEnum, Address, Geocoder, GoogleMapsProvider } from '@goparrot/geocoder';
import Axios, { AxiosInstance } from 'axios';

const axios: AxiosInstance = Axios.create();

const provider: GoogleMapsProvider = new GoogleMapsProvider(axios, 'YOUR_API_KEY');

const geocoder: Geocoder = new Geocoder(provider);

(async () => {
    try {
        const result: Address[] = await geocoder.geocode({
            address: '1158 E 89th St, Chicago, IL 60619, USA',
        });

        console.info('addresses', result);
    } catch (err) {
        console.error(err);
    }

    try {
        const result: Address[] = await geocoder.reverse({
            lat: 40.74185,
            lon: -74,
        });

        console.info('addresses', result);
    } catch (err) {
        console.error(err);
    }
})();
```

### Advanced

In the code snippet below we use Here provider. 

```typescript
import { Address, Geocoder, HereProvider, LoggerInterface } from '@goparrot/geocoder';
import Axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import * as winston from 'winston';

// You can use any logger that fits the LoggerInterface
const logger: LoggerInterface = winston.createLogger({
    level: 'debug',
    format: winston.format.simple(),
    transports: [
        new winston.transports.Console(),
    ]
});

// Set timeout for all requests
const axios: AxiosInstance = Axios.create({
    timeout: 5000,
});

// You can log all requests
axios.interceptors.request.use((request: AxiosRequestConfig) => {
    logger.debug('api request', request);

    return request;
});

// You can log all responses
axios.interceptors.response.use(
    (response: AxiosResponse<any>): AxiosResponse<any> => {
        logger.debug(`api response ${response.status}`, response.data);

        return response;
    },
);

/**
 * Caching adapter for axios. Store request results in a configurable store to prevent unneeded network requests.
 * @link {https://github.com/RasCarlito/axios-cache-adapter}
 */

const provider: HereProvider = new HereProvider(axios, 'YOUR_APP_ID', 'YOUR_APP_CODE');

const geocoder: Geocoder = new Geocoder(provider, logger);

(async () => {
    try {
        const result: Address[] = await geocoder.geocode({
            // accuracy: AccuracyEnum.HOUSE_NUMBER,
            address: '1158 E 89th St, Chicago, IL 60619, USA',
            countryCode: 'US',
            // postalCode: '60619',
            // state: 'Illinois',
            // stateCode: 'IL',
            // city: 'Chicago',
            // language: 'en', // default
            // limit: 10, // default
            // fillMissingQueryProperties: true, // default
        });

        logger.info('addresses', result);
    } catch (err) {
        logger.error(err);
    }

    try {
        const result: Address[] = await geocoder.reverse({
            // accuracy: AccuracyEnum.HOUSE_NUMBER,
            lat: 40.74185,
            lon: -74,
            // language: 'en', // default
            // limit: 10, // default            
        });

        console.info('addresses', result);
    } catch (err) {
        console.error(err);
    }
})();
```

## Providers

Legend:

*   ✅ - Implemented / ready to use
*   🚫 - Provider doesn't support it
*   ⌛ - In progress
*   🆘 - Need help with implementation
*   🔍️ - Need to investigate if supported by provider

### Address

#### World

| Provider                                                                                  | Geocode | Reverse | Autocomplete | Place |
| :---------------------------------------------------------------------------------------- | :------ | :------ | :----------- | :---- |
| [Algolia Places](https://community.algolia.com/places/documentation.html)                 | 🆘      | 🆘️     | 🆘           | 🆘    |
| [ArcGIS Online](https://developers.arcgis.com/documentation/)                             | 🆘      | 🆘️     | 🔍️          | 🔍    |
| [Bing Maps](https://docs.microsoft.com/en-us/bingmaps/)                                   | 🆘      | 🆘️     | 🔍️          | 🔍    |
| [Geonames](http://www.geonames.org/export/web-services.html)                              | 🆘      | 🆘️     | 🔍️          | 🔍    |
| [Google Maps](https://developers.google.com/maps/documentation/geocoding/)                | ✅       | ✅       | 🆘           | 🆘    |
| [Here](https://developer.here.com/documentation/geocoder/topics/quick-start-geocode.html) | ✅       | ✅       | 🔍           | 🔍️   |
| [LocationIQ](https://locationiq.com/docs)                                                 | 🆘      | 🆘️     | 🔍️          | 🔍    |
| [Mapbox](https://docs.mapbox.com/api)                                                     | 🆘      | 🆘️     | 🔍️          | 🔍    |
| [MapQuest](http://developer.mapquest.com/web/products/dev-services/geocoding-ws)          | ✅       | ✅       | 🔍️          | 🔍️   |
| [Mapzen](https://www.mapzen.com/documentation/)                                           | 🆘      | 🆘️     | 🔍️          | 🔍    |
| [Nominatim](https://nominatim.org/release-docs/develop/)                                  | 🆘      | 🆘️     | 🔍️          | 🔍    |
| [OpenCage](https://opencagedata.com/api)                                                  | 🆘      | 🆘️     | 🔍️          | 🔍    |
| [Photon](http://doc-api.photonengine.com/en/PUN/current/)                                 | 🆘      | 🆘️     | 🔍️          | 🔍    |
| [PickPoint](https://pickpoint.io/)                                                        | 🆘      | 🆘️     | 🔍️          | 🔍    |
| [TomTom](https://developer.tomtom.com/maps-sdk-web/documentation)                         | 🆘      | 🆘️     | 🔍️          | 🔍    |
| [Yandex](https://tech.yandex.com/maps/)                                                   | 🆘      | 🆘️     | 🔍️          | 🔍    |

## Special Geocoders and Providers

### The ChainProvider

The `ChainProvider` is a special provider that takes a list of providers and
iterates over this list to get information. Note that it **stops** its iteration
when a provider returns a result.

```typescript
import Axios, { AxiosInstance } from 'axios';
import { Address, ChainProvider, GoogleMapsProvider, HereProvider, MapQuestProvider, ProviderAggregator } from '@goparrot/geocoder';

const axios: AxiosInstance = Axios.create({
    timeout: 5000,
});

const chainProvider: ChainProvider = new ChainProvider([
    new MapQuestProvider(axios, 'YOUR_API_KEY'),
    new HereProvider(axios, 'YOUR_APP_ID', 'YOUR_APP_CODE'),
]);

const geocoder: ProviderAggregator = new ProviderAggregator();

geocoder.registerProvider(chainProvider);

(async () => {
    try {
        const result: Address[] = await geocoder.geocode({
            address: '1158 E 89th St, Chicago, IL 60619, USA',
        });

        console.info(result);
    } catch (err) {
        console.error(err);
    }
})();
```

### The ProviderAggregator

The `ProviderAggregator` is used to register several providers so that you can
manualy decide which provider to use later on.

```typescript
import Axios, { AxiosInstance } from 'axios';
import { Address, ChainProvider, Geocoder, GoogleMapsProvider, HereProvider, ProviderAggregator, MapQuestProvider } from '@goparrot/geocoder';

const axios: AxiosInstance = Axios.create({
    timeout: 5000,
});

const geocoder: ProviderAggregator = new ProviderAggregator();

geocoder.registerProviders([
    new MapQuestProvider(axios, 'YOUR_API_KEY'),
    new HereProvider(axios, 'YOUR_APP_ID', 'YOUR_APP_CODE'),
]);

geocoder.registerProvider(new GoogleMapsProvider(axios, 'YOUR_API_KEY'));

(async () => {
    try {
        const result: Address[] = await geocoder.using(GoogleMapsProvider).geocode({
            address: '1158 E 89th St, Chicago, IL 60619, USA',
        });

        console.info(result);
    } catch (err) {
        console.error(err);
    }
})();
```

The `ProviderAggregator`'s API is fluent, meaning you can write:

```typescript
const result: Address[] = geocoder
    .registerProvider(new MyCustomProvider(axios))
    .using(MyCustomProvider)
    .geocode( ... );
```

The `using()` method allows you to choose the `provider` to use by its class name.
When you deal with multiple providers, you may want to choose one of them.  The
default behavior is to use the first one but it can be annoying.

## Versioning

Geocoder follows [Semantic Versioning](http://semver.org/).

## Contributing

See [`CONTRIBUTING`](https://github.com/go-parrot/geocoder/blob/master/CONTRIBUTING.md#contributing) file.

## Unit Tests

In order to run the test suite, install the development dependencies:

    $ npm i

Then, run the following command:

    $ npm test

## Background

Inspired by [geocoder-php/geocoder](https://github.com/geocoder-php/Geocoder)

## License

Geocoder is [MIT licensed](LICENSE).
