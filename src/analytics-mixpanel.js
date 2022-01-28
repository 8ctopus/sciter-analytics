/**
 * Sciter in-app analytics
 * @author 8ctopus <hello@octopuslabs.io>
 */

import * as env from "@env";

export default class AnalyticsMixPanel {
    
    // track endpoint
    static #endpoint = "https://api.mixpanel.com/track";

    // user profile endpoint
    static #userendpoint = "https://api.mixpanel.com/engage";

    // unique id to identify user
    static #distinct_id;

    // project token
    static #token;

    //events stack
    static #events = [];

    // event subproperties stack
    static #event_properties = [];

    // user profile stack
    static #user_profile = [];

    // user profile subproperties stack
    static #user_profile_set = [];

    static #headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "text/plain",
    };

    static #env;
    static #log;

    /**
     * Initialize
     * @param {object} options - token, distinct_id
     */
    static init(options) {
        this.#token = options.token ?? "";
        this.#distinct_id = options.distinct_id ?? "";

        // keep this as they have to be specify in each request to mixpanel
        this.#event_properties = {token: this.#token, distinct_id: this.#distinct_id};

        // prepare the user profil stack with approriate tokens
        this.#user_profile = {$token: this.#token, $distinct_id: this.#distinct_id};

        this.#log = options.log ?? false;
    }

    /**
    * Add user profile properties
    * @params {user_properties} - properties to add
    * @note this function overrides properties  
    */ 
    static userprofile(user_profile) {

        this.#user_profile = {...this.#user_profile, ...user_profile};
     
        if (this.#log)
            console.log(`user profile - ${this.#user_profile}`);
    }


    /**
    * Add user profile properties
    * @params {user_properties} - properties to add. Can have any key. Reserved keys are: $name, $email, $country_code, $region, $city
    * @note this function overrides properties  
    */ 
    static userprofileset(user_properties) {

        this.#user_profile_set = user_properties;
     
        if (this.#log)
            console.log(`properties - ${user_properties}`);
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
     * @param {object} event_properties - subproperties of the event
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
     * @param {string} label - event label
     * @param {object} event_properties - event subproperties
     * @returns {boolean}
     */
    static watch(event, selector, label, event_properties) {

        if (this.#log)
            console.log(`${event} - ${selector} - ${label} - ` + JSON.stringify(event_properties));

        if (selector) {
            document.on(event, selector, () => {
                this.event(label, event_properties);
                console.log(`${event} - ${selector} - ${label}`);
            });
        }
        else {
            document.on(event, () => {
                this.event(label, event_properties);
            });
        }

        return true;
    }

    /**
     * Send all analytics (event & user profile) to mixpanel
     * @returns {Promise}
     */
    static async send() {
        this.senduserprofile();
        this.sendevent();
    }

    /**
     * Send events to mixpanel
     * @returns {Promise}
     */
    static async sendevent() {
        const body = "data=" + JSON.stringify(
            this.#events,
        );

        if (this.#log) {
            console.line();
            console.log('sending events');
            console.debug(`endpoint ${this.#endpoint}`);
            console.debug(body);
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
            console.log(json);
        }
    }

    /**
     * Send user profile to mixpanel
     * @returns {Promise}
     */
    static async senduserprofile() {
        const data = "data=" + JSON.stringify({
            ...this.#user_profile, 
            $set: this.#user_profile_set
        });

        if (this.#log) {
            console.line();
            console.log('sending user profile');
            console.debug(`endpoint ${this.#userendpoint}`);
            console.debug(data);
        }

        const response = await fetch(this.#userendpoint, {
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
