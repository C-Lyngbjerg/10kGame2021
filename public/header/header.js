// (async function() {
//     const navList = $('#navLinkList');
//     const newLI = $('<li class="nav-item active"></li>')
//     const user = await fetch('/api/isAuth');
//     console.log(user.isAuth);
//     if(user.isAuth){
//         newLI.append('<a class="nav-item nav-link" href="/logout"> Logout</a>');
        
//         navList.append(newLI);
//     }
// })();