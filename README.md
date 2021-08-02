# Obsidian Sortable

[![Build](https://github.com/alexandru-dinu/obsidian-sortable/actions/workflows/main.yml/badge.svg)](https://github.com/alexandru-dinu/obsidian-sortable/actions/workflows/main.yml)
[![Discussions](https://img.shields.io/badge/discussions-welcome-blueviolet)](https://github.com/alexandru-dinu/obsidian-sortable/discussions)

<details>
<summary>Demo</summary>

https://user-images.githubusercontent.com/14110183/128138299-fd2a1bb2-6f87-4b50-b306-17550d8adc64.mov

</details>

Sortable is a plugin for [Obsidian](https://obsidian.md) that aims to offer [Wikipedia-like](https://en.wikipedia.org/wiki/Help:Sorting#Example) sortable tables. Sorting is done with respect to a table header, on click:
- first click: ascending order
- second click: descending order
- third click: default order

Currently, the plugin supports sorting numerical and string data types. Custom comparator functions are part of the roadmap (see this [issue](https://github.com/alexandru-dinu/obsidian-sortable/issues/12)).

## Usage
Please note that the development is currently in beta stage. If you want to test the plugin, you can download the zip from the [latest release](https://github.com/alexandru-dinu/obsidian-sortable/releases), unzip the contents to `/path/to/vault/.obsidian/plugins/obsidian-sortable` and enable it from the Obsidian settings.

## Features
- Minimal third-party dependencies: [uuid](https://www.npmjs.com/package/uuid) for uniquely identifying tables.
- No altering of the markdown source code. Sorting is done solely in preview mode by rearranging rows (i.e. `tr` elements).
- [Upcoming features](https://github.com/alexandru-dinu/obsidian-sortable/issues?q=is%3Aissue+is%3Aopen+label%3Afeature).
