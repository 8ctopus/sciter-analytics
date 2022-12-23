/**
 * Amplitude in-app analytics
 *
 * @author 8ctopus <hello@octopuslabs.io>
 * @notes https://developers.amplitude.com/docs
 */

import * as env from "@env";

export default class Amplitude {
    #endpoint = "https://api2.amplitude.com/2/httpapi";
    #apiKey;
    #userId;
    #debug;

    #events = [];
    #eventProperties;

    #env;

    /**
     * Constructor
     * @param {object} options
     */
    constructor(options) {
        this.#apiKey = options.apikey ?? "";
        this.#userId = options.userId ?? "";
        this.#eventProperties = options.eventProperties ?? {};
        this.#debug = options.debug ?? false;

        // default environment variables
        this.#env = {
            device: env.DEVICE,
            platform: env.PLATFORM,
            os: env.OS,
            language: env.language(),
            country: env.country(),
            userName: env.userName(),
        };
    }

    /**
     * Add environment variables
     * @param {object} environment
     */
    env(environment) {
        this.#env = {
            ...this.#env,
            ...environment,
        };
    }

    /**
     * Add event
     * @param {string} label - event label
     * @param {object} properties
     */
    event(label, properties) {
        if (this.#debug)
            console.log(`Add event - ${label} - ` + JSON.stringify(properties ?? {}));

        this.#events.push({
            eventProperties: {
                ...this.#eventProperties,
                ...properties,
            },
            userId: this.#userId,
            eventType: label,
            time: Math.round(Date.now() / 1000),
        });
    }

    /**
     * Send analytics to remote server
     * @returns {Promise}
     */
    async send() {
        const body = JSON.stringify({
            apiKey: this.#apiKey,
            //env: this.#env,
            events: this.#events,
        });

        if (this.#debug) {
            console.debug(`endpoint ${this.#endpoint}`);
            console.debug(this.#events);
        }

        const response = await fetch(this.#endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                Accept: "*/*",
            },
            body,
        });

        if (response.status !== 200 || !response.ok) {
            console.error(`response status - ${response.status}`);
            return;
        }

        const json = await response.json();

        if (this.#debug) {
            console.line();
            //console.log(response.text());
            console.log(json);
        }
    }

    /**
     * Watch
     * @param {string} event
     * @param {string} selector
     * @param {string} label
     * @param {object} properties
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
        console.log(this.#env);

        // log events
        console.log(this.#events);
    }
}
