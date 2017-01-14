const socketState = {
  CONNECTING:	0, //	The connection is not yet open.
  OPEN:       1, //	The connection is open and ready to communicate.
  CLOSING:    2, //	The connection is in the process of closing.
  CLOSED:     3	// The connection is closed or couldn't be opened.
};

export default {
	install(Vue, connectionString, opts) {
		Vue.prototype.$socketOptions = Object.assign({}, opts, { connectionString });

		let addListeners = function() {
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
