/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "ItemSupplier.Import.Condition",
  "type" : "BusinessCondition",
  "setupGroups" : [ "GlobalBusinessRulesRoot" ],
  "name" : "ItemSupplier.Import.Condition",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "SAKM_L2" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : true,
  "onApprove" : "Never",
  "dependencies" : [ {
    "libraryId" : "SgdbfNodeLib",
    "libraryAlias" : "SgdbfNodeLib"
  }, {
    "libraryId" : "Lib_StepBaseObject",
    "libraryAlias" : "StepBaseObject"
  } ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessConditionWithBinds",
  "binds" : [ {
    "contract" : "CurrentObjectBindContract",
    "alias" : "node",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "LoggerBindContract",
    "alias" : "logger",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,logger,SgdbfNodeLib,StepBaseObject) {
/*
 * ItemSupplier.Import.Condition / Import condition when importing a Item Supplier
 * ----------------------------------------------------------------------------
 * Bindings:
 * node -> current object
 * logger -> Step logger
 *
 * Dependencies:
 *  SgdbfNodeLib
 *  StepBaseObject
 * ----------------------------------------------------------------------------
 * created by Maxime Leandro
 *
 * History:
 *  - 01/10/18 transform with new lib & refactor check mandatory attribute
 *  - 18/09/2019  add control to check that the length product name < 240.
 */


/* global node, logger, SgdbfNodeLib */





/**
 *
 * @param {StepBaseObject} article
 */
function ItemSupplierImportCondition(article)
{
    var errors = [];
    if (article.getName() === ""||article.getName().length>240)
    {
        errors.push("Libellé article non renseigné ou dépasse les 240 caractères");
    }

    var mandatoryAttributeIds = [
        SAKM_1
    ];

    SgdbfNodeLib.checkMandatoryAttributes(article.object, mandatoryAttributeIds, errors);
    // checkValueIsInteger(article.object, valeurIsInteger, errors);

    if (errors.length === 0)
    {
        return true;
    }
    return errors.map(function(error)
    {
        return "- " + error;
    }).join("\n");
}

// MAIN
var article = StepBaseObject.newInstance(node, logger, "ItemSupplier.Import.Condition");
try{
    return ItemSupplierImportCondition(article);
}
catch ( error ) {
    throw article.traceException(error);
}
// END OF FILE
}