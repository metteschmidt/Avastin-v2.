/* Support functions */

function monitorInclude(file)
{
  var script  = document.createElement('script');
  script.src  = file;
  script.type = 'text/javascript';
  script.defer = true;
  document.getElementsByTagName('head').item(0).appendChild(script);
}

/* include any js files here */
monitorInclude('../viewer/js/json2.js');


var monitorSavedSlideId = null;
var monitorSavedSlideName = null;
var monitorSavedSlideIndex = null;
var monitorSavedParentSlideName = null;
var monitorSavedParentOfParentSlideName = null;

var monitorPreviousSlideId = null;
var monitorPreviousSlideName = null;
var monitorPreviousSlideIndex = null;
var monitorPreviousParentSlideName = null;
var monitorPreviousParentOfParentSlideName = null;

function isMonitoringEnabled()
{
    return (typeof(monitoringEnabled) == 'boolean' && monitoringEnabled);
}

function now()
{
    return Math.floor(new Date().getTime()/1000);
}

function monitorSayHello()
{
    alert("Monitoring module says hello! Monitoring enabled " + isMonitoringEnabled());
}

function monitorSubmitEvent(monitorEvent)
{
    if (isMonitoringEnabled()) {
        // alert(monitorEvent.category);
        var invokeString = "objc://iplanner/monitoringEvent?" + encodeURIComponent(JSON.stringify(monitorEvent));
        // window.location = invokeString;
        
        iFrame = document.createElement("IFRAME");
        iFrame.setAttribute("src", invokeString);
        document.body.appendChild(iFrame); 
        iFrame.parentNode.removeChild(iFrame);
        iFrame = null;
    }
}

/* Agnitio monitorings support functions */


function submitSlideReEnter()
{
    if (monitorSavedSlideId) {
        submitSlideEnter(
            monitorSavedSlideId,
            monitorSavedSlideName,
            monitorSavedSlideIndex,
            monitorSavedParentSlideName,
            monitorSavedParentOfParentSlideName
        );
    }

}

function submitSlideEnter(slideId, slideName, slideIndex, parentSlideName, parentOfParentSlideName)
{
    if (monitorPreviousSlideId) {
        submitSlideExit();
    }

    var e = {
        type: "system",
        categoryId: null,
        category: "slideEnter",
        labelId: "id",
        label: "name",
        valueId: slideId,
        value: slideName,
        valueType: null,
        time: now(),
        slideIndex: slideIndex,
        parentSlideName: parentSlideName,
        parentOfParentSlideName: parentOfParentSlideName
    };

    monitorPreviousSlideId = slideId;

    monitorSavedSlideId = slideId;
    monitorSavedSlideName = slideName;
    monitorSavedSlideIndex = slideIndex;
    monitorSavedParentSlideName = parentSlideName;
    monitorSavedParentOfParentSlideName = parentOfParentSlideName;

    return monitorSubmitEvent(e);
}


function submitSlideExit()
{
    return __submitSlideExit(monitorPreviousSlideId, monitorPreviousSlideName, monitorPreviousSlideIndex, monitorPreviousParentSlideName, monitorPreviousParentOfParentSlideName);
}

function __submitSlideExit(slideId, slideName, slideIndex, parentSlideName, parentOfParentSlideName)
{
    if (!(monitorPreviousSlideId && monitorPreviousSlideId == slideId)) {
        return;
    }

    var e = {
        type: "system",
        categoryId: null,
        category: "slideExit",
        labelId: "id",
        label: "name",
        valueId: slideId,
        value: slideName,
        valueType: null,
        time: now(),
        slideIndex: slideIndex,
        parentSlideName: parentSlideName,
        parentOfParentSlideName: parentOfParentSlideName
    };

    monitorPreviousSlideId = null;

    return monitorSubmitEvent(e);
}

function submitDocumentOpen(documentId, documentName)
{

    var e = {
        type: "system",
        categoryId: null,
        category: "documentOpen",
        labelId: "id",
        label: "name",
        valueId: documentId,
        value: documentName,
        valueType: null,
        time: now(),
    };

    return monitorSubmitEvent(e);
}

function submitReferenceOpen(referenceId, referenceName)
{

    var e = {
        type: "system",
        categoryId: null,
        category: "referenceOpen",
        labelId: "id",
        label: "name",
        valueId: referenceId,
        value: referenceName,
        valueType: null,
        time: now()
    };

    return monitorSubmitEvent(e);
}


function submitCustomEvent(category, label, value, valueType, categoryId, labelId, valueId)
{
    var e = {
        type: "custom",
        categoryId: categoryId,
        category: category,
        labelId: labelId,
        label: label,
        valueId: valueId,
        value: value,
        valueType: valueType,
        time: now()
    };

    return monitorSubmitEvent(e);
}


function submitUniqueCustomEvent(category, label, value, valueType, categoryId, labelId, valueId)
{
    var e = {
        isUnique: true,
        type: "custom",
        categoryId: categoryId,
        category: category,
        labelId: labelId,
        label: label,
        valueId: valueId,
        value: value,
        valueType: valueType,
        time: now()
    };

    return monitorSubmitEvent(e);
}





