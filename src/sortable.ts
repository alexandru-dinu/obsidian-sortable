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
    if (p instanceof HTMLTableElement)
        return true;

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

    const xs = [...tableState.defaultOrdering];
    const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });
    xs.sort((a, b) => compareRows(a, b, tableState.columnIdx, tableState.sortOrder, collator));

    fillTable(tableBody, xs);
}

export function resetTable(tableState: TableState, tableBody: HTMLTableSectionElement): void {
    emptyTable(tableBody, tableState.defaultOrdering);
    fillTable(tableBody, tableState.defaultOrdering);
}

function compareRows(
    a: HTMLTableRowElement,
    b: HTMLTableRowElement,
    index: number,
    order: SortOrder,
    collator: Intl.Collator
) {
    let valueA = valueFromCell(a.cells[index]);
    let valueB = valueFromCell(b.cells[index]);

    if (order === SortOrder.DESCENDING) {
        [valueA, valueB] = [valueB, valueA];
    }

    if (typeof valueA === "number" && typeof valueA === "number") {
        return valueA < valueB ? -1 : 1;
    }

    return collator.compare(valueA.toString(), valueB.toString());
}

function tryParseFloat(x: string): string | number {
    const y = parseFloat(x);
    return isNaN(y) ? x : y;
}

function valueFromCell(element: HTMLTableCellElement) {
    // TODO: extend to other data-types.
    return tryParseFloat(element.textContent);
}

function emptyTable(tableBody: HTMLTableSectionElement, rows: Array<HTMLTableRowElement>) {
    rows.forEach(() => tableBody.deleteRow(-1));
}

function fillTable(tableBody: HTMLTableSectionElement, rows: Array<HTMLTableRowElement>) {
    rows.forEach((row) => tableBody.appendChild(row));
}
