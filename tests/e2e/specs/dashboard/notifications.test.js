/**
 * WordPress dependencies
 */
import {
	activatePlugin,
	visitAdminPage,
	deactivatePlugin,
} from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import {
	setSiteVerification,
	setSearchConsoleProperty,
	testSiteNotification,
	useRequestInterception,
	wpApiFetch,
} from '../../utils';

const goToSiteKitDashboard = async () => {
	await visitAdminPage( 'admin.php', 'page=googlesitekit-dashboard' );
};

describe( 'core site notifications', () => {
	beforeAll( async () => {
		await page.setRequestInterception( true );
		useRequestInterception( ( request ) => {
			const url = request.url();
			if ( url.match( 'search-console/data/searchanalytics' ) ) {
				request.respond( { status: 200, body: '[]' } );
			} else if ( url.match( 'pagespeed-insights/data/pagespeed' ) ) {
				request.respond( { status: 200, body: '{}' } );
			} else if ( url.match( 'user/data/survey-timeouts' ) ) {
				request.respond( { status: 200, body: '[]' } );
			} else {
				request.continue();
			}
		} );
	} );

	// The proxy test cannot currently be done and needs to be skipped TODO tests need to to be fixed to handle proxy tests.
	describe( 'when using proxy', () => {
		beforeAll( async () => {
			await activatePlugin( 'e2e-tests-proxy-auth-plugin' );
			await setSiteVerification();
			await setSearchConsoleProperty();
		} );

		afterAll( async () => {
			await deactivatePlugin( 'e2e-tests-proxy-auth-plugin' );
		} );

		it( 'displays core site notifications on the main dashboard', async () => {
			// Add the test notification (by default there are none).
			await wpApiFetch( {
				path: 'google-site-kit/v1/e2e/core/site/notifications',
				method: 'post',
				data: testSiteNotification,
			} );

			// Go to the main dashboard and wait for notifications to be requested.
			await Promise.all( [ goToSiteKitDashboard() ] );

			// Ensure the gathering data notification is displayed.
			await page.waitForSelector(
				'.googlesitekit-publisher-win--is-open'
			);
			await expect( page ).toMatchElement(
				'.googlesitekit-publisher-win__title',
				{
					text: /Search console is gathering data/i,
				}
			);
			await expect( page ).toMatchElement(
				'.googlesitekit-publisher-win__desc',
				{
					text: /It can take up to 48 hours before stats show up for your site. While you’re waiting, connect more services to get more stats./i,
				}
			);

			// Dismiss the notification.
			await Promise.all( [
				expect( page ).toClick(
					'.googlesitekit-publisher-win .mdc-button span',
					{
						text: /ok, got it!/i,
					}
				),
			] );

			// Ensure that the notification is no longer displayed.
			await page.waitForSelector(
				'.googlesitekit-publisher-win--is-closed'
			);

			// Ensure that the test notification is displayed.
			await page.waitForSelector(
				'.googlesitekit-publisher-win--is-open'
			);

			await expect( page ).toMatchElement(
				'.googlesitekit-publisher-win__title',
				{
					text: /test notification title/i,
				}
			);
			await expect( page ).toMatchElement(
				'.googlesitekit-publisher-win__desc',
				{
					text: /Test notification content/i,
				}
			);

			// Dismiss the notification.
			await Promise.all( [
				expect( page ).toClick(
					'.googlesitekit-publisher-win .mdc-button span',
					{
						text: /test dismiss site notification/i,
					}
				),
			] );

			// Make sure the dismissed notification is no longer shown.
			let hasTestNotification = await page.$$eval(
				'.googlesitekit-publisher-win:not(.googlesitekit-publisher-win--is-closed) .googlesitekit-publisher-win__title',
				( els ) => {
					return (
						els
							.map( ( el ) => el.textContent )
							.find(
								( text ) =>
									text.match(
										/Search console is gathering data/i
									) ||
									text.match( /test notification title/i )
							) || false
					);
				}
			);
			expect( hasTestNotification ).toStrictEqual( false );

			// Refresh the page, and make sure that notifications are refetched and does not include the dismissed notification.
			await Promise.all( [ page.reload() ] );

			// Ensure the notification is not rendered at all, open or closed.
			hasTestNotification = await page.$$eval(
				'.googlesitekit-publisher-win__title',
				( els ) => {
					return (
						els
							.map( ( el ) => el.textContent )
							.find( ( text ) =>
								text.match( /test notification title/i )
							) || false
					);
				}
			);
			expect( hasTestNotification ).toStrictEqual( false );
		} );
	} );
	describe( 'when not using proxy', () => {
		beforeAll( async () => {
			await activatePlugin( 'e2e-tests-gcp-auth-plugin' );
			await setSiteVerification();
			await setSearchConsoleProperty();
		} );

		afterAll( async () => {
			await deactivatePlugin( 'e2e-tests-gcp-auth-plugin' );
		} );
		it( 'does not display core site notifications on the main dashboard', async () => {
			// Add the test notification (by default there are none).
			await wpApiFetch( {
				path: 'google-site-kit/v1/e2e/core/site/notifications',
				method: 'post',
				data: testSiteNotification,
			} );

			// Go to the main dashboard and wait for notifications to be requested.
			await Promise.all( [ goToSiteKitDashboard() ] );

			// Ensure notification is not displayed.
			const notificationTitles = await page.$$(
				'.googlesitekit-publisher-win__title'
			);
			const notificationDescription = await page.$$(
				'.googlesitekit-publisher-win__desc'
			);

			expect(
				notificationTitles.filter( ( { textContent } ) =>
					textContent?.match( /test notification title/i )
				)
			).toHaveLength( 0 );
			expect(
				notificationDescription.filter( ( { textContent } ) =>
					textContent?.match( /test notification content/i )
				)
			).toHaveLength( 0 );
		} );
	} );
} );
