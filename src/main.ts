import { Plugin } from 'obsidian';
import { onHeadClick, TTableStates } from 'src/sortable';

interface SortableSettings {
    mySetting: string;
}

const DEFAULT_SETTINGS: SortableSettings = {
    mySetting: 'default'
};

export default class SortablePlugin extends Plugin {
    settings: SortableSettings;
    tableStates: TTableStates;

    async onload(): Promise<void> {
        console.log('Sortable: loading plugin...');

        await this.loadSettings();

        this.tableStates = {};

        this.registerDomEvent(document, 'click', (ev: MouseEvent) => onHeadClick(ev, this.tableStates));

        console.log('Sortable: loaded plugin.');
    }

    onunload(): void {
        // TODO: delete tableStates

        console.log('Sortable: unloaded plugin.');
    }

    async loadSettings(): Promise<void> {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings(): Promise<void> {
        await this.saveData(this.settings);
    }
}
