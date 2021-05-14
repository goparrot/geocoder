import { plainToClass } from 'class-transformer';
import { Suggestion } from '../../../src/model';
import { suggestionFixture } from '../../fixture/model/suggestion.fixture';
import type { SuggestionInterface } from '../../../src/interface';

describe('Suggestion (unit)', () => {
    let suggestion: Suggestion;

    beforeEach(() => {
        suggestion = plainToClass<Suggestion, SuggestionInterface>(Suggestion, suggestionFixture, {
            groups: ['raw'],
        });
    });

    describe('#constructor', () => {
        it('should be instance of Suggestion with empty data', async () => {
            new Suggestion().should.be.instanceOf(Suggestion);
        });
    });

    describe('#toObject', () => {
        it('should generate valid object', async () => {
            return suggestion
                .toObject({
                    groups: ['raw'],
                })
                .should.be.deep.eq(suggestionFixture);
        });
    });

    describe('spread operator', () => {
        it('should generate the same result as plain object', async () => {
            return { ...suggestion }.should.be.deep.eq(suggestionFixture);
        });

        it('should generate the same result as #toObject', async () => {
            return { ...suggestion }.should.be.deep.eq(
                suggestion.toObject({
                    groups: ['raw'],
                }),
            );
        });
    });

    describe('plainToClass', () => {
        it('should ignore unsupported properties', async () => {
            const suggestionModel: Suggestion = plainToClass<Suggestion, SuggestionInterface>(
                Suggestion,
                // @ts-ignore
                {
                    ...suggestionFixture,
                    ...{
                        unsupported: true,
                    },
                },
                {
                    groups: ['raw'],
                },
            );

            suggestionModel.should.be.instanceOf(Suggestion);
            return suggestionModel.should.be.deep.eq(suggestion);
        });
    });
});
