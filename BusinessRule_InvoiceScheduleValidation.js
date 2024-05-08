/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "InvoiceScheduleValidation",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "Invoice Schedule Validation",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "OrganizationCustomer", "Supplier" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : true,
  "onApprove" : "Never",
  "dependencies" : [ ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "LOVCrossValidationBusinessCondition",
  "parameters" : [ {
    "id" : "Config",
    "type" : "com.stibo.core.domain.parameter.LOVCrossValidationConfig",
    "value" : "<map>\n  <entry>\n    <key LOVID=\"InvoiceScheduleLOV\">Quarterly</key>\n    <value>\n      <set>\n        <element LOVID=\"PaymentTermsLOV\">Z078</element>\n        <element LOVID=\"PaymentTermsLOV\">V006</element>\n        <element LOVID=\"PaymentTermsLOV\">Z054</element>\n        <element LOVID=\"PaymentTermsLOV\">V076</element>\n        <element LOVID=\"PaymentTermsLOV\">V093</element>\n        <element LOVID=\"PaymentTermsLOV\">Z066</element>\n        <element LOVID=\"PaymentTermsLOV\">Z077</element>\n        <element LOVID=\"PaymentTermsLOV\">V088</element>\n        <element LOVID=\"PaymentTermsLOV\">Z068</element>\n        <element LOVID=\"PaymentTermsLOV\">Z050</element>\n        <element LOVID=\"PaymentTermsLOV\">Z022</element>\n        <element LOVID=\"PaymentTermsLOV\">Z058</element>\n        <element LOVID=\"PaymentTermsLOV\">Z089</element>\n        <element LOVID=\"PaymentTermsLOV\">V096</element>\n        <element LOVID=\"PaymentTermsLOV\">Z006</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"InvoiceScheduleLOV\">Monthly</key>\n    <value>\n      <set>\n        <element LOVID=\"PaymentTermsLOV\">V101</element>\n        <element LOVID=\"PaymentTermsLOV\">V046</element>\n        <element LOVID=\"PaymentTermsLOV\">V009</element>\n        <element LOVID=\"PaymentTermsLOV\">V085</element>\n        <element LOVID=\"PaymentTermsLOV\">V010</element>\n        <element LOVID=\"PaymentTermsLOV\">Z064</element>\n        <element LOVID=\"PaymentTermsLOV\">Z020</element>\n        <element LOVID=\"PaymentTermsLOV\">Z004</element>\n        <element LOVID=\"PaymentTermsLOV\">V054</element>\n        <element LOVID=\"PaymentTermsLOV\">Z076</element>\n        <element LOVID=\"PaymentTermsLOV\">Z067</element>\n        <element LOVID=\"PaymentTermsLOV\">Z018</element>\n        <element LOVID=\"PaymentTermsLOV\">Z060</element>\n        <element LOVID=\"PaymentTermsLOV\">V011</element>\n        <element LOVID=\"PaymentTermsLOV\">V045</element>\n        <element LOVID=\"PaymentTermsLOV\">Z046</element>\n        <element LOVID=\"PaymentTermsLOV\">V007</element>\n        <element LOVID=\"PaymentTermsLOV\">V044</element>\n        <element LOVID=\"PaymentTermsLOV\">V008</element>\n        <element LOVID=\"PaymentTermsLOV\">V081</element>\n        <element LOVID=\"PaymentTermsLOV\">V073</element>\n        <element LOVID=\"PaymentTermsLOV\">Z009</element>\n        <element LOVID=\"PaymentTermsLOV\">V078</element>\n        <element LOVID=\"PaymentTermsLOV\">Z055</element>\n        <element LOVID=\"PaymentTermsLOV\">Z041</element>\n        <element LOVID=\"PaymentTermsLOV\">Z089</element>\n        <element LOVID=\"PaymentTermsLOV\">V082</element>\n        <element LOVID=\"PaymentTermsLOV\">V091</element>\n      </set>\n    </value>\n  </entry>\n</map>"
  }, {
    "id" : "DefiningAttribute",
    "type" : "com.stibo.core.domain.Attribute",
    "value" : "LineOfBusinessInvoiceSchedule"
  }, {
    "id" : "DependentAttribute",
    "type" : "com.stibo.core.domain.Attribute",
    "value" : "TermsOfPayment"
  } ],
  "pluginType" : "Operation"
}
*/
