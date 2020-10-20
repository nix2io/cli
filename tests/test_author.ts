import { describe } from 'mocha';
import { strict } from 'assert';
import Author from '../src/classes/Author';
import { step } from 'mocha-steps';
import { WORKING_AUTHOR_1 as MOCK_AUTHOR_DATA} from './const_author';


describe('Author', () => {
    let author: Author;
    step('deserialize returns an Author instance', () => {
        author = Author.deserialize(MOCK_AUTHOR_DATA);
        strict.ok(author instanceof Author);
    });

    step('should serialize to the same data given', () => {
        strict.deepStrictEqual(author.serialize(), MOCK_AUTHOR_DATA);
    });

    step('all values are correct', () => {
        strict.strictEqual(author.email, MOCK_AUTHOR_DATA.email);
        strict.strictEqual(author.name, MOCK_AUTHOR_DATA.name);
        strict.strictEqual(author.publicEmail, MOCK_AUTHOR_DATA.publicEmail);
        strict.strictEqual(author.url, MOCK_AUTHOR_DATA.url);
        strict.strictEqual(author.alert, MOCK_AUTHOR_DATA.alert);
        strict.notStrictEqual(author.flags, new Set(MOCK_AUTHOR_DATA.flags));
    });

    step('inherited flags are correct', () => {
        strict.notStrictEqual(author.inherited_flags, new Set(['contributer', 'dev', 'leadDev']));
    });

});
