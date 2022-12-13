/**
 * Sciter in-app analytics
 *
 * @author 8ctopus <hello@octopuslabs.io>
 */

export default class AnalyticsMixPanel {
    // event tracking endpoint
    static #apiEvent = "https://api.mixpanel.com/track";

    // user profile endpoint
    static #apiUser = "https://api.mixpanel.com/engage";

    // project token
    static #token;

    // user unique id
    static #distinctId;

    // events stack
    static #events = [];

    // user profile subproperties stack
    static #userProfileSet = [];

    static #headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "text/plain",
    };

    static #env;
    static #log;

    /**
     * Initialize
     * @param {object} options
     */
    static init(options) {
        this.#token = options.token;
        this.#distinctId = options.distinctId;

        this.#log = options.log ?? false;
    }

    /**
     * Add user profile properties
     * @param {object} userProperties - properties to add. Can have any key. Reserved keys are: $name, $email, $country_code, $region, $city
     * @note this function overrides properties
     */
    static userProfileSet(userProperties) {
        this.#userProfileSet = userProperties;

        if (this.#log)
            console.log(`properties - ${userProperties}`);
    }

    /**
     * Add environment variables
     * @param {object} environment
     */
    static env(environment) {
        this.#env = {
            ...this.#env,
            ...environment,
        };
    }

    /**
     * Add event
     * @param {string} label - event label
     * @param {object} eventProperties - subproperties of the event
     */
    static event(label, eventProperties) {
        this.#events.push({
            event: label,
            properties: {
                token: this.#token,
                distinct_id: this.#distinctId,
                ...eventProperties,
            },
        });

        if (this.#log)
            console.log(`event - ${label}`);
    }

    /**
     * Watch
     * @param {string} event
     * @param {string} selector
     * @param {string} label - event label
     * @param {object} eventProperties - event subproperties
     * @returns {boolean}
     */
    static watch(event, selector, label, eventProperties) {
        if (this.#log)
            console.log(`${event} - ${selector} - ${label} - ` + JSON.stringify(eventProperties));

        if (selector) {
            document.on(event, selector, () => {
                this.event(label, eventProperties);
                console.log(`${event} - ${selector} - ${label}`);
            });
        } else {
            document.on(event, () => {
                this.event(label, eventProperties);
            });
        }

        return true;
    }

    /**
     * Send all analytics (event & user profile) to mixpanel
     * @returns {Promise}
     */
    static async send() {
        this.sendUserProfile();
        this.sendEvent();
    }

    /**
     * Send events to mixpanel
     * @returns {Promise}
     */
    static async sendEvent() {
        const body = "data=" + JSON.stringify(
            this.#events,
        );

        if (this.#log) {
            console.line();
            console.log("sending events...");
            console.debug(`endpoint ${this.#apiEvent}`);
            console.debug(body);
        }

        const response = await fetch(this.#apiEvent, {
            method: "POST",
            cache: "no-cache",
            headers: this.#headers,
            body,
        });

        if (response.status !== 200 || !response.ok) {
            console.error(`response status - ${response.status}`);
            return;
        }

        const json = await response.json();

        if (this.#log) {
            console.line();
            console.log(json);
        }
    }

    /**
     * Send user profile to mixpanel
     * @returns {Promise}
     */
    static async sendUserProfile() {
        const data = "data=" + JSON.stringify({
            token: this.#token,
            distinct_id: this.#distinctId,
            $set: this.#userProfileSet,
        });

        if (this.#log) {
            console.line();
            console.log("sending user profile...");
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
            console.error(`response status - ${response.status}`);
            return;
        }

        const json = await response.json();

        if (this.#log) {
            console.line();
            console.log(json);
        }
    }

    /**
     * Log environment and events
     */
    static log() {
        // log environment
        console.log(this.#env);

        /*
        for (const key in this.#env) {
            console.debug(`${key}: ${this.#env[key]}`);
        }

        // loop through events
        this.#events.forEach(function(event) {
            // log event
            console.debug(event);
        })
        */

        // log events
        console.log(this.#events);
    }
}
