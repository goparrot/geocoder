<a name="2.2.0"></a>

# [2.2.0](https://github.com/goparrot/geocoder/compare/v2.1.0...v2.2.0) (2019-09-05)

### Bug Fixes

*   **google suggest:** allow `premise` type as HOUSE_NUMBER accuracy ([9eaab20](https://github.com/goparrot/geocoder/commit/9eaab20))

### Features

*   **suggest:** add suggestion accuracy for `arcgis` and `here` providers ([6e898e3](https://github.com/goparrot/geocoder/commit/6e898e3))

<a name="2.1.0"></a>

# [2.1.0](https://github.com/goparrot/geocoder/compare/v2.0.0...v2.1.0) (2019-09-02)

### Features

*   **google suggest:** add suggest accuracy ([027691e](https://github.com/goparrot/geocoder/commit/027691e))

<a name="2.0.0"></a>

# [2.0.0](https://github.com/goparrot/geocoder/compare/v1.0.6...v2.0.0) (2019-08-27)

### Bug Fixes

*   **dependencies:** fix dependencies ([600e2b7](https://github.com/goparrot/geocoder/commit/600e2b7))

### BREAKING CHANGES

*   **dependencies:** axios, class-transformer and class-validator removed from dependencies and moved to peerDependencies

<a name="1.0.6"></a>

## [1.0.6](https://github.com/goparrot/geocoder/compare/v1.0.5...v1.0.6) (2019-07-22)

<a name="1.0.5"></a>

## [1.0.5](https://github.com/goparrot/geocoder/compare/v1.0.4...v1.0.5) (2019-07-20)

<a name="1.0.4"></a>

## [1.0.4](https://github.com/goparrot/geocoder/compare/v1.0.3...v1.0.4) (2019-07-15)

<a name="1.0.3"></a>

## [1.0.3](https://github.com/goparrot/geocoder/compare/v1.0.2...v1.0.3) (2019-06-21)

<a name="1.0.2"></a>

## [1.0.2](https://github.com/goparrot/geocoder/compare/v1.0.1...v1.0.2) (2019-06-10)

<a name="1.0.1"></a>

## [1.0.1](https://github.com/goparrot/geocoder/compare/v1.0.0...v1.0.1) (2019-05-08)

### Bug Fixes

*   **placeDetails:** fix PlaceDetailsQuery interface ([9ad6ec7](https://github.com/goparrot/geocoder/commit/9ad6ec7))

<a name="1.0.0"></a>

# [1.0.0](https://github.com/goparrot/geocoder/compare/v0.10.0...v1.0.0) (2019-05-03)

### Bug Fixes

*   **test:** fix google integration test ([21aa9b3](https://github.com/goparrot/geocoder/commit/21aa9b3))

<a name="0.10.0"></a>

# [0.10.0](https://github.com/goparrot/geocoder/compare/v0.9.1...v0.10.0) (2019-04-12)

### Features

*   **geocoder:** add placeDetails method ([10ef077](https://github.com/goparrot/geocoder/commit/10ef077))
*   **provider here:** add suggest method ([1c05fe9](https://github.com/goparrot/geocoder/commit/1c05fe9))
*   **provider map-quest:** add suggest method ([cff7600](https://github.com/goparrot/geocoder/commit/cff7600))

<a name="0.9.1"></a>

## [0.9.1](https://github.com/goparrot/geocoder/compare/v0.9.0...v0.9.1) (2019-03-25)

### Bug Fixes

*   **command geocode:** cannot read property 'countryCode' of undefined ([ecd79f4](https://github.com/goparrot/geocoder/commit/ecd79f4))

<a name="0.9.0"></a>

# [0.9.0](https://github.com/goparrot/geocoder/compare/v0.8.1...v0.9.0) (2019-03-25)

### Features

*   **geocode query:** add exactMatch option ([9480892](https://github.com/goparrot/geocoder/commit/9480892))
*   **geocoder suggest:** add suggest method ([d4cb26c](https://github.com/goparrot/geocoder/commit/d4cb26c))

<a name="0.8.1"></a>

## [0.8.1](https://github.com/goparrot/geocoder/compare/v0.8.0...v0.8.1) (2019-03-25)

### Bug Fixes

*   **provider arcgis:** wrong reverse url ([e0e3a6d](https://github.com/goparrot/geocoder/commit/e0e3a6d))

<a name="0.8.0"></a>

# [0.8.0](https://github.com/goparrot/geocoder/compare/v0.7.1...v0.8.0) (2019-03-20)

### Features

*   **query:** no raw data is returned by default ([6f708cd](https://github.com/goparrot/geocoder/commit/6f708cd))

### BREAKING CHANGES

*   **query:** in the previous version, the raw data was returned by default

<a name="0.7.1"></a>

## [0.7.1](https://github.com/goparrot/geocoder/compare/v0.7.0...v0.7.1) (2019-03-19)

### Bug Fixes

*   **location-builder:** fix types ([bc4cb43](https://github.com/goparrot/geocoder/commit/bc4cb43))

<a name="0.7.0"></a>

# [0.7.0](https://github.com/goparrot/geocoder/compare/v0.6.0...v0.7.0) (2019-03-19)

### Features

*   **provider:** abstract logic for provider's actions ([d705119](https://github.com/goparrot/geocoder/commit/d705119))
*   **provider:** add raw data to the Location object ([e65e652](https://github.com/goparrot/geocoder/commit/e65e652))

<a name="0.6.0"></a>

# [0.6.0](https://github.com/goparrot/geocoder/compare/v0.5.0...v0.6.0) (2019-03-13)

### Features

*   **provider:** add ArcgisProvider ([4d7cbba](https://github.com/goparrot/geocoder/commit/4d7cbba))

<a name="0.5.0"></a>

# [0.5.0](https://github.com/goparrot/geocoder/compare/v0.4.0...v0.5.0) (2019-03-06)

### Bug Fixes

*   **changelog:** fix changelog for v0.3.0 and v0.4.0 ([ab1b826](https://github.com/goparrot/geocoder/commit/ab1b826))

### Code Refactoring

*   chagne class name from Adress to Location ([7225728](https://github.com/goparrot/geocoder/commit/7225728))

### BREAKING CHANGES

*   chagne class name from Adress to Location and AddressBuilder to LocationBuilder

<a name="0.4.0"></a>

# [0.4.0](https://github.com/goparrot/geocoder/compare/v0.3.0...v0.4.0) (2019-03-05)

### Features

*   **decider:** rm CircularDecider, add StatefulDecider, StatelessDecider ([46c8455](https://github.com/goparrot/geocoder/commit/46c8455))

### BREAKING CHANGES

*   **decider:** ProviderAggregator by default works with StatefulDecider (before was
    CircularDecider)

<a name="0.3.0"></a>

# [0.3.0](https://github.com/goparrot/geocoder/compare/v0.2.0...v0.3.0) (2019-03-05)

### Features

*   **provider:** add StatefulChainProvider ([d038545](https://github.com/goparrot/geocoder/commit/d038545))

<a name="0.2.0"></a>

# [0.2.0](https://github.com/goparrot/geocoder/compare/0.1.1...v0.2.0) (2019-03-04)

### Features

*   **provider:** add provider.maxAccuracy ([2516ab4](https://github.com/goparrot/geocoder/commit/2516ab4)), closes [#3](https://github.com/goparrot/geocoder/issues/3)

### BREAKING CHANGES

*   **provider:** contains a breaking change for MapQuestProvider and for general business logic

<a name="0.1.1"></a>

## [0.1.1](https://github.com/goparrot/geocoder/compare/d9c2391...0.1.1) (2019-03-02)

### Bug Fixes

*   add \*.d.ts to npm ([7d37146](https://github.com/goparrot/geocoder/commit/7d37146))

### Features

*   initial version ([d9c2391](https://github.com/goparrot/geocoder/commit/d9c2391))
