/**
 * Mixpanel in-app analytics
 *
 * @author 8ctopus <hello@octopuslabs.io>
 * @notes https://developer.mixpanel.com/
 */

import * as env from "@env";

export default class Mixpanel {
    // event tracking endpoint
    #apiEvent = "https://api.mixpanel.com/track?verbose=1&ip=1";

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
            console.log("Add properties -", properties);

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
            console.log(`Add event - ${label} - ` + JSON.stringify(properties ?? {}));

        this.#events.push({
            event: label,
            properties: {
                token: this.#token,
                distinct_id: this.#userId,
                time: Date.now() / 1000,
                //insert_id: Utils.randomStr(22),
                $os: env.PLATFORM, // Windows
                //$os2: env.OS, // Windows-10.2
                //device: env.DEVICE, // desktop
                language: env.language(), // en
                //country_code: env.country(), // US
                ...properties,
            },
        });
    }

    /**
     * Send events to mixpanel
     * @returns {Promise}
     */
    async sendEvents() {
        if (this.#debug) {
            console.line();
            console.log("Send events...");
            //console.debug(`endpoint ${this.#apiEvent}`);
            console.debug(this.#events);
        }

        const response = await fetch(this.#apiEvent, {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                Accept: "*/*",
            },
            body: JSON.stringify(this.#events),
        });

        if (response.status !== 200 || !response.ok) {
            console.error(`Send events - FAILED - response - ${response.status} - ${response.ok}`);
            return;
        }

        const json = await response.json();

        if (json.status !== 1) {
            console.error("Send events - FAILED - json -", json);
            return;
        }

        console.log("Send events - OK");

        if (this.#debug) {
            console.line();
            console.debug("Send events - response -", json);
        }
    }

    /**
     * Send user profile to mixpanel
     * @returns {Promise}
     */
    async sendUser() {
        const data = [{
            $token: this.#token,
            $distinct_id: this.#userId,
            $set: this.#user,
        }];

        if (this.#debug) {
            console.line();
            console.log("Send user...");
            console.debug(`endpoint ${this.#apiUser}`);
            console.debug(data);
        }

        const response = await fetch(this.#apiUser, {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                Accept: "*/*",
            },
            body: JSON.stringify(data),
        });

        if (response.status !== 200 || !response.ok) {
            console.error(`Send user - FAILED - response - ${response.status} - ${response.ok}`);
            return;
        }

        const text = await response.text();

        if (text !== "1") {
            console.error("Send user - FAILED - text -", text);
            return;
        }

        console.log("Send user - OK");
    }

    /**
     * Send events and user to mixpanel
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
     * @throws Error
     * @returns {boolean}
     */
    watch(event, selector, label, properties) {
        if (arguments.length < 3)
            throw new Error("method requires a minimum of 3 arguments");

        if (this.#debug)
            console.log(`Watch - ${label} - ${event} - ${selector} - ` + JSON.stringify(properties));

        if (selector) {
            document.on(event, selector, () => {
                console.log(`Event triggered - ${label} - ${event} - ${selector}`);
                this.event(label, properties);
            });
        } else {
            document.on(event, () => {
                console.log(`Event triggered - ${label} - ${event}`);
                this.event(label, properties);
            });
        }

        return true;
    }

    /**
     * Log environment and events
     */
    log() {
        // log environment
        console.log(this.#user);

        // log events
        console.log(this.#events);
    }
}
