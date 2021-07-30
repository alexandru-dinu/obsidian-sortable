import { Plugin } from 'obsidian';

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
        console.log('Sortable: loading plugin...');

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

        console.log('Sortable: loaded plugin.');
    }

    onunload() {
        console.log('Sortable: unloaded plugin.');
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}