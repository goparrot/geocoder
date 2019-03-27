import { GeocodeCommand, ReverseCommand, SuggestCommand } from '../command';

export interface HttpProviderCommandsInterface {
    geocode: GeocodeCommand;
    reverse: ReverseCommand;
    suggest?: SuggestCommand;
}
