import {
    App, Plugin, PluginSettingTab, Setting
} from 'obsidian';

interface SortableSettings {
    mySetting: string;
}

const DEFAULT_SETTINGS: SortableSettings = {
    mySetting: 'default'
}


export default class SortablePlugin extends Plugin {
    settings: SortableSettings;

    classNames: Array<string> = ["header-sort-up", "header-sort-down"];

    compareFn(idx: number, asc: boolean): any {
        return (a: any, b: any) => {
            const v1 = this.getCellValue(asc ? a : b, idx);
            const v2 = this.getCellValue(asc ? b : a, idx);

            if (typeof (v1) === 'number' && typeof (v2) === 'number') {
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

            const th = htmlEl.closest('thead th');
            if (th == null) { return; }

            const table = htmlEl.closest('table');
            const tbody = table.querySelector('tbody');
            const thArray = Array.from(th.parentNode.children);
            const thIdx = thArray.indexOf(th);

            // all other th's are reset
            thArray.forEach((th, i) => {
                if (i != thIdx) {
                    th.removeAttribute("class");
                }
            });

            // set clicked th class
            th.className = this.classNames[
                (this.classNames.indexOf(th.className) + 1) % this.classNames.length
            ];

            const ascending = th.className === "header-sort-up";

            Array.from(tbody.querySelectorAll('tr:nth-child(n)'))
                .sort(this.compareFn(thIdx, ascending))
                .forEach(tr => tbody.appendChild(tr));
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
