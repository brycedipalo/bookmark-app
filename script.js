const modal = document.getElementById('modal');
const addBookmark = document.getElementById('addBookmark');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');

let bookmarksArray = [];

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
    bookmarksArray.forEach((bookmark)=> {
        const {name, url } = bookmark;
        const item = document.createElement('div');
        item.classList.add('item');
        
        const closeIcon = document.createElement('i');
        closeIcon.classList.add('fa-solid', 'fa-xmark');
        closeIcon.setAttribute('title','Deletebookmark');
        closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`);

        const linkInfo = document.createElement('div');
        linkInfo.classList.add('name');
        
        const favicon = document.createElement('img');
        favicon.setAttribute('src', `https://s2.googleusercontent.com/s2/favicons?domain=${url}`);
        favicon.setAttribute('alt','Favicon');
        
        const link = document.createElement('a');
        link.setAttribute('href', `${url}`);
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
        bookmarksArray = JSON.parse(localStorage.getItem('bookmarks'));
    }else {
        bookmarksArray = [
            {
                name: 'Bellissimo Creativo',
                url: 'https://brycedipalo.github.io/modernav/',
            },
        ];
        localStorage.setItem('bookmarks', JSON.stringify(bookmarksArray));
    }
    buildBookmarks();
}

function deleteBookmark(url) {

    bookmarksArray.forEach((bookmark, i) => {
        console.log('delete bookmark', bookmark);
        if (bookmark.url === url) {
            bookmarksArray.splice(i, 1);            
        }
    });
    localStorage.setItem('bookmarks', JSON.stringify(bookmarksArray));
    fetchBookmarks();

}

function storeBookmark(event){
    event.preventDefault();
    const nameValue = websiteNameEl.value;
    let urlValue = websiteUrlEl.value;
    if(!urlValue.includes('http://','https://')) {
        urlValue= `https://${urlValue}`;
    }
    if (!validate(nameValue, urlValue)) {
        return false;
    }
    const bookmark = {
        name: nameValue,
        url: urlValue,
    };
    bookmarksArray.push(bookmark);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarksArray));
    fetchBookmarks();
    bookmarkForm.reset();
    websiteNameEl.focus();
}
bookmarkForm.addEventListener('submit', storeBookmark);
fetchBookmarks();