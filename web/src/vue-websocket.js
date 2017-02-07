const socketState = {
  CONNECTING:	0, //	The connection is not yet open.
  OPEN:       1, //	The connection is open and ready to communicate.
  CLOSING:    2, //	The connection is in the process of closing.
  CLOSED:     3	// The connection is closed or couldn't be opened.
};

export default {
	install(Vue, connectionString, opts) {
		let optionDefaults = {
		  connectionRetryInterval: 2000,
      connectionRetryMax: 65535,
      connectionRetryIntervalMax: 20 * 1000
    };

	  Vue.prototype.$socketOptions = Object.assign(optionDefaults, opts, { connectionString });

    Vue.prototype.$socketOptions.connectionRetryCount = 0;

		let addListeners = function() {
		  if (Vue.prototype.$socket) delete Vue.prototype.$socket;

      let socket = new WebSocket(Vue.prototype.$socketOptions.connectionString || "");
      Vue.prototype.$socket = socket;

      socket.onopen = () => {
        if (this.$options["socket"]) {
          let conf = this.$options.socket;

          if (conf.events) {
            Object.keys(conf.events).forEach((key) => {
              let func = conf.events[key].bind(this);
              socket.onmessage = (messageEvent) => {
                func(messageEvent.data, this.$store);
              };
              conf.events[key].__binded = func;
            });
          }
        }
      };

      socket.onerror = (err) => {
        console.log('socket error:', err);
        console.log('socket error this context:', this);
      };

      socket.onclose = (err) => {
        console.log('socket close:', err);
        console.log('socket close this context:', this);
      };

      socket.onclose = () => {
        console.log(`Connection closed to vision server. Retrying with back-off.`);

        delete Vue.prototype.$socket;
        Vue.prototype.$socketOptions.connectionRetryCount++;

        if (Vue.prototype.$socketOptions.connectionRetryMax > 0 && Vue.prototype.$socketOptions.connectionRetryCount > Vue.prototype.$socketOptions.connectionRetryMax) {
          console.log(`Connection retries exhausted. Max: ${Vue.prototype.$socketOptions.connectionRetryMax}`);
          return;
        }

        Vue.prototype.$socketOptions.connectionRetryInterval = Math.pow(2, Vue.prototype.$socketOptions.connectionRetryCount) * 1000;

        if (Vue.prototype.$socketOptions.connectionRetryInterval > Vue.prototype.$socketOptions.connectionRetryIntervalMax) {
          Vue.prototype.$socketOptions.connectionRetryInterval = Vue.prototype.$socketOptions.connectionRetryIntervalMax;
        }

        setTimeout(() => addListeners.bind(this), Vue.prototype.$socketOptions.connectionRetryInterval);
        console.log(`Retrying connection to server in ${Vue.prototype.$socketOptions.connectionRetryInterval/1000} seconds.`);
      }
		};

		let removeListeners = function() {
			if (this.$options["socket"]) {
				let conf = this.$options.socket;

				if (conf.namespace) {
					this.$socket.disconnect();
				}

				if (conf.events) {
					let prefix = conf.prefix || "";
					Object.keys(conf.events).forEach((key) => {
						this.$socket.off(prefix + key, conf.events[key].__binded);
					});
				}
			}
		};

		Vue.mixin({
			// Vue v1.x
			beforeCompile: addListeners,

			// Vue v2.x
			beforeCreate: addListeners,


			beforeDestroy: removeListeners
		});

	}

};
