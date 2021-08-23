/**
 * Sciter in-app analytics
 * @author 8ctopus <hello@octopuslabs.io>
 */

import * as env from "@env";
import {uuid} from "@sciter";

export class analytics
{
    static #endpoint;
    static #log;

    static #headers = {
        "Content-Type": "application/json; charset=utf-8",
        "Accept": "*/*",
    };

    static #env;
    static #events = [];

    /**
     * Initialize
     * @param object options
     * @return void
     */
    static init(options)
    {
        this.#endpoint = options.endpoint ?? "";
        this.#log      = options.log ?? false;

        // add environment variables
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
     * @param object env
     * @return void
     */
    static env(env)
    {
        this.#env = {
            ...this.#env,
            ...env,
        }
    }

    /**
     * Add event
     * @param string label - event label
     * @return void
     */
    static event(label)
    {
        this.#events.push({
            label: label,
            timestamp: new Date(),
        });

        if (this.#log)
            console.debug(`event - ${label}`);
    }

    /**
     * Watch
     * @param string event
     * @param string selector
     * @param string label
     * @return void
     * @throws Error
     */
    static watch(event, selector, label)
    {
        if (arguments.length !== 3)
            throw new Error("method requires 3 arguments");

        //console.debug(`${event} - ${selector} - ${label}`);

        if (selector)
            document.on(event, selector, () => {
                this.event(label);
            });
        else
            document.on(event, () => {
                this.event(label);
            });

        return true;
    }

    //const [hours, minutes, seconds] = new Date().toLocaleTimeString("en-US").split(/:| /)

    /**
     * Send analytics to remote server
     * @return Promise
     */
    static async send()
    {
        const body = JSON.stringify({
            env: this.#env,
            events: this.#events,
        });

        //console.debug(body);

        console.debug(`endpoint ${this.#endpoint}`);

        const response = await fetch(this.#endpoint, {
            method: "POST",
            cache: "no-cache",
            headers: this.#headers,
            body: body,
        });

        console.line();

        if (response.status !== 200 || !response.ok) {
            console.error(`response status - ${response.status}`);
            return;
        }

        const json = await response.json();

        //console.log(response.text());
        console.log(json);
    }

    /**
     * Log environment and events
     * @return void
     */
    static log()
    {
        // log environment
        console.debug(this.#env);
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
        console.debug(this.#events);
    }
}
