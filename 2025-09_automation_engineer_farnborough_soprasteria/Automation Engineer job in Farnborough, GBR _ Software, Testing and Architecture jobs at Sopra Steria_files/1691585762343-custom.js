// function hasClass(element, cls) {
//     return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
// }

// /*====== Header Mobile Menu functionality Start ======*/

// function toggle_menu() {
//     // debugger;
//     var navBar = document.getElementsByClassName('header-menu')[0];
//     var menuIcon = document.getElementsByClassName('icon-menu')[0];
//     if (!hasClass(navBar, 'show')) {
//         navBar.classList.add("show");
//         menuIcon.classList.add("icon-cancel");
//     } else {
//         navBar.classList.remove("show");
//         menuIcon.classList.remove("icon-cancel");
//     }
// }

// /*====== Header Mobile Menu functionality End ======*/


// document.addEventListener('DOMContentLoaded', function() {
//     setTimeout(function() {
//         var jobCartEle = document.querySelector('.phs-job-cart-area');
//         if (jobCartEle) {
//             jobCartEle.addEventListener('focus', function() {
//                 if (window.innerWidth <= 767) {
//                     if (document.querySelector('.nav').classList.contains('show') == true) {
//                         toggle_menu();
//                     }
//                 }
//             })
//         }

//     }, 1000);
// })

// function secondDropDown(event, id) {
//     // debugger;
//     if (id == 1) {
//         var newlist = document.querySelector('.first-arrow .icon');
//     }
//     //  var getArrowIcon = document.querySelector('.nav-list-items .icon');
//     var getArrowIcon = newlist;
//     var areaOfExpert = document.querySelectorAll('.area-experts');
//     var subItemsMenu = document.querySelectorAll('.sub-items');
//     var areaOfExperts;
//     if (event && event.type == "blur") {
//         areaOfExperts = document.querySelector('.persona-navbar .nav-list-items.active button');
//     } else {
//         areaOfExperts = event.currentTarget;
//     }
//     if (!areaOfExperts) { }
//     var listItem = areaOfExperts.parentElement;
//     var subItems = listItem && listItem.getElementsByClassName('sub-items')[0];
//     // var subItemsParent = subItems.parentElement;
//     if (areaOfExpert.length >= 0) {
//         for (var i = 0; i < areaOfExpert.length; i++) {
//             var element = areaOfExpert[i];
//             var buttonDatPhValue = element.getAttribute('data-ph-id');
//             var buttonAreaDataPhValue = areaOfExperts.getAttribute('data-ph-id');
//             if (buttonAreaDataPhValue != buttonDatPhValue) {
//                 element.setAttribute('aria-expanded', 'false');
//             }
//         }
//     }
//     if (subItemsMenu.length >= 0) {
//         for (var i = 0; i < subItemsMenu.length; i++) {
//             var element = subItemsMenu[i];
//             var subMenuDataPhValue = element.getAttribute('data-ph-id');
//             var subMenuItemsDataValue = subItems.getAttribute('data-ph-id')
//             if (subMenuDataPhValue != subMenuItemsDataValue) {
//                 element.classList.remove("show");
//                 element.setAttribute('aria-hidden', 'true');
//                 element.parentElement.classList.remove('active');
//                 var dropDownListParent = document.getElementsByClassName('nav-list-items')[0]
//                 dropDownListParent.children[0].getElementsByTagName('i')[0].classList.add('icon-down-arrow');
//                 dropDownListParent.children[0].getElementsByTagName('i')[0].classList.remove('icon-up-arrow');
//             }
//         }
//     }
//     if (subItems.classList.contains('show')) {
//         subItems.classList.remove("show");
//         listItem.classList.remove('active');
//         subItems.setAttribute('aria-hidden', 'true');
//         areaOfExperts.setAttribute('aria-expanded', 'false');
//         getArrowIcon.classList.remove('icon-up-arrow');
//         getArrowIcon.classList.add('icon-down-arrow');
//     } else {
//         subItems.classList.add("show");
//         listItem.classList.add('active');
//         subItems.setAttribute('aria-hidden', 'false');
//         areaOfExperts.setAttribute('aria-expanded', 'true');
//         getArrowIcon.classList.remove('icon-down-arrow');
//         getArrowIcon.classList.add('icon-up-arrow');
//     }
// }

// const navdropdownitems = document.getElementsByClassName('sub-navigation')
// function dropDown(value){
//     navdropdownitems[0].classList.toggle('hide')
// }


function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

/*====== Header Mobile Menu functionality Start ======*/

function toggle_menu() {
    // debugger;
    var navBar = document.getElementsByClassName('header-menu')[0];
    var menuIcon = document.getElementsByClassName('icon-menu')[0];
    if (!hasClass(navBar, 'show')) {
        navBar.classList.add("show");
        menuIcon.classList.add("icon-cancel");
    } else {
        navBar.classList.remove("show");
        menuIcon.classList.remove("icon-cancel");
    }
}

