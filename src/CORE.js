/**
 * User: 0xor1    http://github.com/0xor1
 * Date: 01/05/13
 */

(function(){


    var NS = 'CORE'
        , ns = {}
        , rs = ns.rs = {}
        ;

    //Misc
    rs._ = '_';
    rs.prfx = rs._ + NS + rs._;

    //Eventable
    rs.fnId = rs.prfx + 'id';
    rs.fnUsageCount = rs.prfx + 'usageCount';


    //GRUNT INJECT INTERNALS HERE


    //CORE API
    window[NS] = {

        Eventable: ns.Eventable,

        Dom: ns.Dom

    };


})();