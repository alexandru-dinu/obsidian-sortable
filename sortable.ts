import { v4 as uuidv4 } from 'uuid';


enum SortOrder {
    DEFAULT, ASCENDING, DESCENDING
}

enum AttributeName {
    table = "sortable-id",
    tableHeader = "sortable-style"
}

export class TableState {
    columnIdx: number = null;
    sortOrder: SortOrder = SortOrder.DEFAULT;
    defaultOrdering: Array<any> = null;
}


export function onHeadClick(evt: MouseEvent, tableStates: any): void {
    const htmlEl = (<HTMLInputElement>evt.target);

    const th = htmlEl.closest('thead th');
    if (th == null) { return; }

    const table = htmlEl.closest('table');
    const tableBody = table.querySelector('tbody');
    const thArray = Array.from(th.parentNode.children);
    const thIdx = thArray.indexOf(th);

    var tableID: string | null = table.getAttribute(AttributeName.table);

    if (tableID === null) {
        tableID = uuidv4().slice(0, 8);
        table.setAttribute(AttributeName.table, tableID);
        tableStates[tableID] = new TableState();
    }
    var tableState = tableStates[tableID];

    thArray.forEach((th, i) => {
        if (i != thIdx) {
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

    // TODO: also put in settings
    if (tableState.sortOrder === SortOrder.ASCENDING) {
        th.setAttribute(AttributeName.tableHeader, "sortable-asc");
    }
    if (tableState.sortOrder === SortOrder.DESCENDING) {
        th.setAttribute(AttributeName.tableHeader, "sortable-desc");
    }

    // TODO: closing the table page will
    // If the current state is now the default one, then forget about this table
    if (tableState.sortOrder === SortOrder.DEFAULT) {
        // TODO -- verify whether this removes the memory for value (e.g. array etc)
        delete tableStates[tableID];
        table.removeAttribute(AttributeName.table);
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
    xs.sort((a, b) => compareRows(a, b, tableState.columnIdx, tableState.sortOrder));

    fillTable(tableBody, xs)
}

function compareRows(a: HTMLTableRowElement, b: HTMLTableRowElement, index: number, order: SortOrder) {
    var valueA = valueFromCell(a.cells[index]);
    var valueB = valueFromCell(b.cells[index]);

    if (order == SortOrder.DESCENDING) {
        [valueA, valueB] = [valueB, valueA];
    }

    if (typeof (valueA) === 'number' && typeof (valueA) === 'number') {
        return valueA < valueB ? -1 : 1;
    }
    else {
        return valueA.toString().localeCompare(valueB.toString());
    }

}

function tryParseFloat(x: string): string | number {
    const y = parseFloat(x);
    return isNaN(y) ? x : y;
}

function valueFromCell(element: HTMLTableCellElement) {
    // TODO: extend to other data-types.
    return tryParseFloat(element.textContent);
}

function emptyTable(tableBody:HTMLTableSectionElement, rows:Array<HTMLTableRowElement>) {
    rows.forEach(() => tableBody.deleteRow(-1));
}

function fillTable(tableBody:HTMLTableSectionElement, rows:Array<HTMLTableRowElement>) {
    rows.forEach((row) => tableBody.appendChild(row));
}
