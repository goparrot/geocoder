/**
 * @link {https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/mapbox__mapbox-sdk/index.d.ts}
 */

export type MapboxGeocodeMode = 'mapbox.places' | 'mapbox.places-permanent';
export type MapboxBoundingBox = [number, number, number, number];
export type MapboxGeocodeQueryType =
    | 'country'
    | 'region'
    | 'postcode'
    | 'district'
    | 'place'
    | 'locality'
    | 'neighborhood'
    | 'address'
    | 'poi'
    | 'poi.landmark';

export interface MapboxGeocodeResponse {
    /**
     * "Feature Collection" , a GeoJSON type from the GeoJSON specification.
     */
    type: 'FeatureCollection';
    /**
     * An array of space and punctuation-separated strings from the original query.
     */
    query: string[];
    /**
     * An array of feature objects.
     */
    features: MapboxGeocodeFeature[];
    /**
     * A string attributing the results of the Mapbox Geocoding API to Mapbox and links to Mapbox's terms of service and data sources.
     */
    attribution: string;
}

export interface MapboxGeocodeFeature {
    /**
     * A string feature id in the form  {type}.{id} where  {type} is the lowest hierarchy feature in the  place_type field.
     * The  {id} suffix of the feature id is unstable and may change within versions.
     */
    id: string;
    /**
     * "Feature", a GeoJSON type from the GeoJSON specification.
     */
    type: 'Feature';
    /**
     * An array of feature types describing the feature. Options are  country ,  region ,  postcode ,  district ,  place , locality ,  neighborhood ,
     * address ,  poi , and  poi.landmark . Most features have only one type, but if the feature has multiple types,
     * all applicable types will be listed in the array. (For example, Vatican City is a  country , region , and  place .)
     */
    place_type: MapboxGeocodeQueryType[];
    /**
     * A numerical score from 0 (least relevant) to 0.99 (most relevant) measuring how well each returned feature matches the query.
     * You can use the  relevance property to remove results that don't fully match the query.
     */
    relevance: number;
    /**
     * A string of the house number for the returned  address feature. Note that unlike the
     * address property for  poi features, this property is outside the  properties object.
     */
    address?: string | undefined;
    /**
     * A string representing the feature in the requested language, if specified.
     */
    text: string;
    /**
     * A string representing the feature in the requested language, if specified, and its full result hierarchy.
     */
    place_name: string;
    /**
     * A string analogous to the  text field that more closely matches the query than results in the specified language.
     * For example, querying "Köln, Germany" with language set to English might return a feature with the
     * text "Cologne" and the  matching_text "Köln".
     */
    matching_text: string;
    /**
     * A string analogous to the  place_name field that more closely matches the query than results in the specified language.
     * For example, querying "Köln, Germany" with language set to English might return a feature with the place_name "Cologne, Germany"
     * and a  matching_place_name of "Köln, North Rhine-Westphalia, Germany".
     */
    matching_place_name?: string;
    /**
     * A string of the IETF language tag of the query's primary language.
     * Can be used to identity text and place_name properties on this object
     * in the format text_{language}, place_name_{language} and language_{language}
     */
    language: string;
    /**
     * An array bounding box in the form [ minX,minY,maxX,maxY ] .
     */
    bbox?: number[] | undefined;
    /**
     * An array in the form [ longitude,latitude ] at the center of the specified  bbox .
     */
    center: number[];
    /**
     * An object describing the spatial geometry of the returned feature
     */
    geometry: MapboxGeometry;
    /**
     * An array representing the hierarchy of encompassing parent features. Each parent feature may include any of the above properties
     */
    context?: MapboxGeocodeFeatureContext[];

    text_en?: string;
    place_name_en?: string;

    properties: {
        /**
         * A point accuracy metric for the returned address feature. Can be one of rooftop, parcel, point, interpolated, intersection, street. Note that this list is subject to change. For details on these options, see the Point accuracy for address features section.
         */
        accuracy?: 'rooftop' | 'parcel' | 'point' | 'interpolated' | 'intersection' | 'street';

        /**
         * The full street address for the returned poi feature. Note that unlike the address property for address features, this property is inside the properties object.
         */
        address?: string;

        /**
         * Comma-separated categories for the returned poi feature.
         */
        category?: string;

        /**
         * The ISO 3166-1 country and ISO 3166-2 region code for the returned feature.
         */
        short_code?: string;

        /**
         * The name of a suggested Maki icon to visualize a poi feature based on its category.
         */
        maki?: string;
    };

    [prop: string]: any;
}

export interface MapboxGeometry {
    /**
     * Point, a GeoJSON type from the GeoJSON specification .
     */
    type: 'Point';
    /**
     * An array in the format [ longitude,latitude ] at the center of the specified  bbox .
     */
    coordinates: number[];
    /**
     * A boolean value indicating if an  address is interpolated along a road network. This field is only present when the feature is interpolated.
     */
    interpolated: boolean;
}

export interface MapboxGeocodeFeatureContext {
    id: string;
    text: string;
    /**
     * The Wikidata identifier for the returned feature.
     */
    wikidata?: string | undefined;
    /**
     * A string of comma-separated categories for the returned  poi feature.
     */
    category?: string | undefined;
    /**
     * A formatted string of the telephone number for the returned  poi feature.
     */
    tel?: string | undefined;
    /**
     * The name of a suggested Maki icon to visualize a  poi feature based on its  category .
     */
    maki?: string | undefined;
    /**
     * A boolean value indicating whether a  poi feature is a landmark. Landmarks are
     * particularly notable or long-lived features like schools, parks, museums and places of worship.
     */
    landmark?: boolean | undefined;
    /**
     * The ISO 3166-1 country and ISO 3166-2 region code for the returned feature.
     */
    short_code?: string;

    [prop: string]: any;
}
