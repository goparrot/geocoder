import type { MapQuestQueryInterface } from './map-quest-query.interface';

export interface MapQuestSuggestQueryInterface extends MapQuestQueryInterface {
    /**
     * A query phrase. The phrase can be incomplete, in which case its last term is treated as a prefix during matching. Address queries must begin with a street number.
     * Minimum Length: 2 characters.
     * Maximum Length: 100 characters.
     */
    q: string;

    /**
     * The collections to search over. Currently "address", "adminArea", "airport", "category", "franchise", and "poi" are supported.
     * Accepts multiple instances of the parameter and or a comma-delimited list.
     */
    collection: string;

    /**
     * The geographic context used for searching, ranking, and ordering results.
     * Supports a point defining the geographic "center" of the query.
     * Must consist of two comma-separated floating-point values: the longitude, latitude;
     */
    location?: string;

    /**
     * The maximum number of results to return. Must lie in the range [1, 15]. Default if unspecified: 10.
     */
    limit?: number;

    /**
     * Any valid ISO 3166-1 Alpha-2 country codes
     */
    countryCode?: string;

    /**
     * Any valid ISO 639-1 Alpha-2 language code
     */
    languageCode?: string;
}
