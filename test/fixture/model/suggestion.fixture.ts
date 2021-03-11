import type { SuggestionInterface } from '../../../src/interface';
import { GoogleMapsProvider } from '../../../src/provider';

export const suggestionFixture: Readonly<SuggestionInterface> = Object.freeze<SuggestionInterface>({
    formattedAddress: '1158 E 89th St, Chicago, IL 60619, USA',
    provider: GoogleMapsProvider.name,
    placeId: 'EiYxMTU4IEUgODl0aCBTdCwgQ2hpY2FnbywgSUwgNjA2MTksIFVTQSIbEhkKFAoSCZ9KkOIgJg6IEYkN8yihjBnAEIYJ',
    raw: {},
});
