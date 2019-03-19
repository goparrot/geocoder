## [0.7.1](https://github.com/goparrot/geocoder/compare/v0.7.0...v0.7.1) (2019-03-19)

### Bug Fixes

*   **location-builder:** fix types ([bc4cb43](https://github.com/goparrot/geocoder/commit/bc4cb43))

# [0.7.0](https://github.com/goparrot/geocoder/compare/v0.6.0...v0.7.0) (2019-03-19)

### Features

*   **provider:** abstract logic for provider's actions ([d705119](https://github.com/goparrot/geocoder/commit/d705119))
*   **provider:** add raw data to the Location object ([e65e652](https://github.com/goparrot/geocoder/commit/e65e652))

# [0.6.0](https://github.com/goparrot/geocoder/compare/v0.5.0...v0.6.0) (2019-03-13)

### Features

*   **provider:** add ArcgisProvider ([4d7cbba](https://github.com/goparrot/geocoder/commit/4d7cbba))

# [0.5.0](https://github.com/goparrot/geocoder/compare/v0.4.0...v0.5.0) (2019-03-06)

### Bug Fixes

*   **changelog:** fix changelog for v0.3.0 and v0.4.0 ([ab1b826](https://github.com/goparrot/geocoder/commit/ab1b826))

### Code Refactoring

*   chagne class name from Adress to Location ([7225728](https://github.com/goparrot/geocoder/commit/7225728))

### BREAKING CHANGES

*   chagne class name from Adress to Location and AddressBuilder to LocationBuilder

# [0.4.0](https://github.com/goparrot/geocoder/compare/v0.3.0...v0.4.0) (2019-03-05)

### Features

*   **decider:** rm CircularDecider, add StatefulDecider, StatelessDecider ([46c8455](https://github.com/goparrot/geocoder/commit/46c8455))

### BREAKING CHANGES

*   **decider:** ProviderAggregator by default works with StatefulDecider (before was
    CircularDecider)

# [0.3.0](https://github.com/goparrot/geocoder/compare/v0.2.0...v0.3.0) (2019-03-05)

### Features

*   **provider:** add StatefulChainProvider ([d038545](https://github.com/goparrot/geocoder/commit/d038545))

# [0.2.0](https://github.com/goparrot/geocoder/compare/0.1.1...v0.2.0) (2019-03-04)

### Features

*   **provider:** add provider.maxAccuracy ([2516ab4](https://github.com/goparrot/geocoder/commit/2516ab4)), closes [#3](https://github.com/goparrot/geocoder/issues/3)

### BREAKING CHANGES

*   **provider:** contains a breaking change for MapQuestProvider and for general business logic

## [0.1.1](https://github.com/goparrot/geocoder/compare/d9c2391...0.1.1) (2019-03-02)

### Bug Fixes

*   add \*.d.ts to npm ([7d37146](https://github.com/goparrot/geocoder/commit/7d37146))

### Features

*   initial version ([d9c2391](https://github.com/goparrot/geocoder/commit/d9c2391))
