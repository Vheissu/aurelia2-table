import { bindable, customAttribute, INode } from '@aurelia/runtime-html';
import { resolve } from '@aurelia/kernel';
import { AureliaTableCustomAttribute } from './aurelia-table-attribute';

interface AureliaElement extends HTMLElement {
    $au?: {
        [key: string]: {
            viewModel: any;
        };
    };
}

@customAttribute('aut-sort')
export class AutSortCustomAttribute {
    @bindable key;
    @bindable custom;
    @bindable default;

    private element: HTMLElement = resolve(INode) as HTMLElement;

    private rowSelectedListener;
    private sortChangedListener;

    order = 0;
    orderClasses = ['aut-desc', 'aut-sortable', 'aut-asc'];

    ignoreEvent = false;

    constructor(private auTable: AureliaTableCustomAttribute) {
        this.rowSelectedListener = () => {
            this.handleHeaderClicked();
        };

        this.sortChangedListener = () => {
            this.handleSortChanged();
        };
    }

    handleSortChanged() {
        if (!this.ignoreEvent) {
            this.order = 0;
            this.setClass();
        } else {
            this.ignoreEvent = false;
        }
    }

    attached() {
        this.auTable = this.findAureliaTableCustomAttribute();
        if (!this.auTable) {
            throw new Error('AureliaTableCustomAttribute not found on parent table element.');
        }

        if (this.key || this.custom) {
            (this.element as HTMLElement).style.cursor = 'pointer';
            this.element.classList.add('aut-sort');

            this.element.addEventListener('click', this.rowSelectedListener);
            this.auTable.addSortChangedListener(this.sortChangedListener);

            this.handleDefault();
            this.setClass();
        }
    }

    detached() {
        this.element.removeEventListener('click', this.rowSelectedListener);
        this.auTable.removeSortChangedListener(this.sortChangedListener);
    }

    handleDefault() {
        if (this.default) {
            this.order = this.default === 'desc' ? -1 : 1;
            this.doSort();
        }
    }

    doSort() {
        if (this.auTable.dataSource === 'server') {
            return;
        }

        this.ignoreEvent = true;
        this.auTable.sortChanged(this.key, this.custom, this.order);
    }

    setClass() {
        this.orderClasses.forEach((next) => this.element.classList.remove(next));
        this.element.classList.add(this.orderClasses[this.order + 1]);
    }

    handleHeaderClicked() {
        this.order = this.order === 0 || this.order === -1 ? this.order + 1 : -1;
        this.setClass();
        this.doSort();
    }

    private findAureliaTableCustomAttribute(): AureliaTableCustomAttribute | null {
        let currentElement: AureliaElement | null = this.element as AureliaElement;

        while (currentElement) {
            const auTable = currentElement.$au?.['au:resource:custom-attribute:aurelia-table']?.viewModel as AureliaTableCustomAttribute;
            if (auTable) {
                return auTable;
            }
            currentElement = currentElement.parentElement as AureliaElement;
        }

        return null;
    }
}