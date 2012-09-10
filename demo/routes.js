// The function is passed into keynes router as an argument,
// when the function is called it's passed a private method `map`
// to process the route. This technique is normally not very viable
// but since we only need one method to be declared it helps save some
// typing by eliminating the need for `this`.

// ... I'm a rubyist, I have an appreciation for the aesthetic.

Keynes.Router(function(map){
    map('/', "UsersContoller.index");
    map('/users/:id', "UsersContoller.show");
    map('/users/:id/edit', "UsersContoller.edit");
})