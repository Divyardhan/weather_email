function preventBack() {
    window.history.forward();
}
preventBack();
window.onload = preventBack;
window.onpageshow = function(event) {
    if (event.persisted) {
        preventBack();
    }
}
window.onunload = function() {
    void(0);
}