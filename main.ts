import {
	App, Plugin, PluginSettingTab, Setting
} from 'obsidian';

interface SortableSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: SortableSettings = {
	mySetting: 'default'
}

// TODO
// - (?) arrows should be displayed only on "sortable" tables => "this.asc"
// - (!) want the event to happen only when clicking on arrows
// https://javascript.plainenglish.io/easy-table-sorting-with-javascript-370d8d97cad8
// https://stackoverflow.com/questions/14267781/sorting-html-table-with-javascript

export default class SortablePlugin extends Plugin {
	settings: SortableSettings;
	asc: boolean = true;

	compareFn(idx: number, asc: boolean): any {
		return (a, b) => {
			const v1 = this.getCellValue(asc ? a : b, idx);
			const v2 = this.getCellValue(asc ? b : a, idx);

			if (typeof (v1) == 'number' && typeof (v2) == 'number') {
				return v1 - v2;
			}
			else {
				return v1.toString().localeCompare(v2.toString());
			}
		}
	}

	tryParseFloat(x: string): string | number {
		const y = parseFloat(x);
		return isNaN(y) ? x : y;
	}

	getCellValue(tr: any, idx: number): string | number {
		return this.tryParseFloat(tr.children[idx].innerText || tr.children[idx].textContent);
	}

	async onload() {
		console.log('loading sortable plugin');

		await this.loadSettings();

		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			const htmlEl = (<HTMLInputElement>evt.target);

			const table = htmlEl.closest('table');
			if (table == null) { return; }

			const th = htmlEl.closest('thead th');
			if (th == null) { return; }

			const tbody = table.querySelector('tbody');
			const thIdx = Array.from(th.parentNode.children).indexOf(th);

			console.log('Clicked on', th.textContent, thIdx, 'asc:', this.asc);

			Array.from(tbody.querySelectorAll('tr:nth-child(n)'))
				.sort(this.compareFn(thIdx, this.asc))
				.forEach(tr => tbody.appendChild(tr));

			this.asc = !this.asc;
		});
	}

	onunload() {
		console.log('unloading plugin');
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SortableSettingTab extends PluginSettingTab {
	plugin: SortablePlugin;

	constructor(app: App, plugin: SortablePlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		let { containerEl } = this;

		containerEl.empty();

		containerEl.createEl('h2', { text: 'Sortable Plugin - Settings' });

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Hit me')
				.setValue('')
				.onChange(async (value) => {
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
