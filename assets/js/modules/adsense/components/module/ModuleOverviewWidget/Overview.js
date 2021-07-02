/**
 * ModuleOverviewWidget component.
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
 * External dependencies
 */
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { Grid, Row, Cell } from '../../../../../material-components';
import { calculateChange } from '../../../../../util';
import DataBlock from '../../../../../components/DataBlock';

const Overview = ( {
	metrics,
	currentRangeData,
	previousRangeData,
	selectedStats,
	handleStatsSelection,
} ) => {
	const { totals, headers } = currentRangeData;
	const { totals: previousTotals } = previousRangeData;

	const cellProps = {
		smSize: 2,
		mdSize: 2,
		lgSize: 3,
	};

	return (
		<Grid>
			<Row>
				<Cell { ...cellProps }>
					<DataBlock
						stat={ 0 }
						className="googlesitekit-data-block--page-rpm googlesitekit-data-block--button-1"
						title={ metrics[ headers[ 0 ].name ] }
						datapoint={ totals[ 0 ] }
						datapointUnit={ headers[ 0 ]?.currencyCode }
						change={ calculateChange( previousTotals[ 0 ], totals[ 0 ] ) }
						changeDataUnit="%"
						context="button"
						selected={ selectedStats === 0 }
						handleStatSelection={ handleStatsSelection }
					/>

				</Cell>
				<Cell { ...cellProps }>
					<DataBlock
						stat={ 1 }
						className="googlesitekit-data-block--page-rpm googlesitekit-data-block--button-2"
						title={ metrics[ headers[ 1 ].name ] }
						datapoint={ totals[ 1 ] }
						datapointUnit={ headers[ 1 ]?.currencyCode }
						change={ calculateChange( previousTotals[ 1 ], totals[ 1 ] ) }
						changeDataUnit="%"
						context="button"
						selected={ selectedStats === 1 }
						handleStatSelection={ handleStatsSelection }
					/>

				</Cell>
				<Cell { ...cellProps }>
					<DataBlock
						stat={ 2 }
						className="googlesitekit-data-block--page-rpm googlesitekit-data-block--button-3"
						title={ metrics[ headers[ 2 ].name ] }
						datapoint={ totals[ 2 ] }
						change={ calculateChange( previousTotals[ 2 ], totals[ 2 ] ) }
						changeDataUnit="%"
						context="button"
						selected={ selectedStats === 2 }
						handleStatSelection={ handleStatsSelection }
					/>

				</Cell>
				<Cell { ...cellProps }>
					<DataBlock
						stat={ 3 }
						className="googlesitekit-data-block--impression googlesitekit-data-block--button-4"
						title={ metrics[ headers[ 3 ].name ] }
						datapoint={ totals[ 3 ] }
						datapointUnit="%"
						change={ calculateChange( previousTotals[ 3 ], totals[ 3 ] ) }
						changeDataUnit="%"
						context="button"
						selected={ selectedStats === 3 }
						handleStatSelection={ handleStatsSelection }
					/>
				</Cell>
			</Row>
		</Grid>
	);
};

Overview.propTypes = {
	metrics: PropTypes.object,
	currentRangeData: PropTypes.object,
	previousRangeData: PropTypes.object,
	selectedStats: PropTypes.number.isRequired,
	handleStatsSelection: PropTypes.func.isRequired,
};

export default Overview;
