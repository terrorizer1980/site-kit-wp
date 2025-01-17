/**
 * Search Console Settings Edit component.
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
import Data from 'googlesitekit-data';
import { MODULES_SEARCH_CONSOLE } from '../../datastore/constants';
import { CORE_USER } from '../../../../googlesitekit/datastore/user/constants';
import { CORE_MODULES } from '../../../../googlesitekit/modules/datastore/constants';
import ProgressBar from '../../../../components/ProgressBar';
import SettingsForm from './SettingsForm';
const { useSelect } = Data;

export default function SettingsEdit() {
	// We need this useSelect hook to trigger starting getMatchedProperties resolution which is needed to properly
	// display the progress bar while matched properties are being loaded.
	useSelect( ( select ) =>
		select( MODULES_SEARCH_CONSOLE ).getMatchedProperties()
	);

	const isDoingSubmitChanges = useSelect( ( select ) =>
		select( MODULES_SEARCH_CONSOLE ).isDoingSubmitChanges()
	);
	const hasResolvedProperties = useSelect( ( select ) =>
		select( MODULES_SEARCH_CONSOLE ).hasFinishedResolution(
			'getMatchedProperties'
		)
	);

	const loggedInUserID = useSelect( ( select ) =>
		select( CORE_USER ).getID()
	);
	const hasResolvedUser = useSelect( ( select ) =>
		select( CORE_USER ).hasFinishedResolution( 'getUser' )
	);

	const hasModuleAccess = useSelect( ( select ) => {
		const moduleOwnerID = select( MODULES_SEARCH_CONSOLE ).getOwnerID();
		if ( moduleOwnerID === loggedInUserID ) {
			return true;
		}
		return select( CORE_MODULES ).hasModuleAccess( 'search-console' );
	} );
	const isLoadingModuleAccess = useSelect( ( select ) => {
		const hasResolvedModuleOwner = select(
			MODULES_SEARCH_CONSOLE
		).hasFinishedResolution( 'getSettings' );

		const isResolvingModuleAccess = select( CORE_MODULES ).isResolving(
			'hasModuleAccess',
			[ 'search-console' ]
		);

		return (
			! hasResolvedModuleOwner ||
			! hasResolvedUser ||
			isResolvingModuleAccess
		);
	} );

	let viewComponent;
	if (
		isDoingSubmitChanges ||
		! hasResolvedProperties ||
		isLoadingModuleAccess
	) {
		viewComponent = <ProgressBar />;
	} else {
		viewComponent = <SettingsForm hasModuleAccess={ hasModuleAccess } />;
	}

	return (
		<div className="googlesitekit-setup-module googlesitekit-setup-module--search-console">
			{ viewComponent }
		</div>
	);
}
