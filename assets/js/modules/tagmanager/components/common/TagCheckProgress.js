/**
 * Tag Check Progress Loader component.
 *
 * Site Kit by Google, Copyright 2022 Google LLC
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
 * External dependencies
 */
import classnames from 'classnames';
import PropTypes from 'prop-types';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Data from 'googlesitekit-data';
import { MODULES_TAGMANAGER } from '../../datastore/constants';
import ProgressBar from '../../../../components/ProgressBar';
const { useSelect } = Data;

export default function TagCheckProgress( { className } ) {
	const isResolvingLiveContainerVersion = useSelect( ( select ) => {
		const accountID = select( MODULES_TAGMANAGER ).getAccountID();

		const internalContainerID =
			select( MODULES_TAGMANAGER ).getInternalContainerID();

		const internalAMPContainerID =
			select( MODULES_TAGMANAGER ).getInternalAMPContainerID();

		return (
			select( MODULES_TAGMANAGER ).isResolving(
				'getLiveContainerVersion',
				[ accountID, internalContainerID ]
			) ||
			select( MODULES_TAGMANAGER ).isResolving(
				'getLiveContainerVersion',
				[ accountID, internalAMPContainerID ]
			)
		);
	} );

	if ( ! isResolvingLiveContainerVersion ) {
		return null;
	}

	return (
		<div className={ classnames( className ) }>
			<small>{ __( 'Checking tags…', 'google-site-kit' ) }</small>
			<ProgressBar small compress />
		</div>
	);
}

TagCheckProgress.propTypes = {
	className: PropTypes.string,
};

TagCheckProgress.defaultProps = {
	className: '',
};
