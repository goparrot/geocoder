import { AbstractProvider } from './abstract-provider';
import { ProvidableMixin } from './providable.mixin';

export abstract class AbstractChainProvider extends ProvidableMixin(AbstractProvider) {}
