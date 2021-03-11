import type { SuggestQueryInterface } from '../interface';
import { GeocodeQuery } from './geocode-query';

export class SuggestQuery extends GeocodeQuery implements SuggestQueryInterface {}
