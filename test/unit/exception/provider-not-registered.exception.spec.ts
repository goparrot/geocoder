import axios from 'axios';
import { GeocoderException, ProviderNotRegisteredException } from '../../../src/exception';
import { GoogleMapsProvider, HereProvider } from '../../../src/provider';

describe('ProviderNotRegisteredException (unit)', () => {
    let provider: GoogleMapsProvider;

    beforeEach(() => {
        provider = new GoogleMapsProvider(axios.create(), `${process.env.GOOGLE_MAPS_API_KEY}`);
    });

    describe('#constructor', () => {
        it('should inherit GeocoderException', async () => {
            new ProviderNotRegisteredException('').should.be.instanceOf(GeocoderException);
        });

        it('should inherit Error', async () => {
            return new ProviderNotRegisteredException('').should.be.instanceOf(Error);
        });

        it('should return right name', async () => {
            return new ProviderNotRegisteredException('').should.have.property('name', ProviderNotRegisteredException.name);
        });

        it('should return right message', async () => {
            return new ProviderNotRegisteredException('test').should.have.property('message', 'test');
        });
    });

    describe('#create', () => {
        it('should create instanceof ProviderNotRegisteredException without providers in message', async () => {
            return ((): any => {
                throw ProviderNotRegisteredException.create(HereProvider.name);
            }).should.throw(ProviderNotRegisteredException, 'Provider "HereProvider" is not registered, so you cannot use it.');
        });

        it('should create instanceof ProviderNotRegisteredException with providers in message', async () => {
            return ((): any => {
                throw ProviderNotRegisteredException.create(HereProvider.name, [provider]);
            }).should.throw(
                ProviderNotRegisteredException,
                'Provider "HereProvider" is not registered, so you cannot use it. Did you forget to register it or made a typo? Registered providers are: [GoogleMapsProvider]',
            );
        });
    });
});
