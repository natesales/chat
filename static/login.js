function sanitize(text) {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}

$("form").on("submit", function (e) {
    e.preventDefault();
    let room_id = $("input.message").val();
    window.location = window.location + "chat/" + room_id
});
