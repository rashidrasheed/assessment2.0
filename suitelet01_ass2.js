/**
 *@NApiVersion 2.x
 *@NScriptType Suitelet
 */

define(['N/runtime','N/record'],
    function(runtime,record){

        // variable for request and response
        var req;
        var res;
        
        function onRequest(context){

            req = context.request;
            res = context.response;

            // getting sales order id
            var soid = req.parameters.soid;

            if(typeof soid != 'undefined' && soid != null && soid != '') {
                res.writeLine('<h5>Invoice  Generating...</h5>');
                // function called to generate invoice
                generateInvoice(soid);
            }else {
                res.writeLine('<h5>Please provide SaleOrderID parameter</h5>');
            }

            /*
            log.debug ({
                title: 'Success',
                details: context.request.parameters.soid
            });
            */
        }

        function generateInvoice(id){

            var objRecord = record.load({
                type: record.Type.SALES_ORDER, 
                id: id,
                isDynamic: true,
            });

            var status = objRecord.getValue("orderstatus");

            if(status == 'B'){
                fulfillRecord(id)
            }else if(status == 'F'){    //if status is F = PENDING BILLING, then make its invoice
                invoicedRec(id)
            }else if(status == 'G'){    // if status  is G = BILLED, this record have already invoice, just show message
                res.writeLine('<h5>SORRY, Invoice is already generated for this sales order</h5>');
                res.writeLine('<h5>Go back & refresh page');
            }
            
        }

        // function to fulfill record after receiving id
        function fulfillRecord(id){
            // transform record from sales order to itemfulfillment using nlapiTransformRecord
            var fulfill = record.transform({
                fromType: record.Type.SALES_ORDER,
                fromId: id,
                toType: record.Type.ITEM_FULFILLMENT,
                isDynamic: true,
            });

            var fulfillId = fulfill.save({
                enableSourcing: true,
                ignoreMandatoryFields: true
            });

            // now record is fulfilled, make its invoice
            invoicedRec(id);
        }

        // function to make invoice of sale order
        function invoicedRec(id){

            // transform record from sales order to invoice using nlapiTransformRecord
            var invoiced = record.transform({
                fromType: record.Type.SALES_ORDER,
                fromId: id,
                toType: record.Type.INVOICE,
                isDynamic: true,
            });

            // getting currently generated invoice id
            var invId = invoiced.save({
                enableSourcing: true,
                ignoreMandatoryFields: true
            });

            // write success message for user
            res.writeLine('<h5>SUCCESS: Invoice Generated for sales order with internal ID:'+ invId +'</h5>');
            res.writeLine('<h5>Go back & refresh page');
        }

        return {
            onRequest:onRequest
        }
    }
);