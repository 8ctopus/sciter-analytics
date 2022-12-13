/**
 * Sciter in-app analytics
 * @author 8ctopus <hello@octopuslabs.io>
 */

export default class AnalyticsMixPanel {
    // track endpoint
    static #endpoint = "https://api.mixpanel.com/track";

    // user profile endpoint
    static #userEndpoint = "https://api.mixpanel.com/engage";

    // unique id to identify user
    static #distinctId;

    // project token
    static #token;

    //events stack
    static #events = [];

    // event subproperties stack
    static #eventProperties = [];

    // user profile stack
    static #userProfile = [];

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
     * @param {object} options - token, distinctId
     */
    static init(options) {
        this.#token = options.token ?? "";
        this.#distinctId = options.distinctId ?? "";

        // keep this as they have to be specify in each request to mixpanel
        this.#eventProperties = {
            token: this.#token,
            distinctId: this.#distinctId
        };

        // prepare the user profil stack with approriate tokens
        this.#userProfile = {
            $token: this.#token,
            $distinctId: this.#distinctId
        };

        this.#log = options.log ?? false;
    }

    /**
     * Add user profile properties
     * @param {object} userProfile - properties to add
     * @note this function overrides properties
     */
    static userProfile(userProfile) {
        this.#userProfile = {
            ...this.#userProfile,
            ...userProfile,
        };

        if (this.#log)
            console.log(`user profile - ${this.#userProfile}`);
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
                ...this.#eventProperties,
                ...eventProperties
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
            console.log("sending events");
            console.debug(`endpoint ${this.#endpoint}`);
            console.debug(body);
        }

        const response = await fetch(this.#endpoint, {
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
            ...this.#userProfile,
            $set: this.#userProfileSet,
        });

        if (this.#log) {
            console.line();
            console.log("sending user profile");
            console.debug(`endpoint ${this.#userEndpoint}`);
            console.debug(data);
        }

        const response = await fetch(this.#userEndpoint, {
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
