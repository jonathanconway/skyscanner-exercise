# Implementation:

### Q) What libraries did you add to the frontend? What are they used for?

* Client
  * Added backpack components, to achieve consistent look & feel.
  * Added luxon, for parsing and formatting date-time and duration values.
  * Moved a lot of devDependencies to dependencies, as they are actually used at runtime, not just dev time.

* Server
  * Added jest to the server package, to aid in unit-testing server-side code.

### Q) What is the command to start the server?

(Default) `APIKEY=<key> npm run server`

---

As above.

# General:

### Q) How long, in hours, did you spend on the test?

8-10 hours.

My apologies for the delay in submitting the assignment. I came down with a really nasty cold and was coughing all night and unable to get enough sleep. I've also been under a bit stress, due to applying for a UK visa and not knowing dates/times of approval.

### Q) If you had more time, what further improvements or new features would you add?

* Client
  * Test for accessibility and improve as needed.
  * Improve, clean up and better test the 'next monday' calculation logic in App.jsx. It was added hastily, as I forgot about this requirement till the very end and ended up having to rush it. Sorry!
  * Implement other features, such as paging, filtering, sorting, etc.
  * Find a more elegant and robust way to map the 'carrier icon' image URLs in the Itinerary component.
  * Find a way to eliminate the annoying warnings around 'useEffect' usage in FlightSearch component.
  * Extract date/time formatting to utils to reduce coupling to luxon.
  * Thoroughly test in multiple browsers (Firefox, Edge, etc.). Currently only tested in Chrome.
  * Thoroughly test in multiple devices (iPhone, Android, Windows Phone). Currently only tested in Chrome emulator.
  * Make it responsive for multiple screen sizes (desktop, tablet).
  * Run `npm audit` and fix security issues.
  * Change to using barrel imports (e.g. './Actions') rather than directly importing files (e.g. './Actions/Actions').
  * Move FAV_ICON_HOST_AND_PATH to separate config file.

* Server
  * Add more thorough logging.
  * Add structured logging, for monitoring and/or diagnosis purposes.
  * Add more inline documentation (JSDoc)
  * Move currency info currently in live-pricing out to config.
  * Unit test all un-tested code - live-pricing, server.
  * Find a more elegant way to unit test the flight-search module. I put the test data in a separate file, because it was so hefty that it would have added lots of clutter to the unit test file. I wonder if there's a better way this could have been done. It's tricky, because most of the data really is needed, so you can't just remove it. But maybe there's a better way than putting it in a separate test data file. Need to think about this and maybe research online.
  * Improve unit tests to handle more subtle edge-cases.

* Both
  * Add a shared code package, for modules that are shared by both client and server.
    * Shared models.
    * Shared validation.
    * Shared utils.

### Q) Which parts are you most proud of? And why?

* Client
  * I think FlightSearch screen component is nicely and cleanly implemented. You can see all the major elements in one file, in only a couple of screen-fulls. The screen shows a spinner while loading and pops up a notification if there was an error - these feedback mechanisms make for a good user experience.

* Server
  * I think the validation of inputs in the /api/search handler was a prudent security measure. It was also nicely implemented, with clearly named functions, encapsulated within a simple 'validateApiSearch' function. All fairly thoroughly unit tested (though could always be improved to handle more edge-cases).

### Q) Which parts did you spend the most time with? What did you find most difficult?

* Client
  * Went down the track of implementing a lot of the styling by hand, only to discover that most of my styling/UI needs could be better met by simply re-using pre-existing Backpack components. So I went back and re-implemented most things that way, and it ended up working really nicely.
  * Spent quite a bit of time trying to get the Jest tests to work properly with the FlightSearch component - specifically, the useEffect call. Also spent a lot of time trying to suppress the warnings that come up when running the tests, but ended up running out of time for that.

* Server
  * Spent a long time thinking about, and experimenting with, various ways of transforming the live pricing data into appropriately structured search results. For example, I had the idea of writing a function that just de-normalizes the data, then another one that extracts only the pieces we need. I ended up settling on the current set of functions, which each specialise in one part of the data-set. The result just seemed a bit less convoluted and easier to read. And it turned out that the search results data matches the live pricing data quite closely, so it makes sense to break up the code that way.
  * Unit testing the express code was a little tricky, as it's been a while since I did that.

### Q) How did you find the test overall? If you have any suggestions on how we can improve the test or our API, we'd love to hear them.

It's a cool, fun and educational challenge.

* Clearly defined outcome, in terms of behaviour and look & feel.
* Room for creativity or innovative approaches.
* Realistic scenario - feels like a challenge you'd face in 'real life'. :)

Perhaps it could be improved a little.

* Could be a bit more detail around quality and non-functional requirements.
  * Are you looking for efficiency (time/space)?
  * Are you looking for security measures?
  * Are you looking for unit testing? If so, how thoroughly? And do you prefer a test-first approach?
  * Are you looking for maintainable, extensible code?
* Perhaps a bit more structure on the server-side would be nice, to make it easier to focus on building the solution. E.g. having a unit-test framework already installed.
* There were npm errors initially, due to out-of-date packages. It was pretty easy to resolve these, though.