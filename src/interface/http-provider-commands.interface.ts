import type { GeocodeCommand, PlaceDetailsCommand, ReverseCommand, SuggestCommand, DistanceCommand } from '../command';

export interface HttpProviderCommandsInterface {
    geocode: GeocodeCommand;
    reverse: ReverseCommand;
    suggest?: SuggestCommand;
    placeDetails?: PlaceDetailsCommand;
    distance?: DistanceCommand;
}
