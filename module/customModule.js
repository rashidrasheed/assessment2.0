/**
 * @NApiVersion 2.x
*/

define(['N/runtime','N/search', 'N/record'],
	function (nsRuntime, nsSearch, nsRecord) {

        // test function for modulesssss
        function test(ctx){

            
            return "Custom module test";
        }

		// Add the return statement that identifies the entry point funtions.
		return {
            test: test,
		}
	});