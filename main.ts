import { Plugin } from 'obsidian';
import { onHeadClick, TableState } from 'sortable';

interface SortableSettings {
    mySetting: string;
}

const DEFAULT_SETTINGS: SortableSettings = {
    mySetting: 'default'
}

export default class SortablePlugin extends Plugin {
    settings: SortableSettings;
    tableStates: { [key: string]: TableState };

    async onload() {
        console.log('Sortable: loading plugin...');

        await this.loadSettings();

        this.tableStates = {};

        this.registerDomEvent(document, 'click', (ev: MouseEvent) => onHeadClick(ev, this.tableStates));

        console.log('Sortable: loaded plugin.');
    }

    onunload() {
        // TODO: delete tableStates

        console.log('Sortable: unloaded plugin.');
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}