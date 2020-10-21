import { describe } from 'mocha';
import { step } from 'mocha-steps';
import { strict } from 'assert';
import Info from '../src/classes/Info';
import Author from '../src/classes/Author';
import { WORKING_INFO } from './const_info';

describe('Info Class', () => {
    for (const i in WORKING_INFO) {
        const MOCK_INFO_DATA = WORKING_INFO[i];
        describe('Mock Info ' + i, () => {
            let info: Info;
            step('deserialize returns an Info instance', () => {
                info = Info.deserialize(MOCK_INFO_DATA);
                strict.ok(info instanceof Info);
            });

            step('serialize to the correct mock data', () => {
                strict.deepStrictEqual(info.serialize(), MOCK_INFO_DATA);
            });

            step('all string values are correct', () => {
                strict.strictEqual(info.identifier, MOCK_INFO_DATA.identifier);
                strict.strictEqual(info.label, MOCK_INFO_DATA.label);
                strict.strictEqual(
                    info.description,
                    MOCK_INFO_DATA.description,
                );
                strict.strictEqual(info.version, MOCK_INFO_DATA.version);
                strict.strictEqual(
                    info.termsOfServiceURL,
                    MOCK_INFO_DATA.termsOfServiceURL,
                );
                strict.strictEqual(info.license, MOCK_INFO_DATA.license);
            });
            switch (i) {
                case '0':
                    step('authors list should contain 1 Author', () => {
                        strict.strictEqual(info.authors.length, 1);
                        strict.ok(info.authors[0] instanceof Author);
                    });
                    break;
                case '1':
                    step('authors list should contain 0 authors', () => {
                        strict.strictEqual(info.authors.length, 0);
                    });
                    break;
            }

            step('should return a timestamp for created and modified', () => {
                strict.strictEqual(
                    info.created.toISOString(),
                    new Date(MOCK_INFO_DATA.created * 1000).toISOString(),
                );
                strict.strictEqual(
                    info.modified.toISOString(),
                    new Date(MOCK_INFO_DATA.modified * 1000).toISOString(),
                );
            });
        });
    }
});
