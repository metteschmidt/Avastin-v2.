
function closePresentation()
{
    var invokeString = "objc://iplanner/closePresentation?";

    iFrame = document.createElement("iframe");
    iFrame.setAttribute("src", invokeString);
    document.body.appendChild(iFrame); 
    iFrame.parentNode.removeChild(iFrame);
    iFrame = null;
}



