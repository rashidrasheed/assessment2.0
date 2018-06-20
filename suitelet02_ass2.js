/**
 *@NApiVersion 2.x
 *@NScriptType Suitelet
 */

define(['N/runtime','N/record','N/search','N/ui/serverWidget'],
    function(runtime,record,search,ui){

        // variable for request and response and method
        var req;
        var res;
        var method;
        var test111;
        
        function onRequest(context){

            req = context.request;
            res = context.response;
            method = req.method;

            //var form = nlapiCreateForm("Invoice Logs (Test)",false);
            var form = ui.createForm({
                title: 'Invoice Logs (Test)'
            });

            var startDate = form.addField({
                id: 'custpage_startdate',
                type: ui.FieldType.DATE,
                label: 'Start Date'
            });

            var endDate = form.addField({
                id: 'custpage_enddate',
                type: ui.FieldType.DATE,
                label: 'End Date'
            });

            if(method == 'POST'){

                var st = req.parameters.custpage_startdate
                var ed = req.parameters.custpage_enddate

                var recs = [];

                if(st != '' && ed !=''){

                    var invLogSearch = search.create({
                        type: "customrecord_inv_logs",
                        filters:
                        [
                           ["custrecord_invdate","within",st,ed]
                        ],
                        columns:
                        [
                           search.createColumn({name: "custrecord_invdate", label: "Invoice Date"}),
                           search.createColumn({name: "custrecord_soid", label: "Sale Order"}),
                           search.createColumn({name: "custrecord_invid", label: "Invoice ID"}),
                           search.createColumn({name: "custrecord_invno", label: "Invoice"})
                        ]
                     });
                     

                    invLogSearch.run().each(function(result){
                       recs.push(result);                     
                        return true;
                    });

                    log.debug ({
                        title: 'Result',
                        details: recs[0]
                    });


                }

                // show sub list
                var list = form.addSublist({
                    id : 'custpage_customso',
                    type : ui.SublistType.LIST,
                    label : 'Logs'
                });

                list.addField({
                    id : 'list_invdate',
                    type : ui.FieldType.TEXT,
                    label : 'Invoice Date'                    
                });

                list.addField({
                    id : 'list_soid',
                    type : ui.FieldType.TEXT,
                    label : 'Sale Order'                    
                });

                list.addField({
                    id : 'list_invno',
                    type : ui.FieldType.TEXT,
                    label : 'Invoice No.'
                });

                

                if(recs != null){
                    for(var i=0;i<recs.length;i++) {
                            list.setSublistValue({
                                id:"list_invdate",
                                line:i,
                                value:recs[i].getValue('custrecord_invdate')
                            });

                        list.setSublistValue({
                            id:"list_soid",
                            line:i,
                            value:recs[i].getText('custrecord_soid')
                        });

                        list.setSublistValue({
                            id:"list_invno",
                            line:i,
                            value:recs[i].getText('custrecord_invno')
                        });
                    }
                }




                // reset values
                form.updateDefaultValues({custpage_startdate:st, custpage_enddate:ed});
            }

            form.addSubmitButton({
                label: 'Show Logs'
            });

            res.writePage(form);

      
        }

        function returnCols(){
            return [
                    search.createColumn({name: "custrecord_invdate", label: "Invoice Date"}),
                    search.createColumn({name: "custrecord_soid", label: "Sale Order"}),
                    search.createColumn({name: "custrecord_invid", label: "Invoice ID"}),
                    search.createColumn({name: "custrecord_invno", label: "Invoice"})
                ];
        }

        function returnFilters(st,ed){
            return [
                ["custrecord_invdate","within",st,ed]
             ];
        }

        return {
            onRequest:onRequest
        }
    }
);