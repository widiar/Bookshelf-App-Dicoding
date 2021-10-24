const UNREAD_LIST_BOOK_ID = "unread"
const READ_LIST_BOOK_ID = "read"
const BOOK_ITEMID = "bookId"
let myModal, bookUpdateElement

const searchBook = () => {
    const inputSearch = document.getElementById("search").value
    let bookSearch = books.filter((book) => book.title.includes(inputSearch))
    const listUncompleted = document.getElementById(UNREAD_LIST_BOOK_ID)
    let listCompleted = document.getElementById(READ_LIST_BOOK_ID)
    listUncompleted.querySelectorAll(".item").forEach(el => el.remove())
    listCompleted.querySelectorAll(".item").forEach(el => el.remove())
    for(let book of bookSearch){
        const newData = makeBook(book.title, book.author, book.year, book.isComplete)
        newData[BOOK_ITEMID] = book.id

        if(book.isComplete) listCompleted.append(newData)
        else listUncompleted.append(newData)
    }
}

const addBook = ()  => {
    const unreadBookList = document.getElementById(UNREAD_LIST_BOOK_ID)
    const title = document.getElementById("title").value
    const author = document.getElementById("author").value
    const year = document.getElementById("year").value

    document.getElementById("search").value = ""
    searchBook()

    let book = makeBook(title, author, year, false)
    const bookObject  = composeDataObject(title, author, year, false)
    book[BOOK_ITEMID] = bookObject.id
    books.push(bookObject)

    unreadBookList.append(book)
    updateDataToStorage()

    showModalSuccess("Sukses", "Berhasil Menambah Data Buku")
}

const makeBook = (title, author, year, isReaded) => {
    const textTitle = document.createElement("h2")
    textTitle.innerText = title

    const textAuthor = document.createElement("p")
    textAuthor.classList.add("author")
    textAuthor.innerHTML = `<i>${author}</i>`

    const textYear = document.createElement("p")
    textYear.classList.add("year")
    textYear.innerHTML = `<i>${year}</i>`

    const textContainer = document.createElement("div")
    textContainer.classList.add("text-container")
    textContainer.append(textTitle, textAuthor, textYear)

    const container = document.createElement("div")
    container.classList.add("item", "card")
    container.append(textContainer)

    const buttonContainer = document.createElement("div")
    buttonContainer.classList.add("button-container")

    if(isReaded) buttonContainer.append(createUndoButton())
    else buttonContainer.append(createCheckButton())
    buttonContainer.append(createTrashButton(), createEditButton())

    container.append(buttonContainer)

    return container
}

const addReadedBook = (bookElement) => {
    const title = bookElement.querySelector(".text-container > h2").innerText
    const author = bookElement.querySelector(".text-container > .author").innerText
    const year = bookElement.querySelector(".text-container > .year").innerText
    const readedBook = document.getElementById(READ_LIST_BOOK_ID)

    let book = makeBook(title, author, year, true)
    let bookStorage = findBook(bookElement[BOOK_ITEMID])
    bookStorage.isComplete = true
    book[BOOK_ITEMID] = bookStorage.id

    readedBook.append(book)
    bookElement.remove()

    updateDataToStorage()
}

const undoRead = (bookElement) => {
    const title = bookElement.querySelector(".text-container > h2").innerText
    const author = bookElement.querySelector(".text-container > .author").innerText
    const year = bookElement.querySelector(".text-container > .year").innerText
    const unreadBook = document.getElementById(UNREAD_LIST_BOOK_ID)

    let book = makeBook(title, author, year, false)
    let bookStorage = findBook(bookElement[BOOK_ITEMID])
    bookStorage.isComplete = false
    book[BOOK_ITEMID] = bookStorage.id

    unreadBook.append(book)
    bookElement.remove()

    updateDataToStorage()
}

const deleteBook = (bookElement) => {
    const title = bookElement.querySelector(".text-container > h2").innerText
    const modal = document.getElementById("deleteModal")
    modal.style.display = "block"
    closeMyModal(modal)
    myModal = modal

    modal.querySelector("#deleteTitle").innerText = `"${title}"`

    const noButton = modal.querySelector(".modal-content > .modal-body > .btn-red")
    noButton.addEventListener("click", () => {
        modal.style.display = "none"
    })

    const yesButton = modal.querySelector(".modal-content > .modal-body > .btn-green")
    yesButton.addEventListener("click", () => {
        const position = findBookIndex(bookElement[BOOK_ITEMID])
        books.splice(position, 1)
        modal.style.display = "none"
        bookElement.remove()
        updateDataToStorage()
        showModalSuccess("Sukses", "Berhasil Menghapus Data Buku")
    })

}



const editBook = (bookElement) => {
    let book = findBook(bookElement[BOOK_ITEMID])
    document.getElementById("title").value = book.title
    document.getElementById("author").value = book.author
    document.getElementById("year").value = book.year
    document.getElementById(BOOK_ITEMID).value = bookElement[BOOK_ITEMID]

    const buttonSubmitForm = document.getElementById("submit")
    buttonSubmitForm.innerText = "Update"
    const modal = document.getElementById("inputModal")
    modal.querySelector(".modal-content > .modal-header h2").innerText = "Update Book"
    modal.style.display = "block"
    closeMyModal(modal)
    myModal = modal

    bookUpdateElement = bookElement
}

const updateBook = () => {
    const title = document.getElementById("title").value
    const author = document.getElementById("author").value
    const year = document.getElementById("year").value
    const id =  document.getElementById(BOOK_ITEMID).value

    let book = findBook(parseInt(id))
    book.title = title
    book.author = author
    book.year = year

    bookUpdateElement.querySelector(".text-container > h2").innerText = title
    bookUpdateElement.querySelector(".text-container > .author").innerHTML = `<i>${author}</i>`
    bookUpdateElement.querySelector(".text-container > .year").innerHTML = `<i>${year}</i>`

    updateDataToStorage()

    showModalSuccess("Sukses", "Berhasil Update Data Buku");
}

const showModalSuccess = (title, text) => {
    const modal = document.getElementById("alertModal")
    modal.style.display = "block"
    const closeButton = modal.querySelector(".modal-content > .modal-body > button")
    modal.querySelector(".modal-content > .modal-body > h1").innerText = title
    modal.querySelector(".modal-content > .modal-body > h3").innerText = text
    closeButton.addEventListener("click", () => {
        modal.style.display = "none"
    })
    closeMyModal(modal)
}

const closeMyModal = (modal) => {
    const closeModal = document.querySelectorAll(".close-modal")
    closeModal.forEach(element => {
        element.onclick = () => {modal.style.display = "none"}
    });
    window.onclick = (e) => {
        if(e.target == modal) modal.style.display = "none"
    }
}


const createButton = (buttonTypeClass, eventListener) => {
    const button = document.createElement("button");
    button.classList.add(buttonTypeClass);
    button.addEventListener("click", function (event) {
        eventListener(event);
    });
    return button;
}


const createCheckButton = () => {
    return createButton("book-button", function(e){
        addReadedBook(e.target.parentElement.parentElement)
    })
}

const createEditButton = () => {
    return createButton("edit-button", function(e){
        editBook(e.target.parentElement.parentElement)
    })
}
const createTrashButton = () => {
    return createButton("trash-button", function(e){
        deleteBook(e.target.parentElement.parentElement)
    })
}

const createUndoButton = () => {
    return createButton("undo-button", function(e){
       undoRead(e.target.parentElement.parentElement)
    })
}