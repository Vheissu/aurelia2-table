import { DI, IContainer, IRegistry } from '@aurelia/kernel';

import { AureliaTableCustomAttribute } from './aurelia-table-attribute';
import { AutSortCustomAttribute } from './aurelia-table-sort'; 
import { AutSelectCustomAttribute } from './aurelia-table-select';
import { AutPaginationCustomElement } from './aurelia-table-pagination'; 

export { TableSettings, TableResult } from './aurelia-table-settings';

export const DefaultComponents: IRegistry[] = [
    AureliaTableCustomAttribute as unknown as IRegistry,
    AutSortCustomAttribute as unknown as IRegistry,
    AutSelectCustomAttribute as unknown as IRegistry,
    AutPaginationCustomElement as unknown as IRegistry,
];

const aureliaTableConfiguration = {
    register(container: IContainer): IContainer {
        return container.register(
            ...DefaultComponents
        );
    },

    createContainer(): IContainer {
        return this.register(DI.createContainer());
    }
};

export const AureliaTableConfiguration = {
    customize(components: any[] = []) {
        return { ...aureliaTableConfiguration };
    },
    ...aureliaTableConfiguration
};
