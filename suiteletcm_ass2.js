/**
 *@NApiVersion 2.x
 *@NScriptType Suitelet
 *@NAmdConfig  ./config.json 
 */

define(['customModule'],
    function(customModule){

        // variable for request and response
        var req;
        var res;
        
        function onRequest(context){

            req = context.request;
            res = context.response;

            res.writeLine('<h5>SUITELET with custom module: '+ customModule.test(context) +'</h5>');

            /*
            log.debug ({
                title: 'Success',
                details: context.request.parameters.soid
            });
            */
        }

        return {
            onRequest:onRequest
        }
    }
);