[![Build Status](https://github.com/goparrot/geocoder/workflows/CI/badge.svg?branch=master)](https://github.com/goparrot/geocoder/actions?query=branch%3Amaster+event%3Apush+workflow%3ACI)
[![Coverage Status](https://coveralls.io/repos/github/goparrot/geocoder/badge.svg?branch=master)](https://coveralls.io/github/goparrot/geocoder?branch=master)
[![NPM version](https://img.shields.io/npm/v/@goparrot/geocoder)](https://www.npmjs.com/package/@goparrot/geocoder)
[![Greenkeeper badge](https://badges.greenkeeper.io/goparrot/geocoder.svg)](https://greenkeeper.io/)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

# Geocoder

<p align="center">
  <a href="https://github.com/goparrot/geocoder" target="blank"><img src="https://upload.wikimedia.org/wikipedia/commons/7/72/OpenStreetMap-Logo-2006.svg" width="354" alt="Geocoder Logo" /></a>
</p>

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

    $ npm i @goparrot/geocoder reflect-metadata axios

<sub>⚠️️ Each reflect-metadata installation has its own metadata storage, from which it reads and writes from.
So if you had a project with multiple reflect-metadata packages, it could happen that in one file you write metadata in one reflect-metadata package and in another file you’re trying to retrieve this metadata accidently from the other reflect-metadata package, which of course doesn’t exist there.</sub>

## Usage

### Minimal

In the code snippet below we use Google provider.

```typescript
import 'reflect-metadata';
import { Distance, Location, Geocoder, GoogleMapsProvider, Suggestion } from '@goparrot/geocoder';
import axios, { AxiosInstance } from 'axios';

const axios: AxiosInstance = axios.create();

const provider: GoogleMapsProvider = new GoogleMapsProvider(axios, 'YOUR_API_KEY');

const geocoder: Geocoder = new Geocoder(provider);

(async () => {
    try {
        const locations: Location[] = await geocoder.geocode({
            address: '1158 E 89th St, Chicago, IL 60619, USA',
        });

        console.info({ locations });
    } catch (err) {
        console.error(err);
    }

    try {
        const locations: Location[] = await geocoder.reverse({
            lat: 41.7340186,
            lon: -87.5960762,
        });

        console.info({ locations });
    } catch (err) {
        console.error(err);
    }

    try {
        const suggestions: Suggestion[] = await geocoder.suggest({
            address: '1158 E 89th St',
        });

        console.info({ suggestions });
    } catch (err) {
        console.error(err);
    }

    try {
        const location: Location = await geocoder.placeDetails({
            placeId: 'SOME_GOOGLE_PLACE_ID',
        });

        console.info({ location });
    } catch (err) {
        console.error(err);
    }

    try {
        const distance: Distance = await geocoder.distance({
            from: {
                lat: 40.871994,
                lon: -74.425937,
            },
            to: {
                lat: 40.863008,
                lon: -74.385286,
            },
            mode: TravelModeEnum.DRIVING,
        });

        console.info({ distance });
    } catch (err) {
        console.error(err);
    }
})();
```

### Advanced

In the code snippet below we use Here provider.

```typescript
import 'reflect-metadata';
import { Location, Geocoder, HereProvider, LoggerInterface } from '@goparrot/geocoder';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// You can use any logger that fits the LoggerInterface
const logger: LoggerInterface = console;

// Set timeout for all requests
const axios: AxiosInstance = axios.create({
    timeout: 5000,
});

// You can log all requests
axios.interceptors.request.use((request: AxiosRequestConfig) => {
    logger.debug('api request', request);

    return request;
});

// You can log all responses
axios.interceptors.response.use((response: AxiosResponse): AxiosResponse => {
    logger.debug(`api response ${response.status}`, response.data);

    return response;
});

/**
 * Caching adapter for axios. Store request results in a configurable store to prevent unneeded network requests.
 * @link {https://github.com/RasCarlito/axios-cache-adapter}
 */

const provider: HereProvider = new HereProvider(axios, 'YOUR_APP_ID', 'YOUR_APP_CODE');

const geocoder: Geocoder = new Geocoder(provider);
geocoder.setLogger(logger);

(async () => {
    try {
        const locations: Location[] = await geocoder.geocode({
            // accuracy: AccuracyEnum.HOUSE_NUMBER,
            address: '1158 E 89th St, Chicago, IL 60619, USA',
            countryCode: 'US',
            // postalCode: '60619',
            // state: 'Illinois',
            // stateCode: 'IL',
            // city: 'Chicago',
            // language: 'en', // default
            // limit: 5, // default
            // fillMissingQueryProperties: true, // default
            withRaw: true, // default false
        });

        logger.info('locations', { locations });
    } catch (err) {
        logger.error(err);
    }

    try {
        const locations: Location[] = await geocoder.reverse({
            // accuracy: AccuracyEnum.HOUSE_NUMBER,
            lat: 41.7340186,
            lon: -87.5960762,
            countryCode: 'US',
            // language: 'en', // default
            // limit: 5, // default
            // withRaw: false, // default
        });

        console.info('locations', { locations });
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

### Location

#### World

| Provider                                                                                  | Geocode | Reverse | Suggest | Place Details | Distance |
| :---------------------------------------------------------------------------------------- | :------ | :------ | :------ | :------------ | :------- |
| [Algolia Places](https://community.algolia.com/places/documentation.html)                 | 🆘      | 🆘️     | 🆘      | 🆘            | 🔍       |
| [ArcGIS Online](https://developers.arcgis.com/documentation/)                             | ✅      | ✅      | ✅️     | ✅            | 🔍       |
| [Bing Maps](https://docs.microsoft.com/en-us/bingmaps/)                                   | 🆘      | 🆘️     | 🔍️     | 🆘            | 🔍       |
| [Geonames](http://www.geonames.org/export/web-services.html)                              | 🆘      | 🆘️     | 🔍️     | 🆘            | 🔍       |
| [Google Maps](https://developers.google.com/maps/documentation/geocoding/)                | ✅      | ✅      | ✅      | ✅            | ✅       |
| [Here](https://developer.here.com/documentation/geocoder/topics/quick-start-geocode.html) | ✅      | ✅      | ✅      | ✅            | 🔍       |
| [LocationIQ](https://locationiq.com/docs)                                                 | 🆘      | 🆘️     | 🔍️     | 🔍            | 🔍       |
| [Mapbox](https://docs.mapbox.com/api)                                                     | ✅      | ✅      | 🔍️     | 🚫            | 🔍       |
| [MapQuest](http://developer.mapquest.com/web/products/dev-services/geocoding-ws)          | ✅      | ✅      | 🚫️     | 🚫            | 🔍       |
| [Mapzen](https://www.mapzen.com/documentation/)                                           | 🆘      | 🆘️     | 🔍️     | 🔍            | 🔍       |
| [Nominatim](https://nominatim.org/release-docs/develop/)                                  | 🆘      | 🆘️     | 🔍️     | 🔍            | 🔍       |
| [OpenCage](https://opencagedata.com/api)                                                  | 🆘      | 🆘️     | 🔍️     | 🔍            | 🔍       |
| [Photon](http://doc-api.photonengine.com/en/PUN/current/)                                 | 🆘      | 🆘️     | 🔍️     | 🔍            | 🔍       |
| [PickPoint](https://pickpoint.io/)                                                        | 🆘      | 🆘️     | 🔍️     | 🔍            | 🔍       |
| [TomTom](https://developer.tomtom.com/maps-sdk-web/documentation)                         | 🆘      | 🆘️     | 🔍️     | 🔍            | 🔍       |
| [Yandex](https://tech.yandex.com/maps/)                                                   | 🆘      | 🆘️     | 🔍️     | 🔍            | 🆘️      |

## Special Geocoders and Providers

### The ChainProvider

The `ChainProvider` is a special provider that takes a list of providers and
iterates over this list to get information. Note that it **stops** its iteration
when a provider returns a result.

```typescript
import 'reflect-metadata';
import axios, { AxiosInstance } from 'axios';
import { Location, ChainProvider, HereProvider, MapQuestProvider, ProviderAggregator } from '@goparrot/geocoder';

const axios: AxiosInstance = axios.create({
    timeout: 5000,
});

const chainProvider: ChainProvider = new ChainProvider([new MapQuestProvider(axios, 'YOUR_API_KEY'), new HereProvider(axios, 'YOUR_APP_ID', 'YOUR_APP_CODE')]);

const geocoder: ProviderAggregator = new ProviderAggregator([chainProvider]);

(async () => {
    try {
        const locations: Location[] = await geocoder.geocode({
            address: '1158 E 89th St, Chicago, IL 60619, USA',
        });

        console.info({ locations });
    } catch (err) {
        console.error(err);
    }
})();
```

### The ProviderAggregator

The `ProviderAggregator` is used to register several providers so that you can
manualy decide which provider to use later on.

```typescript
import 'reflect-metadata';
import axios, { AxiosInstance } from 'axios';
import { Location, GoogleMapsProvider, HereProvider, ProviderAggregator, MapQuestProvider } from '@goparrot/geocoder';

const axios: AxiosInstance = axios.create({
    timeout: 5000,
});

const geocoder: ProviderAggregator = new ProviderAggregator([
    new MapQuestProvider(axios, 'YOUR_API_KEY'),
    new HereProvider(axios, 'YOUR_APP_ID', 'YOUR_APP_CODE'),
]);

geocoder.registerProvider(new GoogleMapsProvider(axios, 'YOUR_API_KEY'));

(async () => {
    try {
        const locations: Location[] = await geocoder.using(GoogleMapsProvider).geocode({
            address: '1158 E 89th St, Chicago, IL 60619, USA',
        });

        console.info({ locations });
    } catch (err) {
        console.error(err);
    }
})();
```

The `ProviderAggregator`'s API is fluent, meaning you can write:

```typescript
const locations: Location[] = geocoder.registerProvider(new MyCustomProvider(axios)).using(MyCustomProvider).geocode({
    // ...
});
```

The `using()` method allows you to choose the `provider` to use by its class name.
When you deal with multiple providers, you may want to choose one of them. The
default behavior is to use the first one, but it can be annoying.

## Versioning

Geocoder follows [Semantic Versioning](http://semver.org/).

## Contributing

See [`CONTRIBUTING`](https://github.com/goparrot/geocoder/blob/master/CONTRIBUTING.md#contributing) file.

## Unit Tests

In order to run the test suite, install the development dependencies:

    $ npm i

Then, run the following command:

    $ npm run coverage

## Background

Inspired by [geocoder-php/geocoder](https://github.com/geocoder-php/Geocoder)

## License

Geocoder is [MIT licensed](LICENSE).
