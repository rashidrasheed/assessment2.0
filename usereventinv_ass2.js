/**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 */

 define(['N/runtime','N/record','N/email'],
    function(runtime,record,email){
        // before load
        function beforeLoad(context){
            log.debug({
                title: 'Current Record', 
                details: context.currentRecord
            });
        }

        // afterSubmit function
        function afterSubmit(context){

            // get current record id
            var id = context.newRecord.id;
            
            // load invoice record
            var invRecord = record.load({
                type: record.Type.INVOICE, 
                id: id,
                isDynamic: true,
            });

            

            // getting invoice number
            var transidInv = invRecord.getValue("tranid");
            // getting sales order id
            var createdfrom = invRecord.getValue("createdfrom");
            // getting date value
            var date = invRecord.getValue("trandate");

            // get transId of sales order
            var soRecord = record.load({
                type: record.Type.SALES_ORDER, 
                id: createdfrom,
                isDynamic: true,
            });

            var transIdSO = soRecord.getValue("tranid");
            

            // adding logs in custom record type
            //addCustomRecord(date, createdfrom, id, transidInv,transIdSO);

            // send email  to admin
            sendEmail(id, transidInv, createdfrom);


            
            log.debug ({
                title: 'Success',
                details: context
            });
            

        }

        // function to add logs in custom record type
        /*
        function add(date, createdfrom, id, transidInv,transIdSO){

            // create record
            var rec = record.create({
                type: 'customrecord_inv_logs',
                isDynamic: true,
                defaultValues: {
                    custrecord_invdate: date,
                    custrecord_soid: createdfrom,
                    custrecord_invid: id,
                    custrecord_invno: id,
                } 
            });

            rec.save({
                enableSourcing: true,
                ignoreMandatoryFields: true
            });
        }*/

        
        // function to send email to admin
        function sendEmail(id, transid, createdfrom){
            
            // email message
            var emailMsg = "Hi(from 2.0),\n";
            emailMsg += "The invoice for Sales Order # " + createdfrom + " has been generated. Invoice number is "+ transid +" and Invoice internal ID is " + id;

            email.send({
                author: runtime.getCurrentUser().id,
                recipients: "rrasheed@folio3.com",
                subject: "NetSuite Invoice (2.0)",
                body: emailMsg
            });
        }

        return {
            beforeLoad:beforeLoad,
            afterSubmit:afterSubmit
        }
    }
 );