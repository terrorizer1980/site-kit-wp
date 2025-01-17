/**
 * `modules/optimize` data store: service tests.
 *
 * Site Kit by Google, Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 *
 * Internal dependencies
 */
import {
	createTestRegistry,
	unsubscribeFromAll,
} from '../../../../../tests/js/utils';
import { MODULES_OPTIMIZE } from './constants';
import { CORE_USER } from '../../../googlesitekit/datastore/user/constants';
import { decodeServiceURL } from '../../../../../tests/js/mock-accountChooserURL-utils';

describe( 'module/optimize service store', () => {
	const userData = {
		id: 1,
		email: 'admin@example.com',
		name: 'admin',
		picture: 'https://path/to/image',
	};
	const baseURI = 'https://optimize.google.com/optimize/home/';

	let registry;

	beforeAll( () => {
		registry = createTestRegistry();
		registry.dispatch( CORE_USER ).receiveUserInfo( userData );
	} );

	afterAll( () => {
		unsubscribeFromAll( registry );
	} );

	describe( 'selectors', () => {
		describe( 'getServiceURL', () => {
			it( 'retrieves the correct URL with no arguments', async () => {
				const serviceURL = registry
					.select( MODULES_OPTIMIZE )
					.getServiceURL();

				expect( serviceURL ).toMatchInlineSnapshot(
					'"https://accounts.google.com/accountchooser?continue=https%3A%2F%2Foptimize.google.com%2Foptimize%2Fhome%2F&Email=admin%40example.com"'
				);
			} );

			it( 'adds the path parameter', () => {
				const serviceURLNoSlashes = registry
					.select( MODULES_OPTIMIZE )
					.getServiceURL( { path: 'test/path/to/deeplink' } );

				expect( serviceURLNoSlashes ).toMatchInlineSnapshot(
					'"https://accounts.google.com/accountchooser?continue=https%3A%2F%2Foptimize.google.com%2Foptimize%2Fhome%2F%23%2Ftest%2Fpath%2Fto%2Fdeeplink&Email=admin%40example.com"'
				);

				const serviceURLWithLeadingSlash = registry
					.select( MODULES_OPTIMIZE )
					.getServiceURL( { path: '/test/path/to/deeplink' } );

				expect( serviceURLWithLeadingSlash ).toMatchInlineSnapshot(
					'"https://accounts.google.com/accountchooser?continue=https%3A%2F%2Foptimize.google.com%2Foptimize%2Fhome%2F%23%2Ftest%2Fpath%2Fto%2Fdeeplink&Email=admin%40example.com"'
				);
			} );

			it( 'adds query args', async () => {
				const path = '/test/path/to/deeplink';
				const query = {
					authuser: userData.email,
					param1: '1',
					param2: '2',
				};
				const serviceURL = registry
					.select( MODULES_OPTIMIZE )
					.getServiceURL( { path, query } );

				const decodedServiceURL = decodeServiceURL( serviceURL );

				expect( decodedServiceURL.startsWith( baseURI ) ).toBe( true );
				expect( decodedServiceURL.endsWith( `#${ path }` ) ).toBe(
					true
				);
				expect( decodedServiceURL ).toMatchQueryParameters( query );
			} );
		} );
	} );
} );
