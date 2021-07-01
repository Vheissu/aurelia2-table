import { DI, IContainer, IRegistry } from '@aurelia/kernel';

import { AureliaTableCustomAttribute } from './aurelia-table-attribute';

export const DefaultComponents: IRegistry[] = [
    AureliaTableCustomAttribute as unknown as IRegistry,
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
        return { ...cardiganConfiguration };
    },
    ...aureliaTableConfiguration
};
