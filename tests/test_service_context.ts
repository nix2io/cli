import { describe } from 'mocha';
import { strict } from 'assert';
import { step } from 'mocha-steps';
import { WORKING_SERVICES } from './const_service';
import { Schema, ServiceContext } from '../src/classes';

describe('Service Context', () => {
    for (const i in WORKING_SERVICES) {
        const MOCK_INFO_DATA = WORKING_SERVICES[i];
        describe('Mock Service ' + i, () => {
            let serviceContext: ServiceContext;
            step('deserialize returns a ServiceContext instance', () => {
                serviceContext = ServiceContext.deserialize('', MOCK_INFO_DATA);
                strict.ok(serviceContext instanceof ServiceContext);
            });

            step('serialize to the correct mock data', () => {
                strict.deepStrictEqual(
                    serviceContext.serialize(),
                    MOCK_INFO_DATA,
                );
            });

            step('all string values are correct', () => {
                strict.strictEqual(serviceContext.type, MOCK_INFO_DATA.type);
            });

            switch (i) {
                case '0':
                    step('get schema by id', () => {
                        strict.notStrictEqual(
                            serviceContext.getSchema('user'),
                            Schema.deserialize(MOCK_INFO_DATA.schemas[0]),
                        );
                    });
                    break;
            }
        });
    }
});
