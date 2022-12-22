/**
 * Sciter in-app analytics for Amplitude
 *
 * @author 8ctopus <hello@octopuslabs.io>
 */

import * as env from "@env";

export default class Amplitude {
    static #endpoint;
    static #apiKey;
    static #userId;

    static #eventProperties = [];

    static #log;

    static #headers = {
        "Content-Type": "application/json; charset=utf-8",
        Accept: "*/*",
    };

    static #env;
    static #events = [];

    /**
     * Initialize
     * @param {object} options
     */
    static init(options) {
        this.#endpoint = options.endpoint ?? "";
        this.#apiKey = options.apikey ?? "";
        this.#userId = options.userId ?? "";
        this.#eventProperties = options.eventProperties ?? [];

        // add environment variables
        this.#env = {
            device: env.DEVICE,
            platform: env.PLATFORM,
            os: env.OS,
            language: env.language(),
            country: env.country(),
            userName: env.userName(),
        };

        this.#log = options.log ?? false;
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
     * @param {object} eventProperties
     */
    static event(label, eventProperties) {
        this.#events.push({
            eventProperties: {
                ...this.#eventProperties,
                ...eventProperties,
            },
            userId: this.#userId,
            eventType: label,
            time: Math.round(Date.now() / 1000),
        });

        /*
        this.#events.push({
            label,
            timestamp: new Date(),
        });

        if (this.#log)
            console.log(`event - ${label}`);
        */
    }

    /**
     * Watch
     * @param {string} event
     * @param {string} selector
     * @param {string} label
     * @param {object} eventProperties
     * @returns {boolean}
     * @throws Error
     */
    static watch(event, selector, label, eventProperties) {
        if (arguments.length < 3)
            throw new Error("method requires 3 arguments");

        //console.log(`${event} - ${selector} - ${label}`);

        if (selector) {
            document.on(event, selector, () => {
                this.event(label, eventProperties);
                console.log(`${event} - ${selector} - ${label}`);
            });
        }
        /*
        else {
            document.on(event, () => {
                this.event(label);
            });
        }
        */

        return true;
    }

    /**
     * Send analytics to remote server
     * @returns {Promise}
     */
    static async send() {
        const body = JSON.stringify({
            apiKey: this.#apiKey,
            //env: this.#env,
            events: this.#events,
        });

        if (this.#log) {
            console.debug(`endpoint ${this.#endpoint}`);
            console.debug(this.#events);
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
            //console.log(response.text());
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
