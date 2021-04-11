import { plainToClass } from 'class-transformer';
import { GoogleMapsLocationTransformer, GoogleMapsProvider, Location } from '../../../../../src';

describe('GoogleMapsLocationTransformer (unit)', () => {
    describe('#transform', () => {
        it('should throw TypeError on empty raw data object', async () => {
            const transformer = new GoogleMapsLocationTransformer({});

            return transformer.transform().should.be.rejectedWith(TypeError, `Cannot read property 'location' of undefined`);
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
