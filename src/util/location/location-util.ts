import { InvalidArgumentException } from '../../exception';

export class LocationUtil {
    static removeHouseNumberFromStreetName(streetName: string, houseNumber: string): string {
        if (!streetName || !houseNumber) {
            throw new InvalidArgumentException('Argument values must not be empty');
        }

        if (streetName.startsWith(`${houseNumber} `)) {
            return streetName.slice(1 + houseNumber.length);
        }

        if (streetName.endsWith(` ${houseNumber}`)) {
            return streetName.slice(0, -1 * (1 + houseNumber.length));
        }

        return streetName;
    }
}
