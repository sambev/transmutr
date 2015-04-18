var SERVICE_URLS = [
    '*://*.spotify.com/track/*',
    '*://play.google.com/music/*'
]

var CHECK_GOOGLE = /play.google/,
    CHECK_SPOTIFY = /play.spotify/;

var ID_GOOGLE = /preview\/([\w\d]+)/,
    ID_SPOTIFY = /track\/([\w\d]+)/;

var SERVICE_GOOGLE = 'google',
    SERVICE_SPOTIFY = 'spotify';

/**
 * takes a url and returns the service it's from and the id of the track
 *
 * example input:
 * https://play.spotify.com/track/1m85PpnCEa9EaU2z6lGwmO
 * https://play.google.com/music/preview/Th73lqpq5emphzzyg4mqgt4fwnu
 *
 * example output:
 * { service: 'spotify', id: '1m85PpnCEa9EaU2z6lGwmO' }
 * { service: 'google', id: 'Th73lqpq5emphzzyg4mqgt4fwnu' }
 *
 * @param {String} url
 * @return {Object}
 */
function parse(url) {
    function id(parser) {
        var parts = url.match(parser);
        return parts && parts.pop();
    }

    switch (true) {
        case CHECK_SPOTIFY.test(url):
            return {
                service: SERVICE_SPOTIFY,
                id: id(ID_SPOTIFY)
            };
            break;

        case CHECK_GOOGLE.test(url):
            return {
                service: SERVICE_GOOGLE,
                id: id(ID_GOOGLE)
            };
            break;
    }
}

/**
 * @return {Object}
 */
function get_user_info() {
    return JSON.parse(localStorage.getItem('user'));
}

/**
 * @param {Object} user info object. right now just a `service` is required
 */
function set_user_info(info) {
    localStorage.setItem('user', JSON.stringify(info));
}

/**
 * handles requests the browser is about to make that match the specified
 * filters. see SERVICE_URLS
 * @param {Object} req
 */
function incoming_request(req) {
    console.log('%s => %s', req.method, req.url);
    console.log(parse(req.url));

    // var info = parse(req.url);
    // var user = get_user_info();
    //
    // // info.service will be spotify, google, etc.
    // var incoming_service = get_integration_for(info.service);
    // var outgoing_service = get_integration_for(user.service);
    //
    // // info.id will be the track id we got from the url
    // var track = incoming_service.get_track_info(info.id)
    //
    // console.log(outgoing_service.find_track_url(track));
}

// https://developer.chrome.com/extensions/background_pages
chrome.webRequest.onBeforeRequest.addListener(incoming_request, { urls: SERVICE_URLS }, []);

// XXX
set_user_info({ service: SERVICE_SPOTIFY });
