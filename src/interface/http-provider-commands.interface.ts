import type { GeocodeCommand, PlaceDetailsCommand, ReverseCommand, SuggestCommand } from '../command';

export interface HttpProviderCommandsInterface {
    geocode: GeocodeCommand;
    reverse: ReverseCommand;
    suggest?: SuggestCommand;
    placeDetails?: PlaceDetailsCommand;
}
