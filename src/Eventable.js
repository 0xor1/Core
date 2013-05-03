/**
 * User: 0xor1  http://github.com/0xor1
 * Date: 20/04/13
 */

(function(NS){

    /**
     * Provides Core functionality
     *
     * @module CORE
     */

    var ns = window[NS] = window[NS] || {}
        , objId = 0
        , freedObjIds = []
        , fnId = 0
        , freedFnIds = []
        , rs = {}
        ;

    //Resource Strings
    rs._ = '_';
    rs.prfx = rs._ + NS + rs._;
    rs.fnId = rs.prfx + 'id';
    rs.fnUsageCount = rs.prfx + 'usageCount';

    /**
     * Makes objects eventable, identifiable and disposable
     *
     * @class Eventable
     * @constructor
     */
    ns.Eventable = function(){
        this._id = getAnUnusedObjId();
        //following properties are only created when they are first required to save on unnecessary memory usage
        //this._eventContracts
        //this._eventContractQueues
    };


    ns.Eventable.prototype = {

        /**
         * Get the objects unique ID
         *
         * @method id
         * @returns {Number} The objects ID
         */
        id: function(){
            return this._id;
        },

        /**
         * Add an event listener
         *
         * @method on
         * @param {Eventable} obj The object to listen to
         * @param {String} type The type of event to listen for
         * @param {Function} fn The function to call on the event
         * @chainable
         */
        on: function(obj, type, fn){

            var queues = obj._eventContractQueues = obj._eventContractQueues || {}
                , queue = queues[type] = queues[type] || []
                , contracts = this._eventContracts = this._eventContracts || {}
                , contract = new EventContract(this, obj, type, fn)
                ;

            if(typeof contracts[contract.key] === 'undefined'){
                queue.push(contract);
                (typeof fn[rs.fnUsageCount] === 'number') ? fn[rs.fnUsageCount]++ : fn[rs.fnUsageCount] = 1;
                contracts[contract.key] = contract;
                if(queue.isDispatching){
                    queue.numListenersAdded++;
                }
            }

            return this;
        },

        /**
         * Remove an event listener
         *
         * @method off
         * @param {Eventable} obj The object to stop listening to
         * @param {String} type The type of event to stop listening for
         * @param {Function} fn The function to remove
         * @chainable
         */
        off: function(obj, type, fn){

            if(!this._eventContracts){return this;}

            var contract = this._eventContracts[EventContract.generateKey(obj, type, fn)]
                , queue
                , idx
                ;

            if(!contract){return this;}

            queue = obj._eventContractQueues[type];
            idx = queue.indexOf(contract);

            if(queue.isDispatching){
                queue.updated = true;
                queue.removedIndexes.push(idx);
            }
            queue.splice(idx, 1);
            fn[rs.fnUsageCount]--;
            if(fn[rs.fnUsageCount] === 0){
                freeFnId(fn);
            }
            delete this._eventContracts[contract.key];

            return this;
        },

        /**
         * Fire an event
         *
         * @method fire
         * @param {Object} event The event object to fire, must contain atleast a '.type' property
         * @chainable
         */
        fire: function(event){

            if(typeof this._eventContractQueues === 'undefined'){
                return;
            }

            var queue = this._eventContractQueues[event.type];

            if(typeof queue !== 'undefined'){

                if(queue.isDispatching){
                    return;
                }

                queue.isDispatching = true;
                queue.dispatchQueueUpdated = false;
                queue.removedIndexes = [];
                queue.numListenersAdded = 0;

                event.obj = this;

                for(var i = 0, l = queue.length; i < l; i++){
                    if(queue.dispatchQueueUpdated){
                        l = queue.length - queue.numListenersAdded;
                        var iOld = i;
                        for(var j = 0, k = queue.removedIndexes.length; j < k; j++){
                            if(queue.removedIndexes[ j ] < iOld){
                                i--;
                            }
                        }
                        queue.removedIndexes = [];
                        queue.dispatchQueueUpdated = false;
                    }
                    queue[i].fulfill(event);
                }
                queue.isDispatching = false;
            }

            return this;
        },

        /**
         *  Remove all the objects own event listeners and all of the event listeners from other objects attached to this object.
         *  It then deletes all of the objects properties.
         *
         *  @method dispose
         */
        dispose: function(){

            var contracts = this._eventContracts;

            if(contracts){
                for(var key in contracts){
                    if(contracts.hasOwnProperty(key)){
                        contracts[key].finalise();
                    }
                }
            }

            var queues = this._eventContractQueues;

            if(queues){
                for(var i in queues){
                    if(queues.hasOwnProperty(i)){
                        var queue = queues[i];
                        var l = queue.length;
                        for(var j = 0; j < l; j++){
                            queue[j].finalise();
                        }
                    }
                }
            }
            freedObjIds.push(this._id);
            for(i in this){
                if(this.hasOwnProperty(i)){
                    delete this[i];
                }
            }
        }
    };

    /**
     * Removes a functions ID and makes it available to e assigned again
     *
     * @private
     * @method freeFnId
     * @param {Function} fn The Function to have its ID removed
     */
    function freeFnId(fn){
        freedFnIds.push(fn[rs.fnId]);
        delete fn[rs.fnId];
    }

    /**
     * Gets an unused Function ID
     *
     * @private
     * @method getAnUnusedFnId
     * @returns {Number} An unused Function ID
     */
    function getAnUnusedFnId(){
        return (freedFnIds.length > 0) ? freedFnIds.pop() : fnId++;
    }

    /**
     * Gets an unused Object ID
     *
     * @private
     * @method getAnUnusedObjId
     * @returns {Number} An unused Object ID
     */
    function getAnUnusedObjId(){
        return (freedObjIds.length > 0) ? freedObjIds.pop() : objId++;
    }


    var EventContract = (function(){

        /**
         * Specifies an event binding
         *
         * @class EventContract (private to Eventable)
         * @param {Eventable} owner The listening object
         * @param {Eventable} obj The object being listened to
         * @param {String} type The type of the event being listened for
         * @param {Function} fn The function to call on the event
         * @constructor
         */
        function EventContract(owner, obj, type, fn){
            this.owner = owner;
            this.obj = obj;
            this.type = type;
            this.fn = fn;
            this.key = EventContract.generateKey(obj, type, fn);
        }

        /**
         * Calls the function in the context of the owner object, i.e. fulfilling the event contract.
         *
         * @method fulfill
         * @param {Object} event The event object to pass to listener functions
         */
        EventContract.prototype.fulfill = function(event){
            this.fn.call(this.owner, event);
        };

        /**
         * Destroys the event contract
         *
         * @method finalise
         */
        EventContract.prototype.finalise = function(){
            this.owner.off(this.obj, this.type, this.fn);
        };

        /**
         * Returns a unique signature for the event contract ensuring no duplicate contracts are made.
         *
         * @static
         * @method generateKey
         * @param {Eventable} obj The object being listened to
         * @param {String} type The type of event being listend for
         * @param {Function} fn The function to call when the event is fired
         * @returns {string} The unique key for this event contract
         */
        EventContract.generateKey = function(obj, type, fn){
            var fnId = fn[rs.fnId] = (typeof fn[rs.fnId] === 'undefined') ? getAnUnusedFnId() : fn[rs.fnId];
            return rs._ + obj._id + rs._ + type + rs._ + fnId;
        };

        return EventContract;

    })();


})(NS);