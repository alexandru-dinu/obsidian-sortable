import { Numeric, ISODate } from "src/data_types";

enum SortOrder {
    DEFAULT,
    ASCENDING,
    DESCENDING,
}

export enum AttributeName {
    tableHeader = "sortable-style",
    cssAscending = "sortable-asc",
    cssDescending = "sortable-desc",
}

export class TableState {
    columnIdx: number = null;
    sortOrder: SortOrder = SortOrder.DEFAULT;
    defaultOrdering: Array<HTMLTableRowElement> = null;
}

export type TTableStates = WeakMap<HTMLTableElement, TableState>;

function shouldSort(htmlEl: HTMLElement): boolean {
    // dataview table: parent must be a "dataview" HTMLTableElement
    const p = htmlEl.matchParent(".dataview");
    if (p instanceof HTMLTableElement) return true;

    // reading mode, i.e. non-editing
    return null !== htmlEl.matchParent(".markdown-reading-view");
}

export function onHeadClick(evt: MouseEvent, tableStates: TTableStates): void {
    // check if the clicked element is a table header
    const htmlEl = <HTMLElement>evt.target;

    if (!shouldSort(htmlEl)) {
        return;
    }

    const th = htmlEl.closest("thead th");
    if (th === null) {
        return;
    }

    const table = htmlEl.closest("table");
    const tableBody = table.querySelector("tbody");
    const thArray = Array.from(th.parentNode.children);
    const thIdx = thArray.indexOf(th);

    // create a new table state if does not previously exist
    if (!tableStates.has(table)) {
        tableStates.set(table, new TableState());
    }
    const tableState = tableStates.get(table);

    thArray.forEach((th, i) => {
        if (i !== thIdx) {
            th.removeAttribute(AttributeName.tableHeader);
        }
    });

    if (tableState.defaultOrdering === null) {
        tableState.defaultOrdering = Array.from(tableBody.rows);
    }

    // sorting the same column, again
    if (tableState.columnIdx === thIdx) {
        tableState.sortOrder = (tableState.sortOrder + 1) % 3;
    }
    // sorting a new column
    else {
        tableState.columnIdx = thIdx;
        tableState.sortOrder = SortOrder.ASCENDING;
    }

    sortTable(tableState, tableBody);

    switch (tableState.sortOrder) {
        case SortOrder.ASCENDING:
            th.setAttribute(AttributeName.tableHeader, AttributeName.cssAscending);
            break;
        case SortOrder.DESCENDING:
            th.setAttribute(AttributeName.tableHeader, AttributeName.cssDescending);
            break;
        default:
            break;
    }

    // if the current state is now the default one, then forget about this table
    if (tableState.sortOrder === SortOrder.DEFAULT) {
        tableStates.delete(table);
        th.removeAttribute(AttributeName.tableHeader);
    }
}

function sortTable(tableState: TableState, tableBody: HTMLTableSectionElement): void {
    emptyTable(tableBody, tableState.defaultOrdering);

    if (tableState.sortOrder === SortOrder.DEFAULT) {
        fillTable(tableBody, tableState.defaultOrdering);
        return;
    }

    const tableRows = [...tableState.defaultOrdering];

    const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });
    const parsers = [ISODate, Numeric];

    tableRows.sort((a, b) => {
        if (tableState.sortOrder === SortOrder.DESCENDING) {
            [a, b] = [b, a];
        }

        const valueA = a.cells[tableState.columnIdx].textContent;
        const valueB = b.cells[tableState.columnIdx].textContent;

        for (const parser of parsers) {
            // console.log(`trying parser: ${parser.name}`);
            try {
                return parser.compare(valueA, valueB);
            } catch (e) {
                continue;
            }
        }

        // fallback to string comparison
        return collator.compare(valueA, valueB);
    });

    fillTable(tableBody, tableRows);
}

export function resetTable(tableState: TableState, tableBody: HTMLTableSectionElement): void {
    emptyTable(tableBody, tableState.defaultOrdering);
    fillTable(tableBody, tableState.defaultOrdering);
}

function emptyTable(tableBody: HTMLTableSectionElement, rows: Array<HTMLTableRowElement>) {
    rows.forEach(() => tableBody.deleteRow(-1));
}

function fillTable(tableBody: HTMLTableSectionElement, rows: Array<HTMLTableRowElement>) {
    rows.forEach((row) => tableBody.appendChild(row));
}
