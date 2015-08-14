function fbs_click() {
    u=location.href;
    t=document.title;
    window.open('http://www.facebook.com/sharer.php?u='+encodeURIComponent(u)+'&t='+encodeURIComponent(t),'sharer','toolbar=0,status=0,width=626,height=436');return false;
}
function tweet_click() {
    u=location.href;
    window.open('http://twitter.com/share?url='+encodeURIComponent(u),'sharer','toolbar=0,status=0,width=626,height=436');return false;
}
function in_click() {
    u=location.href;
    t=document.title;
    window.open('http://www.linkedin.com/shareArticle?mini=true&url='+encodeURIComponent(u)+'&title='+encodeURIComponent(t),'sharer','toolbar=0,status=0,width=518,height=410');return false;
}
