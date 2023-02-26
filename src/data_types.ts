abstract class DataType {
    static parse(val: string): any {
        throw new Error("not implemented");
    }

    static compare(a: string, b: string): number {
        const va = this.parse(a);
        const vb = this.parse(b);
        if (va === null) {
            throw new Error(`Failed to parse ${this.name} from value: ${a}`);
        }
        if (vb === null) {
            throw new Error(`Failed to parse ${this.name} from value: ${b}`);
        }
        return va === vb ? 0 : va < vb ? -1 : 1;
    }
}

export class Numeric extends DataType {
    static parse(val: string): number {
        const x = Number(val);
        if (!isNaN(x)) {
            return x;
        }
        return null;
    }
}

export class ISODate extends DataType {
    // allows time to be optional
    static readonly ISO_DATE_REGEX =
        /^(\d{4}-\d{2}-\d{2})(T\d{2}:\d{2}:\d{2}(\.\d{3})?(Z|[+-]\d{2}:\d{2})?)?$/;

    static parse(val: string): Date | null {
        if (this.ISO_DATE_REGEX.test(val)) {
            return new Date(val);
        }
        return null;
    }
}
