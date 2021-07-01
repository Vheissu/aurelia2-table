import { DefaultComponents } from './components';
import { DI, IContainer } from '@aurelia/kernel';

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
