// allows time to be optional
const ISO_DATE_REGEX = /^(\d{4}-\d{2}-\d{2})(T\d{2}:\d{2}:\d{2}(\.\d{3})?(Z|[+-]\d{2}:\d{2})?)?$/;

enum CellTypes {
    TEXT,
    NUMBER,
    ISO_DATE,
}

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
    let [valueA, typeA] = valueFromCell(a.cells[index]);
    let [valueB, typeB] = valueFromCell(b.cells[index]);

    if (order === SortOrder.DESCENDING) {
        [valueA, valueB] = [valueB, valueA];
    }

    if (typeA !== typeB) {
        return collator.compare(valueA.toString(), valueB.toString());
    }

    switch (typeA) {
        case CellTypes.NUMBER:
        case CellTypes.ISO_DATE:
            return valueA === valueB ? 0 : valueA < valueB ? -1 : 1;
        case CellTypes.TEXT:
            return collator.compare(valueA.toString(), valueB.toString());
    }
}

function valueFromCell(element: HTMLTableCellElement): [any, CellTypes] {
    // TODO: extend to other data-types.
    const text = element.textContent;

    if (ISO_DATE_REGEX.test(text)) {
        return [new Date(text), CellTypes.ISO_DATE];
    }
    const value = parseFloat(text);
    if (!isNaN(value)) {
        return [value, CellTypes.NUMBER];
    }
    return [text, CellTypes.TEXT];
}

function emptyTable(tableBody: HTMLTableSectionElement, rows: Array<HTMLTableRowElement>) {
    rows.forEach(() => tableBody.deleteRow(-1));
}

function fillTable(tableBody: HTMLTableSectionElement, rows: Array<HTMLTableRowElement>) {
    rows.forEach((row) => tableBody.appendChild(row));
}
