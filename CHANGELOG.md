# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- Regionalization with VTEX white labels on requests

## [2.4.0] - 2020-06-22
### Added
- New param `showOnlyAvailable` to `chaordicRecommendations` query.

## [2.3.0] - 2020-05-26
### Added
- New field `refreshReferenceUrl` to `chaordicRecommendations` query.

## [2.2.0] - 2020-05-22
### Added
- New parameter `category` to `chaordicRecommendations` query.

## [2.1.0] - 2020-05-18
### Added
- New parameter `userId` to `chaordicRecommendations` query.

## [2.0.0] - 2020-05-05
### Changed
- Type of parameter `filter` of the `searchProducts` query from `String` to `[String]`.

### Added
- New parameter `productFormat` to `searchProducts` query.
- New field `template` to `ChaordicSearchProductImages`.
- New fields: `brand`, `categories`, `tags`, `created`, `selectedSku`, and `skus` to `ChaordicSearchProduct`.

### Fixed
- Search query error if `filter` param isn't filled
- Use `X-Vtex-Use-Https` headers

## [1.0.0] - 2020-04-14
### Added
- `oldPrice` on Product's Sku types
### Changed
- Params `salesChannel` on all requests
### Fixed
- Change product's details to scalar types

## [0.1.0] - 2020-04-07
### Added
- Dummy and homologation params on Search and Recommendation
### Fixed
- SecretKeys decoding from VBase

## [0.0.3] - 2020-03-30
### Fixed
- Changed Search's API domain to the new one 
- Organize GraphQL schema adding the types file

## [0.0.2] - 2019

## [0.0.1] - 2019
