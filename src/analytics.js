/**
 * Sciter in-app analytics
 * @author 8ctopus <hello@octopuslabs.io>
 */

import * as env from "@env";

export default class Analytics {
    static #endpoint;
    static #api_key;
    static #user_id;

    static #device = [];

    static #event_properties = [];

    static #log;

    static #headers = {
        "Content-Type": "application/json; charset=utf-8",
        "Accept": "*/*",
    };

    static #env;
    static #events = [];

    /**
     * Initialize
     * @param {object} options
     */
    static init(options) {
        this.#endpoint = options.endpoint ?? "";
        this.#api_key = options.apikey ?? "";
        this.#user_id = options.user_id ?? "";
        this.#event_properties = options.event_properties ?? [];
        
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

    static device(deviceInfo) {
        this.#device = {
            ...deviceInfo
        }

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
     */
    static event(label) {

        this.#events.push({
            ...this.#device,
            ...this.#event_properties,
            user_id: this.#user_id,
            event_type: label,
            time: Math.round(Date.now() / 1000)
        });
        /**
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
     * @returns {boolean}
     * @throws Error
     */
    static watch(event, selector, label) {
        if (arguments.length !== 3)
            throw new Error("method requires 3 arguments");

        console.log(`${event} - ${selector} - ${label}`);

        if (selector) {
            document.on(event, selector, () => {
                this.event(label);
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
        const body = JSON.stringify({
            api_key: this.#api_key,

    //      env: this.#env,
            events: this.#events,
        });

        if (this.#log) {
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
