# Obsidian Sortable

[![Build](https://github.com/alexandru-dinu/obsidian-sortable/actions/workflows/main.yml/badge.svg)](https://github.com/alexandru-dinu/obsidian-sortable/actions/workflows/main.yml)
[![Discussions](https://img.shields.io/badge/discussions-welcome-blueviolet)](https://github.com/alexandru-dinu/obsidian-sortable/discussions)

Sortable is a plugin for [Obsidian](https://obsidian.md) that aims to offer [Wikipedia-like](https://en.wikipedia.org/wiki/Help:Sorting#Example) sortable tables. Sorting is done with respect to a table header, on click:
- first click: ascending order
- second click: descending order
- third click: default order

## Features
<details>
<summary>Demo</summary>

https://user-images.githubusercontent.com/14110183/128138299-fd2a1bb2-6f87-4b50-b306-17550d8adc64.mov

</details>

- Sorting numerical and string data types. Custom comparator functions are part of the roadmap (see this [issue](https://github.com/alexandru-dinu/obsidian-sortable/issues/12)).
- No altering of the markdown source code. Sorting is done solely in preview mode by rearranging rows (i.e. `tr` elements).
- No dependencies.

## Usage
Download the files from the latest [release](https://github.com/alexandru-dinu/obsidian-sortable/releases),
move them to `vault/.obsidian/plugins/obsidian-sortable` and enable "Sortable" from the Obsidian "Community plugins" settings.

## Roadmap
Please note that the development is still in a beta stage, with more feature to be implemented.
Check the [project's roadmap](https://github.com/alexandru-dinu/obsidian-sortable/projects/1) for updates.
