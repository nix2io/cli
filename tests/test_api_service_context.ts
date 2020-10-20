import { describe } from 'mocha';
import { strict } from 'assert';
import { APIServiceContext } from '../src/classes/services';
import { step } from 'mocha-steps';
import { WORKING_API_SERVICES } from './const_api_service';


describe('API Service Context', () => {
    for (const i in WORKING_API_SERVICES) {
        const MOCK_INFO_DATA = WORKING_API_SERVICES[i];
        describe('Mock Service ' + i, () => {
            let serviceContext: APIServiceContext;
            step('deserialize returns an APIServiceContext instance', () => {
                serviceContext = APIServiceContext.deserialize('', MOCK_INFO_DATA);
                strict.ok(serviceContext instanceof APIServiceContext);
            });
            
            step('serialize to the correct mock data', () => {
                strict.deepStrictEqual(serviceContext.serialize(), MOCK_INFO_DATA);
            })
            
            step('all string values are correct', () => {
                strict.strictEqual(serviceContext.type, MOCK_INFO_DATA.type);
            });
            
        });
    }
});
