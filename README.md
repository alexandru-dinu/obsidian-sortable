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

- Supported data types: numbers, strings, [ISO dates](https://regex101.com/r/RfMAcx/1). Custom comparator functions are part of the roadmap (see this [issue](https://github.com/alexandru-dinu/obsidian-sortable/issues/12)).
- No altering of the markdown source code. Sorting is done by rearranging table rows (i.e. `tr` elements).
- No dependencies.

Please note that the development is still in a beta stage.
Check the [project's roadmap](https://github.com/alexandru-dinu/obsidian-sortable/projects/1) for updates.

## Installation
Search for "Sortable" in Obsidian's community plugins (`Settings > Community plugins > Browse`), install, then enable.

Alternatively, you can download the required files from the latest
[release](https://github.com/alexandru-dinu/obsidian-sortable/releases),
move them to `vault/.obsidian/plugins/obsidian-sortable` and enable "Sortable" from the "Community plugins" settings.

## Disclaimer
I built Sortable mostly to fulfill my personal needs and I appreciate that now many people find it useful.
However, given the plethora of plugins, themes and tweaks for Obsidian, numerous bugs may occur when using Sortable in various contexts.
These may range from [UI inconsistencies](https://github.com/alexandru-dinu/obsidian-sortable/discussions/23#discussioncomment-2376620) to [inability to sort in certain states](https://github.com/alexandru-dinu/obsidian-sortable/issues/22).
While I try to address most of the issues, please understand that I cannot accommodate every request,
mostly because I do not use many Obsidian plugins and quirks myself.

Thank you!
