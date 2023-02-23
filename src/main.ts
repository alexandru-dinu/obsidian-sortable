import { Plugin } from "obsidian";
import { onHeadClick, TTableStates, AttributeName, resetTable } from "src/sortable";

export default class SortablePlugin extends Plugin {
    tableStates: TTableStates;

    async onload(): Promise<void> {
        console.log("Sortable: loading plugin...");

        this.tableStates = new WeakMap();

        this.registerDomEvent(window, "click", (ev: MouseEvent) =>
            onHeadClick(ev, this.tableStates)
        );

        console.log("Sortable: loaded plugin.");
    }

    onunload(): void {
        // get all HTMLTableElements present in the map and reset their state
        const tables = Array.from(document.querySelectorAll("table"));

        for (const table of tables) {
            if (this.tableStates.has(table)) {
                const state = this.tableStates.get(table);

                resetTable(state, table.querySelector("tbody"));

                const th = table.querySelector(`thead th:nth-child(${state.columnIdx + 1})`);
                th.removeAttribute(AttributeName.tableHeader);

                this.tableStates.delete(table);
            }
        }

        delete this.tableStates;

        console.log("Sortable: unloaded plugin.");
    }
}
