import { gte } from 'semver';
import { plainToClass } from 'class-transformer';
import { GoogleMapsLocationTransformer, GoogleMapsProvider, Location } from '../../../../../src';

describe('GoogleMapsLocationTransformer (unit)', () => {
    describe('#transform', () => {
        it('should throw TypeError on empty raw data object', async () => {
            const transformer = new GoogleMapsLocationTransformer({});

            const errorMessage = gte(process.version, '16.0.0')
                ? `Cannot read properties of undefined (reading 'location')`
                : `Cannot read property 'location' of undefined`;

            return transformer.transform().should.be.rejectedWith(TypeError, errorMessage);
        });

        it('should work with minimal raw data', async () => {
            const transformer = new GoogleMapsLocationTransformer({
                geometry: {
                    location: {
                        lat: 1,
                        lng: 2,
                    },
                },
            });

            return transformer.transform().should.eventually.eql(
                plainToClass(Location, {
                    provider: GoogleMapsProvider.name,
                    formattedAddress: '',
                    latitude: 1,
                    longitude: 2,
                }),
            );
        });
    });
});
