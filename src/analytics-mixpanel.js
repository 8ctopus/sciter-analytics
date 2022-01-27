/**
 * Sciter in-app analytics
 * @author 8ctopus <hello@octopuslabs.io>
 */

import * as env from "@env";

export default class AnalyticsMixPanel {
    static #endpoint;
    static #distinct_id;
    static #token;

    static #device = [];

    static #event_properties = [];

    static #log;

    static #headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "text/plain",
    };

    static #env;
    static #events = [];

    /**
     * Initialize
     * @param {object} options
     */
    static init(options) {
        this.#endpoint = options.endpoint ?? "";
        this.#token = options.token ?? "";
        this.#distinct_id = options.distinct_id ?? "";
        this.#event_properties = {token: this.#token, distinct_id: this.#distinct_id};

        this.#log = options.log ?? false;
    }

    /** Set device info
     * @param {object} device info - device_model, platform, os_version, device_id
    */
    static device(deviceInfo) {
        this.#device = {
            ...deviceInfo,
        };

        if (this.#log)
            console.log(`device - ${this.#device}`);
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
     * @param {object} event properties
     */
    static event(label, event_properties) {
        this.#events.push({
            event: label,
            properties: {...this.#event_properties, ...event_properties},
        });
     
        if (this.#log)
            console.log(`event - ${label}`);
    }

    /**
     * Watch
     * @param {string} event
     * @param {string} selector
     * @param {string} label
     * @returns {boolean}
     * @throws Error
     */
    static watch(event, selector, label, event_properties) {
        if (arguments.length < 3)
            throw new Error("method requires 3 arguments");

        //console.log(`${event} - ${selector} - ${label}`);

        if (selector) {
            document.on(event, selector, () => {
                this.event(label, event_properties);
                console.log(`${event} - ${selector} - ${label}`);
            });
        }
        /**
        else {
            document.on(event, () => {
                this.event(label);
            });
        }
        */

        return true;
    }

    //const [hours, minutes, seconds] = new Date().toLocaleTimeString("en-US").split(/:| /)

    /**
     * Send analytics to remote server
     * @returns {Promise}
     */
    static async send() {

        const body = "data=" + JSON.stringify(
            this.#events,
        );

        if (this.#log) {
            console.debug(`endpoint ${this.#endpoint}`);
            console.debug("data=" + body);
        }

        const response = await fetch(this.#endpoint, {
            method: "POST",
            cache: "no-cache",
            headers: this.#headers,
            body
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
