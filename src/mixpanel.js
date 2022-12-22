/**
 * Sciter in-app analytics
 *
 * @author 8ctopus <hello@octopuslabs.io>
 */

export default class MixPanel {
    // event tracking endpoint
    #apiEvent = "https://api.mixpanel.com/track?verbose=1&ip=0";

    // user profile endpoint
    #apiUser = "https://api.mixpanel.com/engage?verbose=1#profile-set";

    // project token
    #token;

    // user unique id
    #userId;

    // events
    #events = [];

    // user properties
    #user = {};

    #headers = {
        "Content-Type": "application/json; charset=utf-8",
        Accept: "*/*",
    };

    #debug;

    /**
     * Constructor
     * @param {object} options
     */
    constructor(options) {
        this.#token = options.token;
        this.#userId = options.userId;
        this.#debug = options.debug ?? false;
    }

    /**
     * Add user properties
     * @param {object} properties - properties to add. Reserved keys are: $name, $email, $country_code, $region, $city
     */
    properties(properties) {
        if (this.#debug)
            console.log(`Add properties - ${properties}`);

        this.#user = {
            ...this.#user,
            ...properties,
        };
    }

    /**
     * Add event
     * @param {string} label - event label
     * @param {object} properties - event properties
     */
    event(label, properties) {
        if (this.#debug)
            console.log(`Add event - ${label}`);

        this.#events.push({
            event: label,
            properties: {
                token: this.#token,
                distinct_id: this.#userId,
                time: Date.now() / 1000,
                ...properties,
            },
        });
    }

    /**
     * Send events to mixpanel
     * @returns {Promise}
     */
    async sendEvents() {
        const body = JSON.stringify(
            this.#events,
        );

        if (this.#debug) {
            console.line();
            console.log("Send events...");
            //console.log(`endpoint ${this.#apiEvent}`);
            console.log(body);
        }

        const response = await fetch(this.#apiEvent, {
            method: "POST",
            cache: "no-cache",
            headers: this.#headers,
            body,
        });

        if (response.status !== 200 || !response.ok) {
            console.error(`Send events - FAILED - ${response.status}`);
            return;
        }

        if (this.#debug) {
            console.line();
            const json = await response.json();
            console.log("Send events - OK", json);
        }
    }

    /**
     * Send user profile to mixpanel
     * @returns {Promise}
     */
    async sendUser() {
        const data = JSON.stringify({
            token: this.#token,
            distinct_id: this.#userId,
            $set: this.#user,
        });

        if (this.#debug) {
            console.line();
            console.log("Send user profile...");
            console.debug(`endpoint ${this.#apiUser}`);
            console.debug(data);
        }

        const response = await fetch(this.#apiUser, {
            method: "POST",
            cache: "no-cache",
            headers: this.#headers,
            body: data,
        });

        if (response.status !== 200) {
            console.error(`Send user profile - FAILED - ${response.status}`);
            return;
        }

        if (this.#debug) {
            console.line();
            const json = await response.json();
            console.log("Send user profile - OK", json);
        }
    }

    /**
     * Send all to mixpanel
     * @returns {Promise}
     */
    async send() {
        this.sendEvents();
        this.sendUser();
    }

    /**
     * Watch
     * @param {string} event
     * @param {string} selector
     * @param {string} label - event label
     * @param {object} properties - event properties
     * @returns {boolean}
     */
    watch(event, selector, label, properties) {
        if (this.#debug)
            console.log(`Watch ${event} - ${selector} - ${label} - ` + JSON.stringify(properties));

        if (selector) {
            document.on(event, selector, () => {
                console.log(`Event triggered - ${event} - ${selector} - ${label}`);
                this.event(label, properties);
            });
        } else {
            document.on(event, () => {
                console.log(`Event triggered - ${event} - ${label}`);
                this.event(label, properties);
            });
        }

        return true;
    }
}
