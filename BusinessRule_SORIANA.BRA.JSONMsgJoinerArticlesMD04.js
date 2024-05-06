/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "SORIANA.BRA.JSONMsgJoinerArticlesMD04",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "SORIANA.BRA.JSONMsgJoinerArticlesMD04",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : false,
  "runPrivileged" : false,
  "onApprove" : "Never",
  "dependencies" : [ ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessActionWithBinds",
  "binds" : [ {
    "contract" : "CurrentObjectBindContract",
    "alias" : "logger",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "OutboundBusinessProcessorExecutionReportLoggerBindContract",
    "alias" : "executionReportLogger",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "OutboundBusinessProcessorJoinerSourceBindContract",
    "alias" : "joinerSource",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "OutboundBusinessProcessorJoinerResultBindContract",
    "alias" : "joinerResult",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ManagerBindContract",
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (logger,executionReportLogger,joinerSource,joinerResult,manager) {
logger.info("Node joiner");
/**
* Author : JUHO
* Description : Generate Outbound Message in JSON using Business Action Processor.
				OIEP: SORIANA.ProductOutboundArticlesMD04
				BRA Event Generator: SORIANA.BRA.ArticlesMD04.Event
				
* Date : 2023-04-26
* Last Modified by : JUHO
* Last Modification : 2023-04-26
* Last Update Remark: Initial Release
*/
// Function Section
/**
  * Description: Method that writes on the system log
  * @param  paramMessage : Message that is going to be written on the log.
  */
function loggerMethod(paramMessage){
    try{
        if (debug){
            logger.info(paramMessage);
        }
    }
    catch (e){
        throw e;
    } 
} 
/**
  * Description: Method that writes on the execution Report log
  * @param  paramMessage : Message that is going to be written on the log.
  */
function executionReportloggerMethod(paramMessage){
    try{
        if (exReport){
			executionReportLogger.logInfo(paramMessage);
        }
    }
    catch (e){
        throw e;
    } 
} 
/**
* Description: Method that initializes global variables.
* @param  paramDebug : this parameter lets you initialize debug global variable. If you want to debug
* you have to paramDebug = True
*/
function init (paramDebug, paramName){
    try{
        debug = paramDebug;
        name=paramName;
    }
    catch (e){
        loggerMethod(message);
        throw e;
    }
}

/**
* Description: Method that returns value ID from attribute value with LOV validation.
* @param product : Current Node
* @param attributeID : Attribute ID
*/

function getSingleValueLovID(product, attributeID) {
	var value = product.getValue(attributeID);
	if (value) {
		return value.getID();
	}
	return null;
}

/**
* Description: Method that returns simpleValue from attribute id bounded.
* @param product : Current Node
* @param attributeID : Attribute ID
*/

function getSingleValueValue(product, attributeID) {
	var value = product.getValue(attributeID).getSimpleValue();
	if (value) {
		return value;
	}
	return null;
}

/**
* Description: Method that returns value ID from attribute value with LOV validation bound to instance workflow variable.
* @param workflowInstance : Current Workflow Instance
* @param variable : workflow variable ID
*/

function getVariableSingleValueLovID(workflowInstance,variable) {
	var value = workflowInstance.getValue(variable).getID();
	if (value) {
		return value.getID();
	}
	return null;
}

/**
* Description: Returns the workflow instance where the Current Node is
* @param workflowInstance: Current Workflow Instance
* @param variable : workflow variable ID
*/

function getWorkflowTaskByID(workflowInstance,stateId) {
	var taskId = workflowInstance.getTaskByID(stateId);
	if (taskId) {
		return taskId;
	}
	return null;
}

/**
* Description: Returns taskId of current workflow from specific stateId
* @param wf : Current Workflow
* @param product : Current Object
*/

function getWorkflowInstance(product,wf) {
	var wfInstance = product.getWorkflowInstance(workflow);
	if (wfInstance) {
		return wfInstance;
	}
	return null;
}

/**
* Description: Returns the eventType from nodeHandlerSource bind
* @param nodeHanddlerSourceBind :  Node Handler Source bound to nodeHandlerSource
*/

function getEventType(nodeHanddlerSourceBind) {
	var eventType = nodeHanddlerSourceBind.getSimpleEventType();
	if (eventType) {
		return eventType;
	}
	return null;
}

/**
* Description: Returns the node from nodeHandlerSource bind
* @param nodeHanddlerSourceBind :  Node Handler Source bound to nodeHandlerSource
*/

function getParamNode(nodeHanddlerSourceBind) {
	var paramNode = nodeHanddlerSourceBind.getNode();
	if (paramNode) {
		return paramNode;
	}
	return null;
}

/**
* Description: Returns the node Id from nodeHandlerSource bind
* @param nodeHanddlerSourceBind :  Node Handler Source bound to nodeHandlerSource
*/

function getParamNodeId(nodeHanddlerSourceBind) {
	var paramNodeId = nodeHanddlerSourceBind.getNode().getID();
	if (paramNode) {
		return paramNode;
	}
	return null;
}
/**
* Description: Returns the paramAttribute value from the metadata Attribute from attributeParam bind.
*			   It will return attribute id if there is no metadata value.
* @param attributeBind	:  Attribute Bind
* @param metaAtt 		:  Metadata Attribute Id the holds the value
*/

function getMetadataAttValue(attributeBind, metaAtt) {
	var metadataAttValue = attributeBind.getValue(metaAtt.getID()).getSimpleValue();
	if (metadataAttValue) {
		return metadataAttValue;
	}
	else if (!metadataAttValue){
		return attributeBind.getID();
	}
	return null;
}
/**
* Description: Appends from source group to final JSON message
* @param messageGroup	:  messageGroup
*/

function appendFromGroup(messageGroup) {
  var seen = [];
  var first = true;
  while(joinerSource.hasNext(messageGroup)) {
    var messageString = joinerSource.getNextMessage(messageGroup);
    var hash = messageString.hashCode();
    if (seen.indexOf(hash) == -1) {
      seen.push(hash);
      if (first) {
        first = false;
      } else {
        joinerResult.appendToMessage(",");
      }
      joinerResult.appendToMessage(messageString);
    }
  }
}


// Main Section
/**
*
* @param {node} Current Object
* @param {workflow} Current Workflow
* @param {manager} STEP Manager
* @param {logger} Logger
// Node Handler Source bound to nodeHandlerSource
// Node Handler Result bound to nodeHandlerResult
// ExecutionReportLogger bound to executionReportLogger

* @param {string} fuenteIngreso 

*/
    // Global Variables
        // This variable lets you write on the system log (debug = True). It is a boolean. 
        var debug = true;
		// This variable lets you write on the execution report log (exReport = True). It is a boolean.
		var exReport = true;	        
		// Joiner Source bound joinerSource
		// Joiner Result bound to joinerResult

// Main Function
    try{
        init(true);
		loggerMethod("Starting Joinner");
		//joinerResult.appendToMessage("{\"productsEanRequest\":{\"products\":[");
		joinerResult.appendToMessage("{\"creacionArticulo\":[");
		appendFromGroup("creacionArticulo");
		joinerResult.appendToMessage("]}");
		
    }
    catch (e){
        throw e;
    }

}