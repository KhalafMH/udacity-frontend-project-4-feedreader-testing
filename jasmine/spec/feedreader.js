/* feedreader.js
 *
 * This is the spec file that Jasmine will read and contains
 * all of the tests that will be run against your application.
 */

/* We're placing all of our tests within the $() function,
 * since some of these tests may require DOM elements. We want
 * to ensure they don't run until the DOM is ready.
 */
$(function () {

    describe('RSS Feeds', function () {
        /* This is our first test - it tests to make sure that the
         * allFeeds variable has been defined and that it is not
         * empty. Experiment with this before you get started on
         * the rest of this project. What happens when you change
         * allFeeds in app.js to be an empty array and refresh the
         * page?
         */
        it('are defined', function () {
            expect(allFeeds).toBeDefined();
            expect(allFeeds.length).not.toBe(0);
        });


        /* Ensures that all feeds have a URL defined
         * and that the URL is not empty.
         */
        it('has entries with a non-empty URL', function () {
            allFeeds.forEach(function (feed) {
                expect(feed.url).toBeDefined();
                expect(feed.url.length).not.toBe(0);
            })
        });


        /* ensures that all feeds have a name defined
         * and that the name is not empty.
         */
        it('has entries with a non-empty name', function () {
            allFeeds.forEach(function (feed) {
                expect(feed.name).toBeDefined();
                expect(feed.name.length).not.toBe(0);
            })
        });
    });


    describe('The menu', function () {

        it('is hidden by default', function () {
            const menu = document.querySelector('.slide-menu');
            expect(menu.getBoundingClientRect().right).toBeLessThanOrEqual(0);
        });

        it('changes visibility when clicked', async function () {
            const menu = document.querySelector('.slide-menu');
            const menuIcon = document.querySelector('.menu-icon-link');

            // should be hidden
            expect(menu.getBoundingClientRect().right).toBeLessThanOrEqual(0);

            await clickAndWaitTransition(menuIcon, menu);

            // should be visible
            expect(menu.getBoundingClientRect().left).toBeGreaterThanOrEqual(0);

            await clickAndWaitTransition(menuIcon, menu);

            // should be hidden
            expect(menu.getBoundingClientRect().right).toBeLessThanOrEqual(0);
        })
    });


    describe('Initial Entries', function () {

        /* Ensures that when the loadFeed
         * function is called and completes its work, there is at least
         * a single .entry element within the .feed container.
         */
        it('should at least be 1 entry', async function () {
            const feedContainer = document.querySelector('.feed');

            // ensure that the feed container has no elements initially
            feedContainer.innerHTML = '';

            expect(feedContainer.querySelectorAll('.entry').length).toBe(0);

            // load the feed
            await new Promise(resolve => loadFeed(0, resolve));

            expect(feedContainer.querySelectorAll('.entry').length).toBeGreaterThanOrEqual(1);
        });
    });


    describe("New Feed Selection", function () {

        /* Ensures that when a new feed is loaded
         * by the loadFeed function that the content actually changes.
         */
        it('should result in loading new entries', async function () {
            const feedContainer = document.querySelector('.feed');

            // load the first feed
            await new Promise(resolve => loadFeed(0, resolve));
            expect(feedContainer.childElementCount).toBeGreaterThan(0);
            const initialEntries = Array.from(feedContainer.querySelectorAll('.entry-link')).map(a => a.href);

            // load the second feed
            await new Promise(resolve => loadFeed(1, resolve));
            expect(feedContainer.childElementCount).toBeGreaterThan(0);
            const eventualEntries = Array.from(feedContainer.querySelectorAll('.entry-link')).map(a => a.href);

            // expect the two to have different entries
            expect(eventualEntries).not.toEqual(initialEntries);
        });
    });

    /**
     * Calls `clickable.click()` and then waits for `transitionable` to complete its transition.
     * @param clickable {HTMLElement} - The element to click.
     * @param transitionable {HTMLElement} - The element to wait for to complete its transition.
     * @returns {Promise<void>}
     */
    async function clickAndWaitTransition(clickable, transitionable) {
        clickable.click();
        await new Promise(resolve => transitionable.addEventListener('transitionend', resolve));
    }
}());