/*====== Header Mobile Menu functionality End ======*/


document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        var jobCartEle = document.querySelector('.phs-job-cart-area');
        if (jobCartEle) {
            jobCartEle.addEventListener('focus', function() {
                if (window.innerWidth <= 767) {
                    if (document.querySelector('.nav').classList.contains('show') == true) {
                        toggle_menu();
                    }
                }
            })
        }

    }, 1000);
})

function secondDropDown(event, id) {
    // debugger;
    if (id == 1) {
        var newlist = document.querySelector('.first-arrow .icon');
    }
   
    //  var getArrowIcon = document.querySelector('.nav-list-items .icon');
    var getArrowIcon = newlist;
    var areaOfExpert = document.querySelectorAll('.area-experts');
    var subItemsMenu = document.querySelectorAll('.sub-items');
    var areaOfExperts;
    if (event && event.type == "blur") {
        areaOfExperts = document.querySelector('.persona-navbar .nav-list-items.active button');
    } else {
        areaOfExperts = event.currentTarget;
    }
    if (!areaOfExperts) { }
    var listItem = areaOfExperts.parentElement;
    var subItems = listItem && listItem.getElementsByClassName('sub-items')[0];
    // var subItemsParent = subItems.parentElement;

    if (areaOfExpert.length >= 0) {
        for (var i = 0; i < areaOfExpert.length; i++) {
            var element = areaOfExpert[i];
            var buttonDatPhValue = element.getAttribute('data-ph-id');
            var buttonAreaDataPhValue = areaOfExperts.getAttribute('data-ph-id');
            if (buttonAreaDataPhValue != buttonDatPhValue) {
                element.setAttribute('aria-expanded', 'false');
            }
        }

    }
    if (subItemsMenu.length >= 0) {

        for (var i = 0; i < subItemsMenu.length; i++) {
            var element = subItemsMenu[i];
            var subMenuDataPhValue = element.getAttribute('data-ph-id');
            var subMenuItemsDataValue = subItems.getAttribute('data-ph-id')
            if (subMenuDataPhValue != subMenuItemsDataValue) {
                element.classList.remove("show");
                element.setAttribute('aria-hidden', 'true');
                element.parentElement.classList.remove('active');
                var dropDownListParent = document.getElementsByClassName('nav-list-items')[0]
                dropDownListParent.children[0].getElementsByTagName('i')[0].classList.add('icon-down-arrow');
                dropDownListParent.children[0].getElementsByTagName('i')[0].classList.remove('icon-up-arrow');
            }
        }
    }

    if (subItems.classList.contains('show')) {
        subItems.classList.remove("show");
        listItem.classList.remove('active');
        subItems.setAttribute('aria-hidden', 'true');
        areaOfExperts.setAttribute('aria-expanded', 'false');
        getArrowIcon.classList.remove('icon-up-arrow');
        getArrowIcon.classList.add('icon-down-arrow');
    } else {
        subItems.classList.add("show");
        listItem.classList.add('active');
        subItems.setAttribute('aria-hidden', 'false');
        areaOfExperts.setAttribute('aria-expanded', 'true');
        getArrowIcon.classList.remove('icon-down-arrow');
        getArrowIcon.classList.add('icon-up-arrow');
    }

}

// const navdropdownitems = document.getElementsByClassName('sub-navigation')
// const iconDownArrow = document.querySelector('.drop-down .icon-down-arrow')
// function dropDown(value){
//     navdropdownitems[0].classList.toggle('hide')
//     if(iconDownArrow.classList.contains('icon-down-arrow')){
//         iconDownArrow.classList.remove('icon-down-arrow')
//         iconDownArrow.classList.add('icon-up-arrow')
//     }else{
//         iconDownArrow.classList.add('icon-down-arrow')
//         iconDownArrow.classList.remove('icon-up-arrow')
//     }
    
// }

const navdropdownitems = document.getElementsByClassName('sub-navigation');
const iconDownArrow = document.querySelector('.drop-down .icon-down-arrow');
const dropDownButton = document.getElementById('navigationbutton1'); // Get the dropdown button
// Function to close the dropdown
function closeDropDown() {
    navdropdownitems[0].classList.add('hide');
    iconDownArrow.classList.remove('icon-up-arrow');
    iconDownArrow.classList.add('icon-down-arrow');
}
// Event listener for clicks on the document body
document.body.addEventListener('click', function(event) {
    // Check if the clicked element is the dropdown button or its child
    if (!dropDownButton.contains(event.target)) {
        closeDropDown();
    }
});
// Function to handle the dropdown toggle
function dropDown() {
    navdropdownitems[0].classList.toggle('hide');
    if (iconDownArrow.classList.contains('icon-down-arrow')) {
        iconDownArrow.classList.remove('icon-down-arrow');
        iconDownArrow.classList.add('icon-up-arrow');
    } else {
        iconDownArrow.classList.add('icon-down-arrow');
        iconDownArrow.classList.remove('icon-up-arrow');
    }
}
