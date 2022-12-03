const modal = document.getElementById('modal');
const addBookmark = document.getElementById('addBookmark');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');

let bookmarksOb = {};

// Show Modal, Focus on Input
function showModal() {
    modal.classList.add('show-modal');
    websiteNameEl.focus();
}

// modal events
addBookmark.addEventListener('click', showModal);
modalClose.addEventListener('click', ()=> modal.classList.remove('show-modal'));
window.addEventListener('click', (e) => {e.target === modal ? modal.classList.remove('show-modal'):false}) ;

// Validate url
function validate(nameValue, urlValue) {
    const expression = /^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/g;
    const regexp = new RegExp(expression);
    if (!nameValue || !urlValue) {
        alert('Please submit values for both fields.')
    }
    if(!urlValue.match(regexp)) {
        alert('Please enter a valid web address');
        return false;
    }
    return true;
} 

function buildBookmarks() {
    bookmarksContainer.replaceChildren();
       
    Object.keys(bookmarksOb).forEach((bookmark)=> {

        const {name} = bookmarksOb[bookmark];

        const item = document.createElement('div');
        item.classList.add('item');
        
        const closeIcon = document.createElement('i');
        closeIcon.classList.add('fa-solid', 'fa-xmark');
        closeIcon.setAttribute('title','Deletebookmark');
        closeIcon.setAttribute('onclick', `deleteBookmark('${bookmark}')`);

        const linkInfo = document.createElement('div');
        linkInfo.classList.add('name');
        
        const favicon = document.createElement('img');
        favicon.setAttribute('src', `https://s2.googleusercontent.com/s2/favicons?domain=${bookmark}`);
        favicon.setAttribute('alt','Favicon');
        
        const link = document.createElement('a');
        link.setAttribute('href', `${bookmark}`);
        link.setAttribute('target', '_blank');
        link.textContent = name;

        linkInfo.append(favicon, link);
        item.append(closeIcon, linkInfo);
        bookmarksContainer.append(item);
    });
}

// get bookmarks form localstorage if available
function fetchBookmarks() {
    if(localStorage.getItem('bookmarks')) {
        bookmarksOb = JSON.parse(localStorage.getItem('bookmarks'));
    }else {
        bookmarksOb = {
            'https://brycedipalo.github.io/modernav/': {name : 'Bellissimo Creativo'}
        };
        localStorage.setItem('bookmarks', JSON.stringify(bookmarksOb));
    }
    buildBookmarks();
}

function deleteBookmark(bookmark) {

    if (bookmarksOb[bookmark]){delete bookmarksOb[bookmark]} 
    localStorage.setItem('bookmarks', JSON.stringify(bookmarksOb));
    fetchBookmarks();

}

function storeBookmark(event){
    event.preventDefault();
    const nameValue = websiteNameEl.value;
    let urlValue = websiteUrlEl.value;

    if (!urlValue.includes('http://','https://'))
    {
        urlValue= `https://${urlValue}`;
    }
    if (!validate(nameValue, urlValue)) {
        return false;
    }
    const bookmark = { name: nameValue };
    
    bookmarksOb[urlValue] = bookmark;

    localStorage.setItem('bookmarks', JSON.stringify(bookmarksOb));
    fetchBookmarks();
    bookmarkForm.reset();
    websiteNameEl.focus();
}

bookmarkForm.addEventListener('submit', storeBookmark);
fetchBookmarks();