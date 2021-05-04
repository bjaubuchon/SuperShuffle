
//Execute the init function when the window is done loading
window.onload=init;

function init(){
	
//retrieve all <a> elements from the DOM and put them within an array variable called a
var a=document.getElementsByTagName("a");

/*for each <a> element in the array, set the onclick attribute so that when clicked  the current window changes to the url specified in the href attribute of that element*/
for(var i=0;i<a.length;i++)
{
    a[i].onclick=function()
    {
        window.location=this.getAttribute("href");
        return false;
    }
  }
};