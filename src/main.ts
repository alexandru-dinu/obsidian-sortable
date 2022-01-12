import { Plugin } from 'obsidian';
import { onHeadClick, TTableStates, AttributeName, resetTable } from 'src/sortable';

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
        // iterate through all table elements in the document
        // and remove the table attribute
        const tables = Array.from(document.querySelectorAll('table'));
        for (const table of tables) {
            const tableID: string | null = table.getAttribute(AttributeName.table);

            // this table is in the default state
            if (tableID === null) {
                continue;
            }

            const state = this.tableStates[tableID];

            // restore original order
            resetTable(state, table.querySelector('tbody'));

            // remove "sortable" attribute
            table.removeAttribute(AttributeName.table);

            // remove tableHeader attribute
            const th = table.querySelector(`thead th:nth-child(${state.columnIdx + 1})`);
            th.removeAttribute(AttributeName.tableHeader);

            delete this.tableStates[tableID];
        }

        // delete remaining keys in the tableStates object
        // ideally, this should not be necessary, see (#16)
        const remKeys = Object.keys(this.tableStates);
        for (const key of remKeys) {
            delete this.tableStates[key];
        }

        console.log('Sortable: unloaded plugin.');
    }

    async loadSettings(): Promise<void> {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings(): Promise<void> {
        await this.saveData(this.settings);
    }
}
