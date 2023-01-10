# Changelog

All notable changes to this project will be documented in this file.
See also the [releases](https://github.com/alexandru-dinu/obsidian-sortable/releases) page.

## [0.3.0] - 2023-01-10
### Added
- Introduce sorting by ISO dates ([regex](https://regex101.com/r/RfMAcx/1)).
    - Mandatory format is `YYYY-MM-DD`, time is optional.

## [0.2.6] - 2022-08-06
### Fixed
- Don't show up-down arrows for the default table state; only show up / down arrows for ascending / descending sorting.

## [0.2.5] - 2022-05-03
### Fixed
- Use `Intl.Collator` for natural sorting of strings.

## [0.2.4] - 2022-03-18
### Fixed
- Fix arrow rendering for Dataview tables in live preview mode.

## [0.2.3] - 2022-03-16
### Added
- Introduce support for sorting Dataview tables in live preview mode.

## [0.2.2] - 2022-01-24
### Fixed
- Address suggestions from this [PR](https://github.com/obsidianmd/obsidian-releases/pull/727#issuecomment-1019552433).

## [0.2.1] - 2022-01-12
### Fixed
- Clear plugin state on unloading.

## [0.2.0] - 2021-07-31
### Added
- Reset default table order on third click (same as Wikipedia), i.e. ascending -> descending -> reset.

## [0.1.1] - 2021-04-20
### Fixed
- Arrows now respect the light / dark theme.

## [0.1.0] - 2021-04-16
### Added
- Sort tables in ascending & descending order.

[0.3.0]: https://github.com/alexandru-dinu/obsidian-sortable/compare/0.2.6...0.3.0
[0.2.6]: https://github.com/alexandru-dinu/obsidian-sortable/compare/0.2.5...0.2.6
[0.2.5]: https://github.com/alexandru-dinu/obsidian-sortable/compare/0.2.4...0.2.5
[0.2.4]: https://github.com/alexandru-dinu/obsidian-sortable/compare/0.2.3...0.2.4
[0.2.3]: https://github.com/alexandru-dinu/obsidian-sortable/compare/0.2.2...0.2.3
[0.2.2]: https://github.com/alexandru-dinu/obsidian-sortable/compare/0.2.1...0.2.2
[0.2.1]: https://github.com/alexandru-dinu/obsidian-sortable/compare/0.2.0...0.2.1
[0.2.0]: https://github.com/alexandru-dinu/obsidian-sortable/compare/0.1.1...0.2.0
[0.1.1]: https://github.com/alexandru-dinu/obsidian-sortable/compare/0.1.0...0.1.1
[0.1.0]: https://github.com/alexandru-dinu/obsidian-sortable/compare/cc6ee87...0.1.0
