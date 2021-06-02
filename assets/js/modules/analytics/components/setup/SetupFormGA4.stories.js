/**
 * SetupFormGA4 component stories.
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
 * Internal dependencies
 */
import { STORE_NAME } from '../../datastore/constants';
import { MODULES_ANALYTICS_4 } from '../../../analytics-4/datastore/constants';
import { provideModules, provideModuleRegistrations, provideSiteInfo } from '../../../../../../tests/js/utils';
import ModuleSetup from '../../../../components/setup/ModuleSetup';
import WithRegistrySetup from '../../../../../../tests/js/WithRegistrySetup';
import * as fixtures from '../../datastore/__fixtures__';
import * as ga4Fixtures from '../../../analytics-4/datastore/__fixtures__';

export const Ready = () => <ModuleSetup moduleSlug="analytics" />;
Ready.storyName = 'SetupFormGA4';
Ready.decorators = [
	( Story ) => {
		const setupRegistry = ( registry ) => {
			const accounts = fixtures.accountsPropertiesProfiles.accounts.slice( 0, 1 );
			const accountID = accounts[ 0 ].id;

			registry.dispatch( MODULES_ANALYTICS_4 ).receiveGetSettings( {} );
			registry.dispatch( MODULES_ANALYTICS_4 ).receiveGetProperties( ga4Fixtures.properties, { accountID } );
			registry.dispatch( MODULES_ANALYTICS_4 ).receiveGetWebDataStreams( ga4Fixtures.webDataStreams, { propertyID: ga4Fixtures.properties[ 0 ]._id } );

			registry.dispatch( STORE_NAME ).receiveGetSettings( { adsConversionID: '' } );
			registry.dispatch( STORE_NAME ).receiveGetExistingTag( null );
			registry.dispatch( STORE_NAME ).receiveGetAccounts( accounts );
			registry.dispatch( STORE_NAME ).receiveGetProperties( [], { accountID } );

			registry.dispatch( STORE_NAME ).selectAccount( accountID );
		};

		return (
			<WithRegistrySetup func={ setupRegistry }>
				<Story />
			</WithRegistrySetup>
		);
	},
];
Ready.parameters = {
	features: [
		'ga4setup',
	],
};

export default {
	title: 'Modules/Analytics/Setup/SetupFormGA4',
	decorators: [
		( Story ) => {
			const setupRegistry = ( registry ) => {
				provideModules( registry, [
					{
						slug: 'analytics',
						active: true,
						connected: true,
					},
					{
						slug: 'analytics-4',
						active: true,
						connected: true,
					},
				] );

				provideSiteInfo( registry );
				provideModuleRegistrations( registry );
			};

			return (
				<WithRegistrySetup func={ setupRegistry }>
					<Story />
				</WithRegistrySetup>
			);
		},
	],
};