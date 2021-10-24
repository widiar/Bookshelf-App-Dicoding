document.addEventListener("DOMContentLoaded", function(){
    const buttonAddBook = document.querySelector(".add-button > button")
    const submitForm = document.getElementById("form");

    const buttonSubmitForm = document.getElementById("submit")

    manageSearch()
    buttonAddBook.addEventListener("click", function(e){
        clearForm();
        buttonSubmitForm.innerText = "Insert"
        const modal = document.getElementById("inputModal")
        modal.querySelector(".modal-content > .modal-header h2").innerText = "Add Book"
        modal.style.display = "block"
        closeMyModal(modal)
        myModal = modal
    })

    submitForm.addEventListener("submit", function(e){
        e.preventDefault();
        if(validationForm()){
            const buttonTextSubmit = buttonSubmitForm.innerText
            if(buttonTextSubmit == "Insert") addBook();
            else updateBook()
            
            myModal.style.display = 'none'
        }else{
            const err = document.getElementById("error-year")
            err.style.display = "block"
            err.style.color = "red"
            err.innerText = "Tahun minimal 4 digit"
        }
    })

    document.getElementById("year").addEventListener("focus", () => document.getElementById("error-year").style.display = "none")

    if(isStorageExist()) loadDataFromStorage()

    document.getElementById("reset-btn").addEventListener("click", () => {
        document.getElementById("search").value = ""
        searchBook()
    })

    
})

const validationForm = () => {
    const year = document.getElementById("year").value
    if(year.length < 4) return false
    return true
}

const clearForm = () => {
    document.getElementById("title").value = ""
    document.getElementById("author").value = ""
    document.getElementById("year").value = "" 
    document.getElementById(BOOK_ITEMID).value = "" 
    document.getElementById("title").focus()
}
const manageSearch = () => {
    const inputSearch = document.getElementById("search")
    inputSearch.addEventListener("keyup", (e) => {
        if(e.code === 'Enter'){
            searchBook()
        }
    })
    inputSearch.addEventListener("focus", () => {
       document.querySelector(".info-search").style.display = "block"
    })
    inputSearch.addEventListener("blur", () => {
       document.querySelector(".info-search").style.display = "none"
    })
}