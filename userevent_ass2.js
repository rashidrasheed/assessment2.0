/**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 */

 define(['N/runtime','N/record'],
    function(runtime,record){

        // load function
        function load(context){

            if(runtime.executionContext.toLowerCase() == 'userinterface' && context.type == 'view'){

                var objRecord = record.load({
                    type: record.Type.SALES_ORDER, 
                    id: context.request.parameters.id,
                    isDynamic: true,
                });

                var status = objRecord.getValue("orderstatus");

                

                if(status == 'B' || status == 'F' ){

                    //var invoiceBtn = "var win = window.open('https://system.netsuite.com//app/site/hosting/scriptlet.nl?script=584&deploy=1&soid="+id+"','Generate Invoice','location=0,width=250,height=50');" + "";
                    var invoiceBtn = "alert(111)";
    
                    context.form.addButton({
                        id : 'custpage_btngi',
                        label : 'Generate Invoice02',
                        functionName: invoiceBtn
                    });
    
                }

                log.debug ({
                    title: 'Success',
                    details: context.form
                });
            }

        }

        return {
            beforeLoad:load
        }
    }
 );