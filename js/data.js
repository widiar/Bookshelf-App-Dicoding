const STORAGE_KEY = "book"

let books = []

const isStorageExist = () => {
    if(typeof(Storage) !== undefined) return true
    alert("Browser tidak menudukung")
    return false
}

const saveData = () => {
    const parsed = JSON.stringify(books)
    localStorage.setItem(STORAGE_KEY, parsed)
    console.log("Data saved successfully")
}

const loadDataFromStorage = () => {
    let data = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (data !== null) books = data;
    const listUncompleted = document.getElementById(UNREAD_LIST_BOOK_ID)
    let listCompleted = document.getElementById(READ_LIST_BOOK_ID)
    for(let book of books){
        const newData = makeBook(book.title, book.author, book.year, book.isComplete)
        newData[BOOK_ITEMID] = book.id

        if(book.isComplete) listCompleted.append(newData)
        else listUncompleted.append(newData)
    }
}

const updateDataToStorage = () => {
    if(isStorageExist()) saveData();
}

const composeDataObject = (title, author, year, isComplete) => { 
    return {
        id: +new Date(),
        title,
        author,
        year,
        isComplete,
    }
}

const findBook = (bookId) => {
    for(let book of books){
        if(book.id === bookId) return book;
    }
    return null;
}

const findBookIndex = (bookId) => {
    for(let book of books) if(book.id === bookId) return books.indexOf(book)
    return -1
}